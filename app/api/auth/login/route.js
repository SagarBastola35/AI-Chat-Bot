
export const runtime = "nodejs"; // ✅ Force Node runtime (not Edge)

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/app/lib/mongodb.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // ✅ Connect to MongoDB
        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!JWT_SECRET) {
            console.error("❌ JWT_SECRET is missing in environment variables!");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // ✅ Create response and set cookie
        const res = NextResponse.json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        return res;
    } catch (err) {
        console.error("Login API Error:", err.message, err.stack);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
