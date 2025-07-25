// tests/jest.env.setup.ts
import dotenv from "dotenv";

// Carica il tuo file .env principale per i test.
// L'override: true è importante per assicurare che queste variabili abbiano la precedenza.
dotenv.config({ path: ".env", override: true });

// Riconfermi MYDATABASE_URL esplicitamente per i test,
// assicurandoti che sia esattamente quello che vuoi per il DB 'pack'.
// Questo passaggio è ridondante se .env è caricato correttamente E contiene MYDATABASE_URL,
// ma aggiunge un ulteriore strato di garanzia per i test.
process.env.MYDATABASE_URL =
  "postgresql://pack_admin:29hzkexRriVQXnGguUCZ@localhost:5432/pack";

// Imposta anche le altre variabili che potrebbero essere usate dal Pool di pg,
// garantendo coerenza.
process.env.TEST_DB_HOST = "localhost";
process.env.TEST_DB_PORT = "5432";
process.env.TEST_DB_NAME = "pack"; // <--- Importante: ora è 'pack'
process.env.TEST_DB_USER = "pack_admin";
process.env.TEST_DB_PASSWORD = "29hzkexRriVQXnGguUCZ";

console.log(
  "DEBUG (jest.env.setup.ts): MYDATABASE_URL impostato a:",
  process.env.MYDATABASE_URL
);
console.log(
  "DEBUG (jest.env.setup.ts): TEST_DB_NAME impostato a:",
  process.env.TEST_DB_NAME
);
