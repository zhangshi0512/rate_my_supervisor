// server/routes/reviews.js

import express from "express";
import db from "../config/database.js";

const router = express.Router();

// Get supervisor reviews
router.get("/reviews/supervisors/:id", async (req, res) => {
  try {
    console.log(`Fetching reviews for supervisor ID: ${req.params.id}`);
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        r.*,
        COALESCE(ROUND(r.rating::numeric, 2), 0)::float as rating
      FROM supervisor_reviews r
      WHERE r.supervisor_id = $1
      ORDER BY r.created_at DESC
    `,
      [id]
    );

    console.log(`Found ${result.rows.length} reviews for supervisor ${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching supervisor reviews:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get organization reviews
router.get("/reviews/organizations/:id", async (req, res) => {
  try {
    console.log(`Fetching reviews for organization ID: ${req.params.id}`);
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        r.*,
        COALESCE(ROUND(r.rating::numeric, 2), 0)::float as rating
      FROM organization_reviews r
      WHERE r.organization_id = $1
      ORDER BY r.created_at DESC
    `,
      [id]
    );

    console.log(`Found ${result.rows.length} reviews for organization ${id}`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching organization reviews:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add supervisor review
router.post("/reviews/supervisors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rating,
      content,
      author,
      supervision_period,
      is_anonymous,
      characteristics,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO supervisor_reviews 
        (supervisor_id, rating, content, author, supervision_period, is_anonymous, characteristics)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        id,
        rating,
        content,
        author,
        supervision_period,
        is_anonymous,
        characteristics,
      ]
    );

    console.log(`Added new review for supervisor ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding supervisor review:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add organization review
router.post("/reviews/organizations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content, author, role, employment_period, is_anonymous } =
      req.body;

    const result = await db.query(
      `
      INSERT INTO organization_reviews 
        (organization_id, rating, content, author, role, employment_period, is_anonymous)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [id, rating, content, author, role, employment_period, is_anonymous]
    );

    console.log(`Added new review for organization ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error adding organization review:", err);
    res.status(500).json({ error: err.message });
  }
});

export const reviewRoutes = router;
