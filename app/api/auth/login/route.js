import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/app/lib/mongodb.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password)
            return NextResponse.json({ error: "All fields required" }, { status: 400 });

        await connectDB();
        const user = await User.findOne({ email });
        if (!user)
            return NextResponse.json({ error: "User not found" }, { status: 404 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const res = NextResponse.json({ message: "Login successful", token });
        res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
