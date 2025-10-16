
"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // ✅ Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  // ✅ Handle message sending
  const sendMessage = async () => {
    if (!message.trim()) return;
    setError(null);

    const newHistory = [...history, { role: "user", content: message }];
    setHistory(newHistory);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: newHistory }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setHistory([...newHistory, { role: "assistant", content: data.reply }]);
      } else {
        setError(data.error || "No reply from AI server.");
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enter key sends message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-10 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 text-gray-900">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 text-center text-gray-900"
      >
        🤖 Your Personal AI Assistant
      </motion.h1>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-gray-900 text-white rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col h-[75vh] min-h-[450px]"
      >
        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 border border-gray-700 rounded-lg mb-4 p-3 space-y-3"
        >
          {history.length === 0 && (
            <p className="text-gray-400 text-center italic mt-10">
              👋 Start the conversation by asking a question!
            </p>
          )}

          {history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-lg whitespace-pre-wrap break-words max-w-[85%] ${msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-700 text-gray-100 self-start mr-auto"
                }`}
            >
              {msg.content}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              className="text-gray-400 italic animate-pulse"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Thinking...
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
        )}

        {/* Input Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg px-5 py-2 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
