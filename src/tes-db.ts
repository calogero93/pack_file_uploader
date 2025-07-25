// test-db-connection.ts
import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import dotenv from "dotenv";
import { DB } from "./db/schema"; // Assicurati il percorso corretto

dotenv.config(); // Carica il tuo .env per questo test autonomo

async function testDbConnection() {
  console.log("Tentativo di connettere Kysely...");
  const connectionString = process.env.MYDATABASE_URL;
  console.log("MYDATABASE_URL:", connectionString);

  if (!connectionString) {
    console.error("MYDATABASE_URL non è definito!");
    return;
  }

  try {
    const dialect = new PostgresDialect({
      pool: new Pool({
        connectionString: connectionString,
      }),
    });

    const testDb = new Kysely<DB>({
      dialect,
    });

    // Tenta una semplice query per verificare la connessione
    await testDb.selectFrom("file").selectAll().execute(); // Sostituisci 'file' con una tua tabella esistente
    console.log("Kysely connesso e query di test eseguita con successo!");

    await testDb.destroy(); // Chiudi la connessione
    console.log("Connessione Kysely chiusa.");
  } catch (error: any) {
    console.error("Errore di connessione Kysely:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    if (error.code) {
      // Per errori di PG
      console.error("PG Error Code:", error.code);
    }
  }
}

testDbConnection();
