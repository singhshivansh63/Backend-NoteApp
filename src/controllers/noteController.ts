import { Request, Response } from "express";
import Note from "../models/Note";

export const getNotes = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const notes = await Note.find({ user: userId });
  res.json({ notes });
};

export const createNote = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const note = await Note.create({ text: req.body.text, user: userId });
  res.json({ note });
};

export const deleteNote = async (req: Request, res: Response) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted", note });
};
