// src/app/api/blogs/categories/route.ts
import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/uploadImageMiddleware";
import { query, insert } from "@/lib/db";

export const dynamic = "force-dynamic";

// ----------------- CREATE CATEGORY -----------------
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string | null;
    const imageFile = formData.get("image") as File | null;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, message: "Name and slug are required" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }

    const categoryId = await insert(
      'INSERT INTO Category (name, slug, description, image) VALUES (?, ?, ?, ?)',
      [name, slug, description, imageUrl]
    );

    const category = await queryOne<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>(
      'SELECT * FROM Category WHERE id = ?',
      [categoryId]
    );

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: "Category name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ----------------- GET CATEGORIES -----------------
export async function GET() {
  try {
    const categories = await query<Array<{
      id: number;
      name: string;
      image: string | null;
      slug: string;
      description: string | null;
      blogCount: number;
    }>>(
      `SELECT c.id, c.name, c.image, c.slug, c.description,
              COUNT(bc.id) as blogCount
       FROM Category c
       LEFT JOIN BlogCategory bc ON c.id = bc.categoryId
       GROUP BY c.id, c.name, c.image, c.slug, c.description
       ORDER BY c.name ASC`
    );

    // Format response
    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      slug: c.slug,
      description: c.description,
      posts: Number(c.blogCount), // number of blogs
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

