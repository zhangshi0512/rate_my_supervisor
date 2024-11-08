import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    // Read schema and init SQL files
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );
    const initSQL = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8");

    console.log("Creating database schema...");
    await db.query(schemaSQL);
    console.log("Schema created successfully");

    console.log("Inserting initial data...");
    await db.query(initSQL);
    console.log("Initial data inserted successfully");

    console.log("Database initialization completed");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
