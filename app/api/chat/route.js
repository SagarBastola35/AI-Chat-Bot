import { NextResponse } from "next/server";
import openai from "@/app/lib/openai.js";

export async function POST(req) {
    try {
        const { message, history } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Build the conversation context
        const messages = [
            { role: "system", content: "You are a helpful AI assistant." },
            ...(history || []),
            { role: "user", content: message },
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
        });

        const reply = response.choices[0].message.content;
        return NextResponse.json({ reply });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

