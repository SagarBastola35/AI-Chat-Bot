import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/app/lib/mongodb.js";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password)
            return NextResponse.json({ error: "All fields required" }, { status: 400 });

        await connectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return NextResponse.json({ error: "User already exists" }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
