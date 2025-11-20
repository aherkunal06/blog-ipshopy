"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useThemeContext } from "@/context/ThemeContext";

const LIMIT = 8;

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

  const textColor = theme === "dark" ? "text-white" : "text-black";
  const subTextColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-gray-900 hover:bg-gray-800" : "bg-white hover:bg-gray-100";
  const cardBorder = theme === "dark" ? "border-none" : "shadow-lg";
  const placeholderBg = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
  const placeholderText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  // Production-ready dummy data for when backend returns empty
  const dummyBlogs = [
    {
      id: 1,
      title: "Getting Started with Modern Web Development",
      slug: "getting-started-modern-web-development",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      metaDescription: "Learn the fundamentals of modern web development and build your first application with the latest technologies.",
      author: { username: "Admin", avatar: "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg" },
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Best Practices for Database Design",
      slug: "best-practices-database-design",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
      metaDescription: "Discover essential database design principles that will help you create efficient and scalable data structures.",
      author: { username: "Admin", avatar: "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg" },
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      title: "Introduction to Cloud Computing",
      slug: "introduction-cloud-computing",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      metaDescription: "Explore the world of cloud computing and understand how it's transforming the way we build and deploy applications.",
      author: { username: "Admin", avatar: "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg" },
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 4,
      title: "Mastering React Hooks and State Management",
      slug: "mastering-react-hooks-state-management",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      metaDescription: "A comprehensive guide to React Hooks and modern state management patterns for building dynamic user interfaces.",
      author: { username: "Admin", avatar: "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg" },
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  const displayBlogs = blogs.length > 0 ? blogs : dummyBlogs;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (<div className="w-full min-h-screen transition-colors duration-500">
  <div className="mt-10 px-4 md:px-6"> 
    <h2 className="font-semibold mb-6 text-2xl sm:text-3xl md:text-5xl leading-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
        Featured{" "}
        <span className={theme === "dark" ? "text-sky-400" : "text-sky-500"}>Articles</span>
      </h2>

    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
        {Array.from({ length: LIMIT }).map((_, i) => (
          <div key={i} className={`h-[320px] w-full max-w-[360px] ${placeholderBg} animate-pulse`} />
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
        {displayBlogs.map((article) => (
          <Link
            key={article.id}
            href={`/${article.slug}`}
            className={`group flex flex-col w-full max-w-[360px] rounded-xl overflow-hidden border ${cardBorder} ${cardBg} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="w-full aspect-[16/9] relative">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-sm ${placeholderBg} ${placeholderText}`}>
                  No Image Available
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col justify-between flex-1 min-h-[150px]">
              <div>
                <h2 className={`text-lg font-semibold line-clamp-2 ${textColor}`}>
                  {article.title}
                </h2>
                {article.metaDescription && (
                  <p className={`mt-1 text-sm line-clamp-2 ${subTextColor}`}>
                    {article.metaDescription}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={article.author?.avatar || "https://i.pinimg.com/736x/3e/36/00/3e3600f33f0c190104d30d2a971e1659.jpg"}
                    alt={article.author?.username || "Author"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                  />
                  <span className={`text-sm font-medium truncate ${subTextColor}`}>
                    {article.author?.username || "Unknown Author"}
                  </span>
                </div>
                <span className={`text-xs ${subTextColor}`}>
                  {article.createdAt && (
                    <>
                      <span className="mx-2">•</span>
                      <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
                    </>
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default ArticlesPage;
