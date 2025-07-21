import mongoose from "mongoose";

// Setting up Mongoose and MongoDB
export const connectDB = async () => {
    try {
        // Linking MongoDB atlas with the server
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Error in connecting to MongoDB", error);
        process.exit(1); // 1 means failure
    }
}