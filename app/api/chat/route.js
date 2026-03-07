export const runtime = "nodejs";

import { NextResponse } from "next/server";

/**
 * @route POST /api/chat
 * Free AI chat using OpenRouter
 */

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    // ✅ Validate message
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 },
      );
    }

    // ✅ Limit history
    const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant developed by Sagar Bastola. Be friendly and accurate.",
      },
      ...safeHistory,
      { role: "user", content: message.trim() },
    ];

    // ✅ Request to OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      },
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      success: true,
      reply,
      model: "llama-3-8b",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Chat API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
