// src/app/admin/categories/CategoriesList.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useThemeContext } from "@/context/ThemeContext";

interface Category {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  posts?: number; // count of blogs in this category
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blogs/categories");
      const categoriesData = Array.isArray(res.data) ? res.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  // Refetch when page gains focus (after returning from edit page)
  useEffect(() => {
    const handleFocus = () => fetchCategories();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-700 dark:text-gray-300">
        Loading categories...
      </p>
    );
  }

  return (
    <div
      className={`max-w-5xl mx-auto p-6 rounded-lg ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Categories List</h2>
        <Link
          href="/admin/blogs/categories/createcategories"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Add Category
        </Link>
      </div>

      {/* Table */}
      <div
        className={`overflow-x-auto rounded-lg shadow ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr
              className={`${
                isDark
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <th className="w-16 px-4 py-2 text-left">ID</th>
              <th className="w-20 px-4 py-2 text-left">Image</th>
              <th className="w-1/3 px-4 py-2 text-left">Name</th>
              <th className="w-32 px-4 py-2 text-center">Blogs</th>
              <th className="w-32 px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className={`border-b ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-2">{category.id}</td>
                  <td className="px-4 py-2">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-md font-bold ${
                          isDark
                            ? "bg-gray-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {category.name[0]}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{category.name}</td>
                  <td className="px-4 py-2 text-center">
                    {category.posts && category.posts > 0 ? (
                      category.posts
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        0
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/blogs/categories/editcategories/${category.id}`}
                      className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
