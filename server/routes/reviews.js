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

// Update supervisor review not tested
router.update("/review/supervisors/id", async (req, res) => {
  try {
    const {id} = parseInt(req.params);
    const {
      rating,
      content,
      author,
      supervision_period,
      is_anonymous,
      characteristics,
    } = req.body;

    const results = await pool.query(`UPDATE supervisor_reviews SET supervisor_id = $1, rating = $2, content = $3, author = $4, supervision_period = $5, is_anonymous = $6, characteristics = $7 WHERE id = $8`,
      [supervisor_id, rating, content, author, supervision_period, is_anonymous, characteristics, id]
    )
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
})

// Update organization review not tested
router.update("/review/organizations/id", async (req, res) => {
  try {
    const {id} = parseInt(req.params);
    const { 
      rating, 
      content, 
      author, 
      role, 
      employment_period, 
      is_anonymous 
    } = req.body;

    const results = await pool.query(`UPDATE supervisor_reviews SET organization_id = $1, rating = $2, content = $3, author = $4, role = $5, employment_period = $6, is_anonymous = $7 WHERE id = $8`,
      [organization_id, rating, content, author, role, employment_period, is_anonymous, id]
    )
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
})

// Delete supervisor review not tested
router.delete("/reviews/supervisors/:id", async (req, res) => {
  try {
    const { id } = parseInt(req.params);
    const results = await pool.query(`DELETE FROM supervisor_reviews WHERE id = $1`, [id])
      res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json( { error: error.message } )
  }
})

// Delete organization review not tested
router.delete("/reviews/organizations/:id", async (req, res) => {
  try {
    const { id } = parseInt(req.params);
    const results = await pool.query(`DELETE FROM organization_reviews WHERE id = $1`, [id])
      res.status(200).json(results.rows[0])
  } catch (err) {
    res.status(409).json( { error: error.message } )
  }
})

export const reviewRoutes = router;
