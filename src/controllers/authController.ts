import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTP } from "../utils/mailer";
import { OAuth2Client } from "google-auth-library";

const otpStore = new Map<string, string>();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Send OTP to user's email
export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);
  await sendOTP(email, otp);

  res.json({ message: "OTP sent" });
};

// Verify OTP and return JWT
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  res.json({ token });
};

// Google login
export const handleGoogleLogin = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) return res.status(400).json({ error: "Token ID missing" });

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) return res.status(400).json({ error: "Invalid token payload" });

    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
};


