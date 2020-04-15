import { Client } from 'pg';

import { DB_NAME, DB_USER, DB_HOST, DB_PASSWORD } from './config';

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
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
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
