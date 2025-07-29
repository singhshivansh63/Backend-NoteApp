import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  password: { type: String },
  name: { type: String },
  googleId: { type: String },
});

export default mongoose.model("User", userSchema);
