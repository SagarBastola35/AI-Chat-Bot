
export const runtime = "nodejs"; // ✅ Ensures compatibility with OpenAI SDK and Node features

import { NextResponse } from "next/server";
import openai from "@/app/lib/openai.js";

/**
 * @route   POST /api/chat
 * @desc    Handle AI chat interactions with OpenAI
 * @access  Public
 */
export async function POST(req) {
    try {
        const { message, history } = await req.json();

        // ✅ Input validation
        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json(
                { success: false, error: "Message is required." },
                { status: 400 }
            );
        }

        // ✅ Sanitize and limit chat history (prevent token bloat)
        const safeHistory = Array.isArray(history)
            ? history.slice(-10).map((m) => ({
                role: m.role === "user" || m.role === "assistant" ? m.role : "user",
                content: String(m.content || "").slice(0, 2000),
            }))
            : [];

        // ✅ Build conversation context
        const messages = [
            {
                role: "system",
                content:
                    "You are a helpful, knowledgeable, and concise AI assistant developed by Sagar Bastola. Be accurate and friendly.",
            },
            ...safeHistory,
            { role: "user", content: message.trim() },
        ];

        // ✅ Send request to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // ⚡ Fast, efficient model
            messages,
            temperature: 0.7, // Balanced creativity
            max_tokens: 500, // Prevent long responses
        });

        const reply = response.choices?.[0]?.message?.content?.trim() || "I'm not sure how to respond.";

        // ✅ Return AI reply
        return NextResponse.json(
            {
                success: true,
                reply,
                model: "gpt-4o-mini",
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Chat API Error:", error);

        // ✅ Handle OpenAI API-specific errors gracefully
        const statusCode = error.response?.status || 500;
        const errorMessage =
            error.response?.data?.error?.message || error.message || "Internal server error";

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: statusCode }
        );
    }
}
