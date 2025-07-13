import mongoose from 'mongoose';

const CoverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const coverLetterModel = mongoose.models.CoverLetter || mongoose.model('CoverLetter', CoverLetterSchema);

export default coverLetterModel;