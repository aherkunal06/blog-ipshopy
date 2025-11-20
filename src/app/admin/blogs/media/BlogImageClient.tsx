"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import EditImageModal from "./EditImageModal";
import { useThemeContext } from "@/context/ThemeContext";

type BlogImage = {
  id: number;
  title: string;
  image: string | null;
  imageAlt: string | null;
};

export default function BlogImagesClient() {
  const { theme } = useThemeContext();
  const [images, setImages] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<BlogImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("/api/blogs/media"); // client fetch is uncached by default
      const data = await res.json();
      setImages(data.blogs || []);
      setLoading(false);
    };
    fetchImages();
  }, []); // initial load only [web:49]

  if (loading) return <p>Loading...</p>;

  return (
    <div className={`p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Blog Images</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className={`group rounded-xl shadow-sm overflow-hidden border ${
                theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {img.image ? (
                  <Image
                    src={img.image}
                    alt={img.imageAlt || "Blog image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-gray-400 text-4xl">🖼️</div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{img.title || `Image ${img.id}`}</h3>
                <p className={`text-xs line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {img.imageAlt || "No alt text provided"}
                </p>
                <button
                  className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => {
                    setSelectedImage(img);
                    setIsModalOpen(true);
                  }}
                >
                  Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && selectedImage && (
          <EditImageModal
            image={selectedImage}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedImage(null);
            }}
            onUpdate={(updatedImage) => {
              // Replace by id to re-render immediately; no stale closure because we derive from prev
              setImages((prev) => prev.map((img) => (img.id === updatedImage.id ? { ...img, ...updatedImage } : img))); // [web:44][web:47]
              // Keep selected card in sync if modal remains open for any reason
              setSelectedImage((prev) => (prev && prev.id === updatedImage.id ? { ...prev, ...updatedImage } : prev)); // [web:38][web:42]
            }}
          />
        )}
      </div>
    </div>
  );
}
