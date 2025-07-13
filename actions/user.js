'use server';

import { auth } from "@clerk/nextjs/server";
import userModel from "../models/user";
import connectToDatabase from "../lib/mongoose";
import industryInsightModel from "../models/industryInsight";
import { generateIndustryInsights } from "./dashboard";

export const updateUser = async (data) => {
    const { userId } = await auth();
    
    if(!userId) {
        throw new Error('Unauthorized');
    }
    
    await connectToDatabase();
    try{
        const user = await userModel.findOne({ clerkUserId: userId });
        if (!user) {
            throw new Error('User not found');
        }
        
        //find the industry
        let industryInsight = await industryInsightModel.findOne({ industry: data.industry });

        //if industry not found, create a new one
        if (!industryInsight) {
            const insights = await generateIndustryInsights(data.industry);

            industryInsight = await industryInsightModel.create({
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            users: [user._id],
        });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
        {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
        },{
            new: true
        });

    return {
        success: true,
        data: {
            updatedUser,
            industryInsight
        }
    };
    } catch (error) {
        console.log(error.message);
        throw new Error('Failed to update user ' + error.message);
    }
}

export const getUserOnboardingStatus = async () => {
    const { userId } = await auth();
    
    if(!userId) {
        throw new Error('Unauthorized');
    }

    await connectToDatabase();
    try {
        const user = await userModel.findOne({ 
            clerkUserId: userId,
        },{
            industry: 1,
        });
        if (!user) {
            throw new Error('User not found');
        }

        return { 
            isOnboarded: !!user?.industry
        };
        
    } catch (error) {
        console.error(error.message);
        throw new Error('Failed to get user onboarding status');
    }
}