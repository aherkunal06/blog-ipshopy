"use client";

import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TextEditor from "@/admin-components/TextEditor";
import { slugify } from "@/utils/slugify";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface Category {
  id: number;
  name: string;
}

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [isSlugChecking, setIsSlugChecking] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    axios
      .get("/api/blogs/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  // Auto slugify
  useEffect(() => {
    if (!isSlugManuallyEdited) {
      setSlug(title ? slugify(title) : "");
    }
  }, [title, isSlugManuallyEdited]);

  // Slug check
  useEffect(() => {
    if (!slug) {
      setSlugError(null);
      return;
    }
    setIsSlugChecking(true);
    const handler = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/blogs/check-slug?slug=${slug}`);
        setSlugError(res.data.isUnique ? null : "This slug is already taken.");
      } catch {
        setSlugError("Error checking slug.");
      } finally {
        setIsSlugChecking(false);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [slug]);

  // Handle keywords
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim();
      if (value && !metaKeywords.includes(value)) {
        setMetaKeywords((prev) => [...prev, value]);
      }
      setInputValue("");
    }
  };

  const handleDeleteKeyword = (chip: string) => {
    setMetaKeywords((prev) => prev.filter((k) => k !== chip));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !slug || isSlugChecking || slugError) {
      toast.error("Please fix errors before submitting.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeywords", metaKeywords.join(","));
      formData.append("content", content);
      formData.append("categoryIds", selectedCategories.join(","));
      formData.append("imageAlt", imageAlt);
      if (image) formData.append("image", image);

      const res = await axios.post("/api/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Blog created successfully!");
        router.push("/admin/blogs/list");
      } else {
        toast.error(res.data.message || "Failed to create blog");
      }
    } catch {
      toast.error("Failed to create blog.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-lg flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Create Blog
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Slug
        </label>
        <input
          type="text"
          className={`mt-1 w-full rounded-md border px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 ${
            slugError
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-700"
          }`}
          value={slug}
          onChange={(e) => {
            setIsSlugManuallyEdited(true);
            setSlug(slugify(e.target.value));
          }}
          required
        />
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
          {isSlugChecking
            ? "Checking slug..."
            : slugError
            ? slugError
            : "Unique part of the URL"}
        </p>
      </div>

      {/* Meta Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meta Title
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
        />
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meta Keywords
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          placeholder="Type keyword and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {metaKeywords.map((keyword, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-sm px-2 py-1 rounded"
            >
              {keyword}
              <button type="button" onClick={() => handleDeleteKeyword(keyword)}>
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meta Description
        </label>
        <textarea
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          rows={3}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 
            file:rounded-md file:border-0 file:text-sm file:font-semibold 
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
            dark:file:bg-gray-700 dark:file:text-gray-200 dark:hover:file:bg-gray-600"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={150}
            height={150}
            className="mt-2 rounded object-cover"
          />
        )}
      </div>

      {/* Image Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Image Alt Text
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the image"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Categories
        </label>
        <Listbox value={selectedCategories} onChange={setSelectedCategories} multiple>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none">
              <span className="block truncate">
                {selectedCategories.length > 0
                  ? categories
                      .filter((c) => selectedCategories.includes(c.id))
                      .map((c) => c.name)
                      .join(", ")
                  : "Select categories"}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {categories.map((cat) => (
                  <Listbox.Option key={cat.id} value={cat.id} as={Fragment}>
                    {({ active }) => (
                      <li
                        onClick={() =>
                          setSelectedCategories((prev) =>
                            prev.includes(cat.id)
                              ? prev.filter((id) => id !== cat.id)
                              : [...prev, cat.id]
                          )
                        }
                        className={`relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-yellow-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <span
                          className={`block truncate ${
                            selectedCategories.includes(cat.id)
                              ? "font-medium"
                              : "font-normal"
                          }`}
                        >
                          {cat.name}
                        </span>
                        {selectedCategories.includes(cat.id) && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-500">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        )}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Content
        </label>
        <TextEditor value={content} onChange={setContent} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!title || !content || !slug || isSlugChecking || slugError !== null}
        className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
      >
        Create Blog
      </button>
    </form>
  );
}
