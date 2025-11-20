"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string | null;
}

export default function EditCategory() {
  const params = useParams<{ id: string }>(); // ✅ use id now
  const id = params?.id;
  const router = useRouter();

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);


 useEffect(() => {
  if (!id) return;

  // ✅ ensure id is numeric
  if (isNaN(Number(id))) {
    toast.error("Invalid category ID");
    setFetching(false);
    return;
  }

  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/blogs/categories/updatecategories?id=${id}`);
      const data = await res.json();

      if (res.ok && data.success && data.category) {
        setCategory(data.category);
        setName(data.category.name);
        setDescription(data.category.description || "");
        setImagePreview(data.category.image || null);
      } else {
        toast.error("Category not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch category");
    } finally {
      setFetching(false);
    }
  };

  fetchCategory();
}, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("id", category.id.toString()); // ✅ send id instead of slug
    formData.append("name", name);
    formData.append("description", description);
    formData.append("currentImage", category.image || "");

    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/blogs/categories/updatecategories", {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Category updated successfully!");
        router.push("/admin/blogs/categories");
      } else {
        toast.error(result.message || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center mt-10">
        <p>Category not found</p>
        <Link href="/admin/blogs/categories" className="mt-4 inline-block text-blue-600 hover:underline">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Edit Category</h2>

      <label className="flex flex-col">
        <span className="mb-1 font-medium">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col">
        <span className="mb-1 font-medium">Description</span>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </label>

      <div>
        <span className="block mb-1 font-medium">Select New Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && (
          <div className="mt-2 w-36 h-36 relative">
            <Image src={imagePreview} alt="Preview" fill style={{ objectFit: "cover", borderRadius: 8 }} />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <Link
          href="/admin/blogs/categories"
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
