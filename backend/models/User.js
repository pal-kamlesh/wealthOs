import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    income: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    sip: {
      type: Number,
      default: 0,
    },
    emergencyFund: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);