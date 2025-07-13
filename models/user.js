import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  industry: {
    type: String,
    ref: "IndustryInsight",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  bio: {
    type: String,
  },
  experience: {
    type: Number,
  },
  skills: [
    {
      type: String,
    },
  ],
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  assessments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' }],
  coverLetters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoverLetter' }],
});

const userModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default userModel;