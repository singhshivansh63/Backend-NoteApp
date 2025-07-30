"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/send-otp", authController_1.sendOtp);
router.post("/verify-otp", authController_1.verifyOtp);
router.post("/google-login", authController_1.handleGoogleLogin);
exports.default = router;
