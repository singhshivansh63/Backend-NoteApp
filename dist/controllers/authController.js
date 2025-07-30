"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGoogleLogin = exports.verifyOtp = exports.sendOtp = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../utils/mailer");
const google_auth_library_1 = require("google-auth-library");
const otpStore = new Map();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Send OTP to user's email
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email is required" });
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, otp);
        await (0, mailer_1.sendOTP)(email, otp);
        res.json({ message: "OTP sent" });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};
exports.sendOtp = sendOtp;
// Verify OTP and return JWT
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const storedOtp = otpStore.get(email);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = await User_1.default.create({ email });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "OTP verification failed" });
    }
};
exports.verifyOtp = verifyOtp;
// Handle Google Login
const handleGoogleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;
        if (!tokenId) {
            return res.status(400).json({ error: "Missing Google token" });
        }
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload?.email;
        if (!email) {
            return res.status(400).json({ error: "Invalid Google token" });
        }
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = await User_1.default.create({ email });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    }
    catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ error: "Google login failed" });
    }
};
exports.handleGoogleLogin = handleGoogleLogin;
