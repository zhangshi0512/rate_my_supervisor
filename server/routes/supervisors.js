import express from "express";
import db from "../config/database.js";

const router = express.Router();

// Get all supervisors
router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching all supervisors...");
    const result = await db.query(`
      SELECT 
        s.*,
        COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0)::float as rating,
        COUNT(r.id) as review_count
      FROM supervisors s
      LEFT JOIN supervisor_reviews r ON s.id = r.supervisor_id
      GROUP BY s.id
    `);

    // Transform specialties from string to array if needed
    const supervisors = result.rows.map((supervisor) => ({
      ...supervisor,
      specialties: Array.isArray(supervisor.specialties)
        ? supervisor.specialties
        : supervisor.specialties?.split(",") || [],
      rating: parseFloat(supervisor.rating) || 0,
    }));

    console.log(`Found ${supervisors.length} supervisors`);
    res.json(supervisors);
  } catch (err) {
    console.error("Error fetching supervisors:", err);
    next(err);
  }
});

// Get supervisor by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching supervisor with ID: ${id}`);

    const result = await db.query(
      `
      SELECT 
        s.*,
        COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0)::float as rating,
        COUNT(r.id) as review_count
      FROM supervisors s
      LEFT JOIN supervisor_reviews r ON s.id = r.supervisor_id
      WHERE s.id = $1
      GROUP BY s.id
    `,
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`No supervisor found with ID: ${id}`);
      return res.status(404).json({ error: "Supervisor not found" });
    }

    // Transform specialties from string to array if needed
    const supervisor = {
      ...result.rows[0],
      specialties: Array.isArray(result.rows[0].specialties)
        ? result.rows[0].specialties
        : result.rows[0].specialties?.split(",") || [],
      rating: parseFloat(result.rows[0].rating) || 0,
    };

    console.log(`Successfully fetched supervisor with ID: ${id}`);
    res.json(supervisor);
  } catch (err) {
    console.error(`Error fetching supervisor with ID ${req.params.id}:`, err);
    next(err);
  }
});

export const supervisorRoutes = router;
