// server/db/init-db.js
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  const client = await db.pool.connect();

  try {
    // Start transaction
    await client.query("BEGIN");

    // Read schema and init SQL files
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );
    const initSQL = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

    console.log("Creating database schema...");
    await client.query(schemaSQL);
    console.log("Schema created successfully");

    console.log("Inserting initial data...");
    await client.query(initSQL);
    console.log("Initial data inserted successfully");

    // Commit transaction
    await client.query("COMMIT");
    console.log("Database initialization completed successfully");
  } catch (err) {
    // Rollback in case of error
    await client.query("ROLLBACK");
    console.error("Error initializing database:", err);
    throw err;
  } finally {
    client.release();
    // Close the pool
    await db.pool.end();
  }
}

// Run initialization
initializeDatabase()
  .then(() => {
    console.log("Database setup completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
