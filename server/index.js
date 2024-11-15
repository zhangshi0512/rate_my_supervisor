// server/index.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import { supervisorRoutes } from "./routes/supervisors.js";
import { organizationRoutes } from "./routes/organizations.js";
import { reviewRoutes } from "./routes/reviews.js";

const app = express();
const port = process.env.API_PORT || 3001;

// Enable better error logging
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", reviewRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/organizations", organizationRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  console.error("Stack:", err.stack);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An error occurred",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
