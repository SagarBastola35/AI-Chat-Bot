
"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white px-4 py-4 sm:px-6 sm:py-5 w-full fixed bottom-0 left-0 right-0 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto flex justify-center items-center text-center"
      >
        <p className="font-semibold text-sm sm:text-base md:text-lg tracking-wide text-gray-300 hover:text-white transition-all duration-200">
          Made with{" "}
          <span className="text-red-500 animate-pulse">❤️</span> by{" "}
          <span className="font-bold text-white hover:text-blue-400 transition-colors">
            Sagar Bastola
          </span>{" "}
          &copy; {currentYear} &mdash; All rights reserved.
        </p>
      </motion.div>
    </footer>
  );
}
