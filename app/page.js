
"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

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
      if (data.reply) {
        setHistory([...newHistory, { role: "assistant", content: data.reply }]);
      } else {
        console.error("No reply from server:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4 md:p-8 bg-gray-300 text-black">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900 text-center">🤖 AI Chat Bot</h1>

      {/* Chat container */}
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-gray-800 rounded-2xl p-2 sm:p-4 shadow-lg flex flex-col h-[70vh] min-h-[400px]">
        {/* Scrollable chat messages */}
        <div
          className="flex-1 overflow-y-auto border border-gray-700 rounded-lg mb-2 sm:mb-4 p-2 sm:p-3 space-y-2 sm:space-y-3 scroll-smooth"
          style={{ maxHeight: "65vh" }}
        >
          {history.map((msg, i) => (
            <div
              key={i}
              className={`p-2 sm:p-3 rounded-lg whitespace-pre-wrap break-words ${msg.role === "user"
                  ? "bg-gray-900 text-white self-end ml-auto max-w-[95%] sm:max-w-[90%] md:max-w-[80%]"
                  : "bg-gray-700 text-gray-100 self-start mr-auto max-w-[95%] sm:max-w-[90%] md:max-w-[80%]"
                }`}
            >
              {msg.content}
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 italic animate-pulse">
              Thinking...
            </div>
          )}

          {/* invisible ref to scroll to bottom */}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer border border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}