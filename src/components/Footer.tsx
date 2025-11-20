"use client";

import React from "react";
import Link from "next/link";
import { useThemeContext } from "@/context/ThemeContext";
import { FaLinkedin, FaFacebook } from "react-icons/fa6";
import XIcon from '@mui/icons-material/X';
const Footer: React.FC = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  return (
    <footer
      className="relative overflow-hidden px-6 md:px-12 pt-10 pb-6 text-white"
      style={{
        backgroundImage: "url('/2 copy.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 z-0 transition-colors duration-300 ${
          isDark ? "bg-black/70" : "bg-blue-800/35"
        }`}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between gap-6 mb-8">
          {/* About Us */}
          <div className="flex-1 min-w-[180px]">
            <h6 className="text-sky-400 font-semibold mb-2 text-lg md:text-xl">
              About Us
            </h6>
            <p className="mb-2 text-sm text-white/90">
              Sharing knowledge and insights on remote work, productivity, and
              digital transformation.
            </p>
            <div className="flex gap-2 items-center">
          
              {/* Other social icons */}
              {[ XIcon, FaLinkedin, FaFacebook].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className="w-5 h-5 cursor-pointer text-white/90 transition-transform duration-200 hover:scale-110 hover:text-sky-400"
                />
              ))}
            </div>
          </div>
          {/* Categories */}
          <div className="flex-1 min-w-[100px]">
            <h6 className="text-cyan-400 font-semibold mb-2 text-lg md:text-xl">
              Categories
            </h6>

            <Link
              href="/blogs/categories/remote-work"
              className="block mb-1 text-xs cursor-pointer transition-colors duration-200 hover:underline text-white/90 hover:text-cyan-400"
            >
              Remote Work
            </Link>

            <Link
              href="/blogs/categories/productivity"
              className="block mb-1 text-xs cursor-pointer transition-colors duration-200 hover:underline text-white/90 hover:text-cyan-400"
            >
              Productivity
            </Link>

            <Link
              href="/blogs/categories/technology"
              className="block mb-1 text-xs cursor-pointer transition-colors duration-200 hover:underline text-white/90 hover:text-cyan-400"
            >
              Technology
            </Link>

            <Link
              href="/blogs/categories/workplace-culture"
              className="block mb-1 text-xs cursor-pointer transition-colors duration-200 hover:underline text-white/90 hover:text-cyan-400"
            >
              Workplace Culture
            </Link>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[100px]">
            <h6 className="text-blue-400 font-semibold mb-2 text-lg md:text-xl">
              Quick Links
            </h6>
            {[
              { name: "About Us", href: "/about" },
              { name: "Contact", href: "/contact-us" },
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms" },
            ].map((link) => (
              <Link key={link.name} href={link.href}>
                <p className="mb-1 text-xs cursor-pointer transition-colors duration-200 hover:underline text-white/90 hover:text-blue-400">
                  {link.name}
                </p>
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex-1 min-w-[180px]">
            <h6 className="text-sky-400 font-semibold mb-2 text-lg md:text-xl">
              Subscribe
            </h6>
            <p className="mb-2 text-xs text-white/90">
              Get updates on new articles and exclusive content.
            </p>
            <div className="flex gap-2 flex-wrap">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-1 px-2 py-1 rounded text-sm outline-none bg-white/10 text-white placeholder-white/60"
              />
              <button className="px-4 py-1 text-xs font-medium rounded text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-2 text-center">
          <p className="text-xs text-white/70">
            © 2025 ipshopyBlogs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
