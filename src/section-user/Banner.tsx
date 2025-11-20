"use client";

import React from "react";
import Image from "next/image";
import { FaHeadset, FaCheckCircle, FaClock } from "react-icons/fa";
import { useThemeContext } from "@/context/ThemeContext";
import Link from "next/link";

const CustomerSupportBanner = () => {
  const { theme } = useThemeContext(); // client-only
  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between py-10 px-6 md:px-16 gap-6 relative my-8 transition-colors duration-500 ${
        isDark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Left Section */}
      <div className="flex-1 relative z-10">
        <h2
          className="font-semibold mb-4 text-3xl md:text-4xl lg:text-5xl leading-tight bg-clip-text text-transparent"
          style={{
            background: "linear-gradient(90deg, #22d3ee, #3b82f6, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Customer Support
        </h2>

        <p
          className={`mb-6 text-base md:text-lg ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Providing 24/7 support to help our customers resolve issues quickly
          and effectively.
        </p>

        {/* Stats Chips */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-200/30 hover:bg-blue-300/40 transition font-medium">
            <FaHeadset className="w-6 h-6 text-blue-500" />
            10k+ Active Customers
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-300/30 hover:bg-blue-300/50 transition font-medium">
            <FaCheckCircle className="w-6 h-6 text-blue-500" />
            95% Tickets Resolved
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-200/30 hover:bg-blue-300/40 transition font-medium">
            <FaClock className="w-6 h-6 text-blue-500" />
            Avg. Response: 2hrs
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mt-2">
          <Link
            href="/blogs/categories/customer-support"
            className="px-6 py-2 font-bold rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-sky-400 text-white shadow-lg transition transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
          >
            View Support Blogs
          </Link>

          <Link
            href="/contact-support"
            className={`px-6 py-2 font-semibold rounded-full border transition transform hover:-translate-y-1 hover:scale-105 ${
              isDark
                ? "border-blue-500 text-blue-400 hover:bg-blue-900/20"
                : "border-blue-500 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 hidden md:block relative h-96 rounded-xl overflow-hidden shadow-2xl">
        <Image
          src="/image.png"
          alt="Customer Support"
          fill
          className="object-cover rounded-xl"
        />
      </div>
    </div>
  );
};

export default CustomerSupportBanner;
