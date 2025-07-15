"use server";

import connectToDatabase from "@/lib/mongoose";
import { auth } from "@clerk/nextjs/server";
import userModel from "@/models/user";
import industryInsightModel from "@/models/industryInsight";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});

async function tryGenerateInsight(prompt, retries = 3, delay = 3000) {
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

export const generateIndustryInsights = async (industry) => {
    const prompt =  `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

        const result = await tryGenerateInsight(prompt);
        const response = result.response;
        const text = response.text();

        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        
        return JSON.parse(cleanedText);
}

export const getIndustryInsights = async () => {
    const { userId } = await auth();
        
    if(!userId) {
        throw new Error('Unauthorized');
    }

    await connectToDatabase();
    const user = await userModel.findOne({ clerkUserId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const industry = await industryInsightModel.findOne({ industry: user.industry }).lean();
    if (industry) {
      return {
        ...industry,
        _id: industry._id.toString(),
        nextUpdate: industry.nextUpdate?.toISOString(),
        lastUpdated: industry.lastUpdated?.toISOString(),
        users: industry.users?.map((id) => id.toString()),
      };
    }

    if(!user.industry) {
        const insights = await generateIndustryInsights(user.industry);

        const industryInsight = await industryInsightModel.create({
            industry: user.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            users: [user._id],
        });

        return industryInsight;
    }

    return industry;

}