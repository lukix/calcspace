import { v4 as uuid } from 'uuid';

const DbService = ({ dynamodb, parseResponseItem }) => {
  const setUpDatabase = async () => {
    const usersTableDefinition = {
      TableName: 'Users',
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 2,
      },
    };
    const usersUniquenessTableDefinition = {
      TableName: 'UsersUniqueness',
      KeySchema: [{ AttributeName: 'uniqueValue', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'uniqueValue', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2,
      },
    };
    const inactiveTokensTableDefinition = {
      TableName: 'InactiveTokens',
      KeySchema: [{ AttributeName: 'token', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'token', AttributeType: 'S' }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 2,
      },
    };
    const { TableNames: tableNames } = await dynamodb.listTables({}).promise();
    if (!tableNames.includes('Users')) {
      await dynamodb.createTable(usersTableDefinition).promise();
    }
    if (!tableNames.includes('UsersUniqueness')) {
      await dynamodb.createTable(usersUniquenessTableDefinition).promise();
    }
    if (!tableNames.includes('InactiveTokens')) {
      await dynamodb.createTable(inactiveTokensTableDefinition).promise();
    }
  };

  const getUserByName = async (name, { withHashedPassword = false } = {}) => {
    const scanParams = {
      TableName: 'Users',
      ProjectionExpression: withHashedPassword ? '#id, #name, #password' : '#id, #name',
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#name': 'name',
        ...(withHashedPassword ? { '#password': 'password' } : {}),
      },
      ExpressionAttributeValues: {
        ':name': { S: name },
      },
    };
    const scanResult = await dynamodb.scan(scanParams).promise();
    const user = parseResponseItem(scanResult.Items[0]);
    return user;
  };

  const getUserById = async (userId) => {
    const getItemParams = {
      TableName: 'Users',
      Key: {
        id: { S: userId },
      },
    };
    const result = await dynamodb.getItem(getItemParams).promise();
    return parseResponseItem(result.Item);
  };

  const getAllUsers = async () => {
    const scanParams = {
      TableName: 'Users',
      ProjectionExpression: '#id, #name, #createdAt, #updatedAt, #deleted',
      ExpressionAttributeNames: {
        '#id': 'id',
        '#name': 'name',
        '#createdAt': 'createdAt',
        '#updatedAt': 'updatedAt',
        '#deleted': 'deleted',
      },
    };
    const scanResult = await dynamodb.scan(scanParams).promise();
    const users = scanResult.Items.map(parseResponseItem);
    return users;
  };

  const isRefreshTokenBlacklisted = async (token) => {
    const getItemParams = {
      TableName: 'InactiveTokens',
      Key: {
        token: { S: token },
      },
    };
    const result = await dynamodb.getItem(getItemParams).promise();
    return Boolean(result.Item);
  };

  const addUser = async (username, hashedPassword) => {
    const id = uuid();
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: 'Users',
            Item: {
              id: { S: id },
              name: { S: username },
              password: { S: hashedPassword },
              createdAt: { N: `${Date.now()}` },
              updatedAt: { NULL: true },
              deleted: { BOOL: false },
            },
            ConditionExpression: 'attribute_not_exists(#id)',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
          },
        },
        {
          Put: {
            TableName: 'UsersUniqueness',
            Item: {
              uniqueValue: { S: `name#${username}` },
            },
            ConditionExpression: 'attribute_not_exists(#uniqueValue)',
            ExpressionAttributeNames: {
              '#uniqueValue': 'uniqueValue',
            },
          },
        },
      ],
    };
    await dynamodb.transactWriteItems(params).promise();
    return { id };
  };

  const addRefreshTokenToTheBlacklist = async (token, expireAt) => {
    const params = {
      TableName: 'InactiveTokens',
      Item: {
        token: { S: token },
        expireAt: { N: `${expireAt}` },
      },
      ConditionExpression: 'attribute_not_exists(#token)',
      ExpressionAttributeNames: {
        '#token': 'token',
      },
    };
    await dynamodb.putItem(params).promise();
  };

  const updateUser = async (userId, password) => {
    const params = {
      TableName: 'Users',
      Key: {
        id: { S: userId },
      },
      UpdateExpression: 'set #password = :password',
      ConditionExpression: 'attribute_exists(#id)',
      ExpressionAttributeValues: {
        ':password': { S: password },
      },
      ExpressionAttributeNames: {
        '#id': 'id',
        '#password': 'password',
      },
    };
    await dynamodb.updateItem(params).promise();
  };

  const deleteUser = async (userId) => {
    const params = {
      TableName: 'Users',
      Key: {
        id: { S: userId },
      },
      UpdateExpression: 'set #deleted = :deleted',
      ConditionExpression: 'attribute_exists(#id)',
      ExpressionAttributeValues: {
        ':deleted': { BOOL: true },
      },
      ExpressionAttributeNames: {
        '#id': 'id',
        '#deleted': 'deleted',
      },
    };
    await dynamodb.updateItem(params).promise();
  };

  return {
    setUpDatabase,
    getUserByName,
    getUserById,
    getAllUsers,
    isRefreshTokenBlacklisted,
    addRefreshTokenToTheBlacklist,
    addUser,
    updateUser,
    deleteUser,
  };
};

export default DbService;
