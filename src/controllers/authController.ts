import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (userId: string) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email });

    user.otp = otp;
    await user.save();
    await sendEmail(email, otp);
    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    user.otp = undefined;
    await user.save();

    const token = generateToken(user._id.toString());
    res.json({ token, user });
  } catch {
    res.status(500).json({ error: "OTP verification failed" });
  }
};

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ error: "Invalid token" });

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: "Google login failed" });
  }
};

