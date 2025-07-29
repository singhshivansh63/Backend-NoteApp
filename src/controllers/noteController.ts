import { Request, Response } from "express";
import Note from "../models/Note";
import mongoose from "mongoose";

// GET all notes for logged-in user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notes = await Note.find({ user: userId });
    res.status(200).json({ notes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

// CREATE a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { text } = req.body;

    const note = await Note.create({
      user: userId,
      text,
    });

    res.status(201).json({ note });
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
};

// DELETE a note by ID
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const note = await Note.findOneAndDelete({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
};

