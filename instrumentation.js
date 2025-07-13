import connectToDatabase from "./lib/mongoose";

export function register() {
    connectToDatabase();
}