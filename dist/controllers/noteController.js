"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.createNote = exports.getNotes = void 0;
const Note_1 = __importDefault(require("../models/Note"));
const getNotes = async (req, res) => {
    const userId = req.user.id;
    const notes = await Note_1.default.find({ user: userId });
    res.json({ notes });
};
exports.getNotes = getNotes;
const createNote = async (req, res) => {
    const userId = req.user.id;
    const note = await Note_1.default.create({ text: req.body.text, user: userId });
    res.json({ note });
};
exports.createNote = createNote;
const deleteNote = async (req, res) => {
    const note = await Note_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted", note });
};
exports.deleteNote = deleteNote;
