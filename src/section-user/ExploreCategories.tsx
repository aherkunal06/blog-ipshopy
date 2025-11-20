"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useThemeContext } from "@/context/ThemeContext";

interface Category {
  id: number;
  name: string;
  image: string | null;
  slug: string;
}

const BlogsSlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  // helper to shuffle + pick random
  const getRandomItems = (arr: Category[], count: number) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Production-ready dummy categories for when backend returns empty
  const dummyCategories: Category[] = [
    {
      id: 1,
      name: "Technology",
      slug: "technology",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    },
    {
      id: 2,
      name: "Web Development",
      slug: "web-development",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
    },
    {
      id: 3,
      name: "Programming",
      slug: "programming",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80"
    }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/blogs/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data: Category[] = await res.json();
        setCategories(data.length > 0 ? data : dummyCategories);

        // check localStorage
        const stored = localStorage.getItem("dailyBlogs");
        if (stored) {
          const { items, date } = JSON.parse(stored);
          const today = new Date().toDateString();

          if (date === today) {
            // reuse today's selection
            setSelectedBlogs(items);
            return;
          }
        }

        // generate new random blogs for today
        const categoriesToUse = data.length > 0 ? data : dummyCategories;
        const randomSelection = getRandomItems(categoriesToUse, 3);
        setSelectedBlogs(randomSelection);

        // store in localStorage with today's date
        localStorage.setItem(
          "dailyBlogs",
          JSON.stringify({ items: randomSelection, date: new Date().toDateString() })
        );
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const containerBg = isDark 
    ? "bg-black" 
    : "bg-gray-100";
  
  const cardBg = isDark 
    ? "bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50" 
    : "bg-white/80 backdrop-blur-sm border border-gray-200/50";
  
  const cardHoverBg = isDark 
    ? "hover:bg-gradient-to-br hover:from-gray-700/90 hover:to-gray-800/90 hover:border-gray-600/70" 
    : "hover:bg-white hover:border-gray-300/70";

  return (
    <div
      className={`px-6 py-8 transition-all duration-700 ease-in-out ${containerBg} relative overflow-hidden`}
    >
      {/* Decorative background elements */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}></div>
      
      {/* Header section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-1 h-8 rounded-full ${
            isDark 
              ? 'bg-gradient-to-b from-blue-400 to-purple-500' 
              : 'bg-gradient-to-b from-blue-500 to-purple-600'
          }`}></div>
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${
            isDark
              ? 'from-white to-gray-300 text-transparent bg-clip-text'
              : 'from-gray-800 to-gray-600 text-transparent bg-clip-text'
          }`}>
            Trending Topics
          </h2>
        </div>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        } ml-7 font-medium`}>
          Discover most engaging content of the day
        </p>
      </div>

      {/* Content grid */}
      <div className="relative z-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className={`group relative rounded-3xl overflow-hidden ${cardBg} animate-pulse`}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-300/50 to-gray-400/50 dark:from-gray-600/50 dark:to-gray-700/50"></div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="h-4 bg-gradient-to-r from-gray-300/70 to-gray-400/70 dark:from-gray-600/70 dark:to-gray-700/70 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full">
            <div className={`rounded-2xl p-8 text-center ${
              isDark 
                ? 'bg-red-900/20 border border-red-800/30 text-red-300' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <div className="text-4xl mb-3">⚠️</div>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        ) : (
          selectedBlogs.map((category, index) => {
            const imgSrc = category.image || "/default-category.png";
            return (
              <Link
                key={category.id}
                href={`/blogs/categories/${category.slug}`}
                className={`group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out ${cardBg} ${cardHoverBg}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: loading ? 'none' : 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Gradient overlays */}
                  <div className={`absolute inset-0 ${
                    isDark
                      ? "bg-gradient-to-t from-gray-900/80 via-gray-800/40 to-transparent"
                      : "bg-gradient-to-t from-gray-900/60 via-gray-800/20 to-transparent"
                  }`}></div>
                  
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 via-transparent to-black/20"></div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-xl border ${
                    isDark 
                      ? 'bg-gray-800/90 border-gray-600/30 text-white' 
                      : 'bg-white/90 border-white/30 text-gray-800'
                  } shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isDark 
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    } group-hover:animate-pulse`}></div>
                    <span className="text-sm font-semibold tracking-wide" title={category.name}>
                      {category.name}
                    </span>
                  </div>
                  
                  {/* Subtle arrow indicator */}
                  <div className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H7M17 7V17"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default BlogsSlider;