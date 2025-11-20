"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useThemeContext } from "@/context/ThemeContext";
import Cards from "@/admin-components/Cards";
import BasicTable from "@/admin-components/BasicTable";
import type { MRT_ColumnDef } from "material-react-table";

const cardsData = [
  { title: "Total Posts", value: "324", change: "12" },
  { title: "Active Users", value: "1.2k", change: "8" },
  { title: "Monthly Views", value: "45.6k", change: "15" },
  { title: "Engagement Rate", value: "8.2%", change: "2" },
];

type Post = {
  id: string;
  title: string;
  author: string;
  category: string;
  status: string;
  publishedDate: string;
};

const postData: Post[] = [
  {
    id: "1",
    title: "How to Build a Dashboard",
    author: "John Doe",
    category: "Web Development",
    status: "Approved",
    publishedDate: "2024-05-12",
  },
  {
    id: "2",
    title: "10 UI Tips for Beginners",
    author: "Jane Doe",
    category: "UI/UX Design",
    status: "Draft",
    publishedDate: "2024-06-01",
  },
  {
    id: "3",
    title: "React vs Vue: Comparison",
    author: "Joe Doe",
    category: "Frontend",
    status: "Approved",
    publishedDate: "2024-05-27",
  },
  {
    id: "4",
    title: "State Management Simplified",
    author: "Kevin Vandy",
    category: "JavaScript",
    status: "Disapproved",
    publishedDate: "2024-07-01",
  },
  {
    id: "5",
    title: "Understanding TypeScript",
    author: "Joshua Rolluffs",
    category: "Programming",
    status: "Approved",
    publishedDate: "2024-04-22",
  },
];

export default function Content() {
  const router = useRouter();
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  const columns = [
  { accessorKey: "title", header: "Post Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "status",
    header: "Status",
    Cell: (row: Post) => {
      const value = row.status;
      const colorClass =
        value.toLowerCase() === "approved"
          ? "bg-green-500 text-white"
          : value.toLowerCase() === "disapproved"
          ? "bg-red-500 text-white"
          : value.toLowerCase() === "draft"
          ? "bg-blue-400 text-white"
          : isDark
          ? "bg-gray-600 text-gray-200"
          : "bg-gray-300 text-gray-800";

      return (
        <span
          className={`${colorClass} px-2 py-1 rounded text-xs font-medium capitalize inline-block min-w-[70px] text-center`}
        >
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "publishedDate",
    header: "Published Date",
    Cell: (row: Post) =>
      new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(row.publishedDate)),
  },
  {
    accessorKey: "actions",
    header: "Action",
    Cell: (row: Post) => (
      <Link
        href={`/admin/content/${row.id}`}
        className="inline-block rounded bg-blue-600 px-3 py-1 text-white text-xs hover:bg-blue-700 transition"
      >
        View
      </Link>
    ),
  },
];

  return (
    <div className={`p-6 ${cardBg} rounded-lg shadow-sm ${borderColor}`}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textPrimary}`}>
          Content Management
        </h1>
        <p className={`${textSecondary}`}>
          Manage and organize your blog content
        </p>
      </div>

      {/* Cards */}
      <div className="my-6">
        <Cards data={cardsData} />
      </div>

      {/* Table */}
      <div className="mt-4">
        <BasicTable<Post>
          data={postData}
          columns={columns}
          topToolbarActions={() => (
            <div className="flex gap-2 p-2">
              <button
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
                onClick={() => router.push("/admin/content/add")}
              >
                Add New Role
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
