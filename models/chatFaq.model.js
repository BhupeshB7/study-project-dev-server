import mongoose from "mongoose";

const ChatFaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    keywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    answer: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    helpfulCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    strictQuery: "throw",
  },
);

ChatFaqSchema.index({ keywords: 1 });
ChatFaqSchema.index({ instituteId: 1, category: 1 });
ChatFaqSchema.index({ question: "text", answer: "text" });

export const ChatFaqModel = mongoose.model("ChatFaq", ChatFaqSchema);
