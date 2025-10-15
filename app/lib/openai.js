
import OpenAI from "openai";

// ✅ Ensure API key exists
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "❌ Missing OPENAI_API_KEY in environment variables. Add it to .env.local"
  );
}

// ✅ Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
