import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  quizScore: { type: Number, required: true },
  questions: [
    {
      _id: false,
      question: { type: String, required: true },
      userAnswer: { type: String },
      correctAnswer: { type: String },
      isCorrect: { type: String },
      explanation: { type: String },
    }
  ],
  category: { type: String, required: true },
  improvementTip: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const assessmentModel = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);

export default assessmentModel;