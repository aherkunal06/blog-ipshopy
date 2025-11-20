"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { useThemeContext } from "@/context/ThemeContext";

interface Category {
  id: number;
  name: string;
  image: string | null;
  slug: string;
}

const TILE = 240; // card width
const SKELETON_COUNT = 7;

const BlogsSlider = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/blogs/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.length > 0 ? data : dummyCategories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = TILE * 2;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  const getRandomCategories = (arr: Category[], count: number) => {
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
    },
    {
      id: 4,
      name: "Design",
      slug: "design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
    },
    {
      id: 5,
      name: "Business",
      slug: "business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      id: 6,
      name: "Marketing",
      slug: "marketing",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
    },
    {
      id: 7,
      name: "Productivity",
      slug: "productivity",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80"
    },
    {
      id: 8,
      name: "Lifestyle",
      slug: "lifestyle",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
    }
  ];
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardHoverBg = isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";

  return (
    <div
      className={`relative p-4 transition-colors duration-500 ${
        isDark ? "bg-black text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-lg font-bold mb-3">Blog Categories</h2>

      {/* Left & Right buttons */}
      <button
        onClick={() => scroll("left")}
        className={`absolute top-1/2 -translate-y-1/2 left-0 z-20 shadow rounded-full p-2 transition ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-100 text-gray-900"
        }`}
      >
        <FaChevronCircleLeft className="text-xl" />
      </button>
      <button
        onClick={() => scroll("right")}
        className={`absolute top-1/2 -translate-y-1/2 right-0 z-20 shadow rounded-full p-2 transition ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-100 text-gray-900"
        }`}
      >
        <FaChevronCircleRight className="text-xl" />
      </button>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 no-scrollbar"
      >
        {loading ? (
          Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 min-w-[240px] max-w-[350px] rounded-2xl overflow-hidden ${cardBg} animate-pulse h-[200px]`}
            />
          ))
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          getRandomCategories(categories.length > 0 ? categories : dummyCategories, 8).map((category) => {
            const imgSrc = category.image || "/default-category.png";
            return (
              <Link
                key={category.id}
                href={`/blogs/categories/${category.slug}`}
                className={`flex-shrink-0 min-w-[240px] max-w-[350px] rounded-2xl overflow-hidden shadow-md group hover:shadow-lg hover:-translate-y-1 transition-transform duration-300 ${cardBg} ${cardHoverBg}`}
              >
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={imgSrc}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                  />
                  <div
                    className={`absolute inset-0 rounded-2xl ${
                      isDark
                        ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                        : "bg-gradient-to-t from-white/70 via-white/20 to-transparent"
                    }`}
                  ></div>
                  <span
                    className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-sm font-semibold px-3 py-1 rounded-lg backdrop-blur-sm whitespace-nowrap overflow-hidden text-ellipsis ${
                      isDark
                        ? "text-gray-100 bg-black/50"
                        : "text-gray-900 bg-white/70"
                    }`}
                    title={category.name}
                  >
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogsSlider;
