import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
    versionKey: false,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel = mongoose.model("OTP", otpSchema);
