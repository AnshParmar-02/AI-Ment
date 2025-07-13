import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const resumeModel = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);

export default resumeModel;