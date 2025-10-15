
export const runtime = "nodejs"; // ✅ Ensures bcrypt & mongoose run properly

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/app/lib/mongodb.js";


export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // ✅ Connect to MongoDB
        await connectDB();

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // ✅ Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // ✅ Don’t expose password in response
        const safeUser = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        return NextResponse.json(
            { message: "User created successfully", user: safeUser },
            { status: 201 }
        );
    } catch (err) {
        console.error("Signup API Error:", err.message, err.stack);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
