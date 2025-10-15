
export const runtime = "nodejs"; // ✅ Ensure bcrypt & mongoose work correctly (not Edge)

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/app/lib/mongodb.js";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @desc Handles user login and JWT authentication
 * @route POST /api/auth/login
 * @access Public
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // ✅ Validate request
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // ✅ Connect to MongoDB (cached connection for performance)
    await connectDB();

    // ✅ Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    // ✅ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // ✅ Ensure JWT_SECRET exists
    if (!JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET environment variable");
      return NextResponse.json(
        { error: "Server configuration error. Please contact admin." },
        { status: 500 }
      );
    }

    // ✅ Generate signed JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Prepare response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // ✅ Set secure, HTTP-only cookie for JWT
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log(`✅ User logged in: ${user.email}`);
    return response;
  } catch (err) {
    console.error("❌ Login API Error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
