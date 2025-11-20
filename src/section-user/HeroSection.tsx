"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useThemeContext } from "@/context/ThemeContext";

const HeroSection = () => {
  const { theme } = useThemeContext(); // ✅ get theme from context

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section
      className={`relative px-4 md:px-10 py-6 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 mt-10
        ${theme === "dark" ? "bg-black text-gray-100" : "bg-white text-gray-900"}`}
      style={{
        backgroundImage: `url('/2.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Content */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="mr-1">Welcome to</span>
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
            ipshopyBlogs
          </span>
        </h1>

        <p className="max-w-lg leading-relaxed mb-6">
          — your space to explore handpicked articles, trending topics, and stories that matter. Read, learn, and stay updated with fresh perspectives every day.
        </p>

        <div className="flex gap-4">
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 text-white font-semibold rounded-full hover:scale-105 transition transform">
            Explore Blogs
          </button>
          <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            Trending Blogs
          </button>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 text-center">
        <Image
          src="/hero.png"
          alt="hero-image"
          width={420}
          height={320}
          className="max-w-full h-auto animate-bounce-slow"
        />
      </div>
    </section>
  );
};

export default HeroSection;
