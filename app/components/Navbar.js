
"use client";

import React, { useState } from "react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-gray-900 text-white px-4 py-3 rounded-b-2xl shadow-md fixed top-0 left-0 right-0 z-20">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <span className="font-bold text-xl sm:text-2xl md:text-3xl">🤖 AI Chat Bot</span>
                {/* Hamburger menu for mobile */}
                <button
                    className="sm:hidden flex items-center"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8h16M4 16h16"
                            />
                        )}
                    </svg>
                </button>
                {/* Menu links */}
                <ul className="hidden sm:flex gap-4 items-center">
                    <li>
                        <a
                            className="font-bold text-lg"
                            href="/signup"
                        >
                            <button
                                type="button"
                                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black cursor-pointer"
                            >
                                SignUp
                            </button>
                        </a>
                    </li>
                    <li>
                        <a
                            className="font-bold text-lg"
                            href="/login"
                        >
                            <button
                                type="button"
                                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black cursor-pointer"
                            >
                                Login
                            </button>
                        </a>
                    </li>
                </ul>
            </div>
            {/* Mobile menu */}
            {menuOpen && (
                <ul className="flex flex-col gap-2 mt-2 sm:hidden">
                    <li>
                        <a
                            className="font-bold text-lg block"
                            href="/signup"
                        >
                            <button
                                type="button"
                                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black"
                            >
                                SignUp
                            </button>
                        </a>
                    </li>
                    <li>
                        <a
                            className="font-bold text-lg block"
                            href="/login"
                        >
                            <button
                                type="button"
                                className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black"
                            >
                                Login
                            </button>
                        </a>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;