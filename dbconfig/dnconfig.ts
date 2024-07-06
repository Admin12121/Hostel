import mongoose from "mongoose";

export async function connect() {
    if (mongoose.connection.readyState >= 1) {
        return; // If already connected or connecting, do nothing.
    }

    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Connection Successful");
    } catch (error) {
        console.error("Error while connecting to the database:", error);
    }

    mongoose.connection.on('connected', () => {
        console.log("Mongoose connected to the database");
    });

    mongoose.connection.on('error', (err) => {
        console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log("Mongoose disconnected from the database");
    });
}
