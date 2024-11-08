import express from "express";
import db from "../config/database.js";

const router = express.Router();

/**
 * @typedef {Object} Supervisor
 * @property {number} id
 * @property {string} name
 * @property {number} organization_id
 * @property {string[]} specialties
 * @property {number} experience
 * @property {string} [bio]
 * @property {Date} created_at
 * @property {number} [rating]
 * @property {number} [review_count]
 */

// Get all supervisors
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        s.*,
        COALESCE(AVG(sr.rating), 0) as rating,
        COUNT(sr.id) as review_count
      FROM supervisors s
      LEFT JOIN supervisor_reviews sr ON s.id = sr.supervisor_id
      GROUP BY s.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get supervisor by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        s.*,
        COALESCE(AVG(sr.rating), 0) as rating,
        COUNT(sr.id) as review_count
      FROM supervisors s
      LEFT JOIN supervisor_reviews sr ON s.id = sr.supervisor_id
      WHERE s.id = $1
      GROUP BY s.id
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supervisor not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const supervisorRoutes = router;
