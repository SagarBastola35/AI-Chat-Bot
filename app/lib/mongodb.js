
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("❌ Please define the MONGODB_URI environment variable in .env.local");
}

// Global is used to maintain cached connection in serverless environment
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectDB() {
    if (cached.conn) {
        // ✅ Return existing connection if available
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable mongoose buffering
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log("✅ MongoDB connected successfully");
            return mongooseInstance;
        }).catch((err) => {
            console.error("❌ MongoDB connection error:", err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
