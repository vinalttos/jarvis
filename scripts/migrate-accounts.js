import "dotenv/config";
import { readFile } from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Configure DATABASE_URL no ambiente antes de migrar as contas.");
}

const accountsFile = process.env.ACCOUNTS_FILE || new URL("../data/accounts.json", import.meta.url);
const accounts = JSON.parse(await readFile(accountsFile, "utf8"));
if (!Array.isArray(accounts)) {
  throw new Error("O arquivo local de contas não contém uma lista válida.");
}
if (accounts.some((account) => !account?.id || !account?.email || !account?.passwordHash)) {
  throw new Error("O arquivo local tem uma conta incompleta; nenhuma conta deve ser ignorada.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: true },
  max: 1,
  connectionTimeoutMillis: 10_000,
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jarvis_accounts (
      id UUID PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      country CHAR(2) NOT NULL,
      language TEXT NOT NULL,
      salt TEXT NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);
  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS jarvis_accounts_username_unique
    ON jarvis_accounts (LOWER(username))
  `);
  const client = await pool.connect();
  let imported = 0;
  try {
    await client.query("BEGIN");
    for (const account of accounts) {
      const result = await client.query(`
        INSERT INTO jarvis_accounts (id, username, email, country, language, salt, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [
        account.id,
        account.username || account.name,
        account.email,
        account.country,
        account.language,
        account.salt,
        account.passwordHash,
      ]);
      imported += result.rowCount;
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
  console.log(`Migração concluída: ${imported} conta(s) adicionada(s). O arquivo local foi preservado.`);
} finally {
  await pool.end();
}
