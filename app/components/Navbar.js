
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 fixed top-0 left-0 right-0 z-50 shadow-lg rounded-3xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo / Brand */}
        <Link href="/" className="font-extrabold text-xl sm:text-2xl md:text-3xl tracking-wide">
          🤖 AI Chat Bot
        </Link>

        {/* Hamburger (mobile only) */}
        <button
          onClick={toggleMenu}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-all"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/signup">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 border border-black shadow-md transition-all"
            >
              Sign Up
            </button>
          </Link>
          <Link href="/login">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-blue-600 to-purple-500 hover:from-blue-500 hover:to-purple-400 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 border border-black shadow-md transition-all"
            >
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-3 mt-3 sm:hidden bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700"
          >
            <li>
              <Link href="/signup" onClick={() => setMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black transition-all"
                >
                  Sign Up
                </button>
              </Link>
            </li>
            <li>
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                <button
                  type="button"
                  className="w-full text-white bg-gradient-to-br from-blue-600 to-purple-500 hover:from-blue-500 hover:to-purple-400 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-black transition-all"
                >
                  Login
                </button>
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}
