
import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

// ✅ User Schema
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please provide a valid email address",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
    },
    {
        timestamps: true, // ✅ Automatically add createdAt and updatedAt
    }
);

// ✅ Export model (prevents overwrite in serverless environments)
const User = models.User || model("User", UserSchema);

export default User;
