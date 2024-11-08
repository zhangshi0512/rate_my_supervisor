import express from "express";
import db from "../config/database.js";

const router = express.Router();

/**
 * @typedef {Object} Organization
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {string} [description]
 * @property {string} [website_url]
 * @property {Date} created_at
 * @property {number} [rating]
 * @property {number} [supervisor_count]
 */

// Get all organizations
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.*,
        COALESCE(AVG(or.rating), 0) as rating,
        COUNT(DISTINCT s.id) as supervisor_count
      FROM organizations o
      LEFT JOIN organization_reviews or ON o.id = or.organization_id
      LEFT JOIN supervisors s ON s.organization_id = o.id
      GROUP BY o.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get organization by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        o.*,
        COALESCE(AVG(or.rating), 0) as rating,
        COUNT(DISTINCT s.id) as supervisor_count
      FROM organizations o
      LEFT JOIN organization_reviews or ON o.id = or.organization_id
      LEFT JOIN supervisors s ON s.organization_id = o.id
      WHERE o.id = $1
      GROUP BY o.id
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const organizationRoutes = router;
