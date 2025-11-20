"use client";

import Image from "next/image";
import { useState } from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { toast } from "react-hot-toast";

type BlogImage = {
  id: number;
  title: string;
  image: string | null;
  imageAlt: string | null;
};

interface EditImageModalProps {
  image: BlogImage;
  onClose: () => void;
  onUpdate?: (updatedImage: BlogImage) => void;
}

export default function EditImageModal({ image, onClose, onUpdate }: EditImageModalProps) {
  const [title, setTitle] = useState(image.title || "");
  const [alt, setAlt] = useState(image.imageAlt || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(image.image || null);
  const [loading, setLoading] = useState(false);

  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const handleBackdropClick = () => onClose();
const handleSave = async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("imageAlt", alt);
    if (file) formData.append("image", file);

    const res = await fetch(`/api/blogs/media/${image.id}`, {
      method: "PATCH",
      body: formData,
    });

    const result = await res.json();
    if (res.ok && result.success) {
      // ✅ Figure out what changed
      const updates: string[] = [];
      if (title !== image.title) updates.push("title");
      if (alt !== image.imageAlt) updates.push("alt text");
      if (file) updates.push("image");

      // ✅ Show custom toast depending on changes
      if (updates.length > 0) {
        toast.success(`${updates.join(", ")} updated successfully!`);
      } else {
        toast("No changes were made.", { icon: "ℹ️" });
      }

      const newUrl: string | null = result.updatedImage ?? result.blog?.image ?? null;
      onUpdate?.({
        id: image.id,
        title,
        image: newUrl,
        imageAlt: alt,
      });
      if (newUrl) setPreview(newUrl);
      onClose();
    } else {
      toast.error(result.error || "Failed to update details");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isDark ? "bg-black/70" : "bg-black/50"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Image Details</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${
                    isDark ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Enter image title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Alt Text</label>
                <textarea
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
                    isDark ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Replace Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 ${
                    isDark ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) {
                        setFile(selected);
                        setPreview(URL.createObjectURL(selected));
                      }
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                  />
                  <p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium">Preview</label>
              <div className="rounded-xl overflow-hidden inline-block w-full">
                {preview ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={preview}
                      alt={alt || "Image preview"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="text-4xl text-gray-400 mb-2">🖼️</div>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>No image available</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                  }`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
