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

// Update supervisor review
router.put("/supervisors/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;

    console.log("Updating supervisor review:", { id, rating, content });

    const result = await db.query(
      `
      UPDATE supervisor_reviews 
      SET rating = $1, content = $2
      WHERE id = $3
      RETURNING *
    `,
      [rating, content, id]
    );

    if (result.rows.length === 0) {
      console.log("Review not found:", id);
      return res.status(404).json({ error: "Review not found" });
    }

    console.log("Updated review:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating supervisor review:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update organization review
router.put("/organizations/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, content } = req.body;

    const result = await db.query(
      `
      UPDATE organization_reviews 
      SET rating = $1, content = $2
      WHERE id = $3
      RETURNING *
    `,
      [rating, content, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log(`Updated review ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating organization review:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete supervisor review
router.delete("/supervisors/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM supervisor_reviews WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log(`Deleted review ${id}`);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting supervisor review:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete organization review
router.delete("/organizations/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM organization_reviews WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    console.log(`Deleted review ${id}`);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting organization review:", err);
    res.status(500).json({ error: err.message });
  }
});

export const reviewRoutes = router;
