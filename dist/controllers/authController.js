"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email is required" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);
    yield (0, mailer_1.sendOTP)(email, otp);
    res.json({ message: "OTP sent" });
});
exports.sendOtp = sendOtp;
// Verify OTP and return JWT
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
    }
    let user = yield User_1.default.findOne({ email });
    if (!user)
        user = yield User_1.default.create({ email });
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.json({ token });
});
exports.verifyOtp = verifyOtp;
// Google login
const handleGoogleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId } = req.body;
        if (!tokenId)
            return res.status(400).json({ error: "Token ID missing" });
        const ticket = yield client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (!email)
            return res.status(400).json({ error: "Invalid token payload" });
        let user = yield User_1.default.findOne({ email });
        if (!user)
            user = yield User_1.default.create({ email });
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({ token });
    }
    catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ error: "Google login failed" });
    }
});
exports.handleGoogleLogin = handleGoogleLogin;
