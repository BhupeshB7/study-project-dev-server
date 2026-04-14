import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserRole, UserStatus } from "../enum/user.enum.js";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[1-9]\d{9,14}$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    profileImageUrl: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.STUDENT,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: function () {
        return this.role !== UserRole.SYSTEM_OWNER;
      },
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.INACTIVE,
    },
    
    resetPasswordToken: {
      type: String,
      default: undefined,
    },

    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export const UserModel = mongoose.model("User", UserSchema);
