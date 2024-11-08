import express from "express";
import db from "../config/database.js";

const router = express.Router();

/**
 * @typedef {Object} SupervisorReview
 * @property {number} id
 * @property {number} supervisor_id
 * @property {number} rating
 * @property {string} content
 * @property {string} author
 * @property {string} supervision_period
 * @property {boolean} is_anonymous
 * @property {number} helpful_count
 * @property {Date} created_at
 */

/**
 * @typedef {Object} OrganizationReview
 * @property {number} id
 * @property {number} organization_id
 * @property {number} rating
 * @property {string} content
 * @property {string} author
 * @property {string} role
 * @property {string} employment_period
 * @property {boolean} is_anonymous
 * @property {Date} created_at
 */

// Add supervisor review
router.post("/supervisors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, author, supervision_period, is_anonymous } =
      req.body;

    await db.query(
      `
      INSERT INTO supervisor_reviews 
        (supervisor_id, rating, content, author, supervision_period, is_anonymous)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [id, rating, content, author, supervision_period, is_anonymous]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add organization review
router.post("/organizations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, author, role, employment_period, is_anonymous } =
      req.body;

    await db.query(
      `
      INSERT INTO organization_reviews 
        (organization_id, rating, content, author, role, employment_period, is_anonymous)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [id, rating, content, author, role, employment_period, is_anonymous]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export const reviewRoutes = router;
