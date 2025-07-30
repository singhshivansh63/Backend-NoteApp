import express from "express";
import { sendOtp, verifyOtp, handleGoogleLogin } from "../controllers/authController";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google-login", handleGoogleLogin);

export default router;





