// server/routes/organizations.js

import express from "express";
import db from "../config/database.js";

const router = express.Router();

// Get all organizations
router.get("/", async (req, res, next) => {
  try {
    console.log("Fetching all organizations...");
    const result = await db.query(`
      SELECT 
        o.*,
        COALESCE(ROUND(AVG(org_reviews.rating)::numeric, 2), 0)::float as rating,
        COUNT(DISTINCT s.id) as supervisor_count
      FROM organizations o
      LEFT JOIN organization_reviews org_reviews ON o.id = org_reviews.organization_id
      LEFT JOIN supervisors s ON s.organization_id = o.id
      GROUP BY o.id
    `);

    console.log(`Found ${result.rows.length} organizations`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching organizations:", err);
    next(err);
  }
});

// Get organization by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching organization with ID: ${id}`);

    const result = await db.query(
      `
      SELECT 
        o.*,
        COALESCE(ROUND(AVG(org_reviews.rating)::numeric, 2), 0)::float as rating,
        COUNT(DISTINCT s.id) as supervisor_count
      FROM organizations o
      LEFT JOIN organization_reviews org_reviews ON o.id = org_reviews.organization_id
      LEFT JOIN supervisors s ON s.organization_id = o.id
      WHERE o.id = $1
      GROUP BY o.id
    `,
      [id]
    );

    if (result.rows.length === 0) {
      console.log(`No organization found with ID: ${id}`);
      return res.status(404).json({ error: "Organization not found" });
    }

    console.log(`Successfully fetched organization with ID: ${id}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching organization with ID ${req.params.id}:`, err);
    next(err);
  }
});

// Get organization reviews
router.get("/:id/reviews", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching reviews for organization ID: ${id}`);

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
    console.error(
      `Error fetching reviews for organization ${req.params.id}:`,
      err
    );
    next(err);
  }
});

// Get organization supervisors
router.get("/:id/supervisors", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching supervisors for organization ID: ${id}`);

    const result = await db.query(
      `
      SELECT 
        s.*,
        COALESCE(ROUND(AVG(sr.rating)::numeric, 2), 0)::float as rating,
        COUNT(sr.id) as review_count
      FROM supervisors s
      LEFT JOIN supervisor_reviews sr ON s.id = sr.supervisor_id
      WHERE s.organization_id = $1
      GROUP BY s.id
    `,
      [id]
    );

    // Transform specialties from string to array if needed
    const supervisors = result.rows.map((supervisor) => ({
      ...supervisor,
      specialties: Array.isArray(supervisor.specialties)
        ? supervisor.specialties
        : supervisor.specialties?.split(",") || [],
      rating: parseFloat(supervisor.rating) || 0,
    }));

    console.log(
      `Found ${supervisors.length} supervisors for organization ${id}`
    );
    res.json(supervisors);
  } catch (err) {
    console.error(
      `Error fetching supervisors for organization ${req.params.id}:`,
      err
    );
    next(err);
  }
});

export const organizationRoutes = router;
