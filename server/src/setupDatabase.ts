import { Client } from 'pg';

const queries = [
  {
    name: 'createUuidExtension',
    sql: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `,
  },
  {
    name: 'createUsersTable',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id          UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT usersPK PRIMARY KEY,
        name        varchar(30) NOT NULL UNIQUE,
        password    varchar(80) NOT NULL
      )
    `,
  },
  {
    name: 'createFilesTable',
    sql: `
      CREATE TABLE IF NOT EXISTS files (
        id          UUID NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT filesPK PRIMARY KEY,
        user_id     UUID NOT NULL,
        name        varchar(30) NOT NULL,
        code        text NOT NULL DEFAULT '',
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `,
  },
];

const setupDatabase = async () => {
  const client = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
  });
  await client.connect();
  try {
    for (const { name, sql } of queries) {
      console.log(`Executing ${name}...`);
      await client.query(sql);
      console.log(`${name} executed successfully`);
    }
  } catch (error) {
    console.error(error);
  }
  await client.end();
};

export default setupDatabase;
