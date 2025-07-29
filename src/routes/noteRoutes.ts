import express from "express";
import mongoose from "mongoose";
import { getNotes, createNote, deleteNote } from "../controllers/noteController";
// import { verifyToken } from "../middleware/authMiddleware"; // Uncomment if using auth

const router = express.Router();

// Routes
router.get("/", getNotes);
router.post("/", createNote);

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  // ✅ Validate ObjectId to avoid CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  // ✅ Pass control to your controller if ID is valid
  return deleteNote(req, res);
});

export default router;

