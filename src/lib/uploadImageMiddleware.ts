// src/lib/uploadImageMiddleware.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export type CloudinaryUpload = { secure_url: string; public_id: string };

export const uploadImageToCloudinary = async (file: Blob): Promise<CloudinaryUpload> => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog-images", resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
        resolve({ secure_url: result.secure_url!, public_id: result.public_id! });
      }
    );
    stream.end(buffer);
  });
};

// Prefer using the public_id returned by Cloudinary instead of parsing the URL. [web:69]
export const getCloudinaryPublicId = (url: string): string | null => {
  // Fallback only; using upload response public_id is recommended. [web:69]
  const regex = /\/image\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/;
  const match = url.match(regex);
  return match?.[1] ?? null;
};

export const deleteImageFromCloudinary = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};

