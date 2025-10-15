
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup failed");
            } else {
                // ✅ Redirect to login page after successful signup
                router.push("/login");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                    Create Account
                </h1>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-all ${loading
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
}
