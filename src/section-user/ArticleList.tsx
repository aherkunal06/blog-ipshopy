"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useThemeContext } from "@/context/ThemeContext";

const LIMIT = 20;

const ArticlesPage: React.FC = () => {
  const { theme } = useThemeContext();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async (page: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/blogs?page=${page}&limit=${LIMIT}`);
      const data = res.data;
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  // Theme-based colors
  const pageBg = theme === "dark" ? "bg-black" : "bg-white"; // full-page bg
  const pageGradient =
    theme === "dark"
      ? "bg-gradient-to-b from-black/90 via-gray-900/80 to-black/90"
      : "bg-gradient-to-b from-white/90 via-gray-50/80 to-white/90";
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardBorder = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const subTextColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const placeholderBg = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
  const placeholderText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`w-full min-h-screen transition-colors duration-500`}>
      {/* Optional gradient overlay */}

      <div className="relative z-10 mt-10 px-4 md:px-8 max-w-6xl mx-auto">
        <h1
          className={`text-3xl md:text-4xl font-bold text-center mb-10 transition-colors duration-500 ${textColor}`}
        >
          Featured Articles
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div
                key={i}
                className={`h-[380px] w-full rounded-xl ${placeholderBg} animate-pulse`}
              ></div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((article) => (
              <Link
                key={article.id}
                href={`/${article.slug}`}
                className={`group flex flex-col w-full h-[380px] rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${cardBg} ${cardBorder}`}
              >
                {/* Image */}
                <div className="w-full h-[220px] overflow-hidden flex-shrink-0">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-sm ${placeholderBg} ${placeholderText}`}>
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-1 h-[160px]">
                  <div className="mb-3">
                    <h2
                      className={`text-lg font-semibold leading-snug line-clamp-3 transition-colors duration-500 ${textColor}`}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        height: "4.2rem",
                      }}
                    >
                      {article.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <img
                      src={
                        article.author?.avatar ||
                        "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg"
                      }
                      alt={article.author?.username || "Author"}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                    <span className={`text-sm font-medium transition-colors duration-500 truncate ${subTextColor}`}>
                      {article.author?.username || "Unknown Author"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className={`text-lg ${subTextColor}`}>No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
