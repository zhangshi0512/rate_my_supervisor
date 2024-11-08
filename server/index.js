import express from "express";
import cors from "cors";
import { supervisorRoutes } from "./routes/supervisors.js";
import { organizationRoutes } from "./routes/organizations.js";
import { reviewRoutes } from "./routes/reviews.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:5173",
  })
);

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
