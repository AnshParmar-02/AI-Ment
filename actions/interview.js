"use server";

import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import userModel from "@/models/user";
import { GoogleGenerativeAI } from "@google/generative-ai";
import assessmentModel from "@/models/assessment";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});


async function tryGenerateQuiz(prompt, retries = 3, delay = 3000) {
  for(let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if(attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}


export const generateQuiz = async () => {
    const { userId } = await auth();
        
    if(!userId) {
        throw new Error('Unauthorized');
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    try {
    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

    const result = await tryGenerateQuiz(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quize = JSON.parse(cleanedText);

    return quize.questions;

    } catch(error) {
        console.log("Error generating quize",error);
        throw new Error("Failed to generate quize questions");
    }       
}


export async function saveQuizResult(questions, answers, score) {
    const { userId } = await auth();
        
    if(!userId) {
        throw new Error('Unauthorized');
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const questionResult = questions.map((q, index) => ({
      question: q.question,
      correctAnswer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));
    

    const wrongAnswers = questionResult.filter((q) => !q.isCorrect);

    let improvementTip = null;

    if(wrongAnswers.length > 0) {
      const wrongQuestionsText = wrongAnswers.map((q) => 
      `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`).join("\n\n");

      const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const result = await model.generateContent(improvementPrompt);
      const response = result.response;
      improvementTip = response.text().trim();

    } catch (error) {
      console.log("Error generating improvement tip: ", error);
    }
  }

    try {
      const assessment = await assessmentModel.create({
        userId: user._id,
        quizScore: score,
        questions: questionResult,
        category: user.industry,
        improvementTip,
      });

      await userModel.findByIdAndUpdate(
        user._id,
        { $push: { assessments: assessment._id } },
        { new: true },
      )

      const result = {
        ...assessment.toObject(),
      _id: assessment._id.toString(),
      userId: assessment.userId.toString(),
      createdAt: assessment.createdAt?.toISOString?.(),
      updatedAt: assessment.updatedAt.toISOString(),
      }

      return result;

    } catch (error) {
      console.log("Error saving quize Result: ", error);
      throw new Error("Failed to save quize result");
    }

}

export async function getAssessments() {
  const { userId } = await auth();
        
  if(!userId) {
      throw new Error('Unauthorized');
  }
  await connectToDatabase();
  const user = await userModel.findOne({ clerkUserId: userId });
  if (!user) {
      throw new Error('User not found');
  }

  try {
    const assessment = await assessmentModel
    .find({ userId: user._id })
    .sort({ createdAt: 1 })
    .lean();

    const plain = JSON.parse(JSON.stringify(assessment));

    return plain;
    
  } catch (error) {
    console.log("Error to fetching assessment:", error);
    throw new Error("Failed to fetch assessments");
  }
}