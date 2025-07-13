"use server";

import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import userModel from "@/models/user";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import resumeModel from "@/models/resume";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

export async function saveResume(content) {
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
        const resume = await resumeModel.findOneAndUpdate(
            { userId: user._id },
            { content },
            { upsert: true, new: true },
        );

        revalidatePath('/resume');
        return {
            _id: resume._id.toString(),
            content: resume.content,
            userId: resume.userId.toString(),
            createdAt: resume.createdAt?.toISOString() ?? null,
            updatedAt: resume.updatedAt?.toISOString() ?? null,
        };

    } catch (error) {
        console.log("Error saving resume: ", Error);
        throw new Error("Failed to save resume");
    }
}

export async function getResume() {
    const { userId } = await auth();
        
    if(!userId) {
        throw new Error('Unauthorized');
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const resume = await resumeModel.findOne({
        userId: user._id,
    });

    return { content: resume.content };
}

export async function improveWithAI({ current, type }) {
    const { userId } = await auth();
        
    if(!userId) {
        throw new Error('Unauthorized');
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const improvedContent = response.text().trim();

        return improvedContent;
        
    } catch (error) {
        console.log("Error improving content: ", error);
        throw new Error("Failed to improve content");
    }
}