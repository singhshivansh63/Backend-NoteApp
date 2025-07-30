"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check route (fixes Cannot GET /)
app.get("/", (_req, res) => {
    res.send("🚀 Backend NoteApp API is up and running!");
});
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/notes", authMiddleware_1.verifyToken, noteRoutes_1.default);
// Get port from env or use default
const PORT = process.env.PORT || 5000;
// MongoDB Connection Check
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("❌ Error: MONGO_URI is not defined in .env");
    process.exit(1);
}
// Start server only if DB connects successfully
mongoose_1.default
    .connect(mongoURI)
    .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
})
    .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
});
