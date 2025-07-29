import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; // ✅ import helmet

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import { verifyToken } from "./middleware/authMiddleware";

dotenv.config();
const app = express();

// ✅ Use Helmet before routes
app.use(helmet());

// ✅ Optionally set custom Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"], // allow Google scripts
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://yourdomain.com"],
      connectSrc: ["'self'", "https://api.yourbackend.com"],
    },
  })
);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", verifyToken, noteRoutes);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(5000, () =>
      console.log("🚀 Server started on http://localhost:5000")
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });


