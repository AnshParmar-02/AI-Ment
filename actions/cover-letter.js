"use server";

import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongoose";
import coverLetterModel from "@/models/coverletter";
import userModel from "@/models/user";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});


async function tryGenerateContent(prompt, retries = 3, delay = 3000) {
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


export async function generateCoverLetter(data) {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if(!user) {
        throw new Error('User not found');
    }

    const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await tryGenerateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await coverLetterModel.create({
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user._id,
    });

    await userModel.updateOne(
      { _id: user._id },
      { $push: { coverLetters: coverLetter._id }}
    )

    return {
      ...coverLetter.toObject(),
      _id: coverLetter._id.toString(),
      userId: coverLetter.userId.toString(),
      createdAt: coverLetter.createdAt.toISOString(),
      updatedAt: coverLetter.updatedAt.toISOString(),
    };

  } catch (error) {
    console.error("Error generating to cover letter: ", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if(!user) {
        throw new Error('User not found');
    }

    const findCoverLetters = await coverLetterModel.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

    return findCoverLetters.map((letters) => ({
        ...letters,
        _id: letters._id.toString(),
        userId: letters.userId.toString(),
        createdAt: letters.createdAt.toISOString(),
        updatedAt: letters.updatedAt.toISOString(),
    }));
}

export async function getCoverLetterById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid cover letter ID");
    }
    
    const { userId } = await auth();
    if(!userId) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if(!user) {
        throw new Error('User not found');
    }

    const userCoverLetter = await coverLetterModel.findOne({
      _id: id,
      userId: user._id
    });

    if (!userCoverLetter) {
    throw new Error("Cover letter not found");
  }

    return {
      ...userCoverLetter.toObject(),
      _id: userCoverLetter._id.toString(),
      userId: userCoverLetter.userId.toString(),
      createdAt: userCoverLetter.createdAt.toISOString(),
      updatedAt: userCoverLetter.updatedAt.toISOString(),
    };
}

export async function deleteCoverLetter(id) {
    const { userId } = await auth();
    if(!userId) {
        throw new Error("Unauthorized");
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if(!user) {
        throw new Error('User not found');
    }

    const deleteCoverLetter = await coverLetterModel.findByIdAndDelete(id);

    return { success: true };
}