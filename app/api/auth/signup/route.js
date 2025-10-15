
export const runtime = "nodejs"; // ✅ Required for bcrypt & mongoose compatibility

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/app/lib/mongodb.js";

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        // ✅ Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: "All fields are required." },
                { status: 400 }
            );
        }

        // ✅ Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        // ✅ Enforce password strength
        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters long." },
                { status: 400 }
            );
        }

        // ✅ Connect to MongoDB
        await connectDB();

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "User with this email already exists." },
                { status: 409 } // Conflict
            );
        }

        // ✅ Hash password securely
        const hashedPassword = await bcrypt.hash(password, 12);

        // ✅ Create and save new user
        const newUser = await User.create({
            name: name.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        // ✅ Sanitize user response
        const safeUser = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };

        console.log(`✅ New user registered: ${safeUser.email}`);

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully.",
                user: safeUser,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("❌ Signup API Error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Internal server error. Please try again later.",
            },
            { status: 500 }
        );
    }
}
