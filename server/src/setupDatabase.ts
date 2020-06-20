import { Client } from 'pg';

import { DATABASE_URL } from './config';

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
  {
    name: 'addColumnsForSharingFiles',
    sql: `
      ALTER TABLE files
      ALTER COLUMN user_id DROP NOT NULL,
      ALTER COLUMN user_id SET DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS shared_edit_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
      ADD COLUMN IF NOT EXISTS shared_view_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
      ADD COLUMN IF NOT EXISTS shared_edit_enabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS shared_view_enabled BOOLEAN DEFAULT FALSE
    `,
  },
  {
    name: 'addLastOpenedColumn',
    sql: `
      ALTER TABLE files
      ADD COLUMN IF NOT EXISTS last_opened timestamptz DEFAULT NULL
    `,
  },
];

const setupDatabase = async () => {
  const client = new Client({
    connectionString: DATABASE_URL,
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
