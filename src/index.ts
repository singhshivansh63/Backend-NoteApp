import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import { verifyToken } from "./middleware/authMiddleware";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check route (fixes Cannot GET /)
app.get("/", (_req, res) => {
  res.send("🚀 Backend NoteApp API is up and running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", verifyToken, noteRoutes);

// Get port from env or use default
const PORT = process.env.PORT || 5000;

// MongoDB Connection Check
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

// Start server only if DB connects successfully
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server started on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

