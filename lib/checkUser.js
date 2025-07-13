import { currentUser } from "@clerk/nextjs/server";
import connectToDatabase from "./mongoose.js";
import userModel from "../models/user.js";

export const checkUser = async () => {
    const database = await connectToDatabase();
    const user = await currentUser();
    if (!user) {
        return null;
    }

    try{
        const loggedInUser = await userModel.findOne({ clerkId: user.id });
        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;
        const newUser = new userModel({
            clerkUserId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: name,
            imageUrl: user.imageUrl,
        });
        await newUser.save();
        return newUser;
    }
    catch (error) {
        console.log("Error checking user:", error);
    }
}