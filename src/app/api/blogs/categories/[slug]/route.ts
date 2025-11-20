// src/app/api/blogs/categories/[slug]/route.ts
import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CategoryParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: CategoryParams) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is missing" },
      { status: 400 }
    );
  }

  try {
    // Get category
    const category = await queryOne<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>(
      'SELECT * FROM Category WHERE slug = ?',
      [slug]
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Get blogs in this category
    const blogs = await query<Array<{
      id: number;
      title: string;
      slug: string;
      image: string | null;
      imageAlt: string | null;
      metaDescription: string | null;
      updatedAt: Date;
      authorId: number;
      authorUsername: string;
      authorName: string;
    }>>(
      `SELECT b.id, b.title, b.slug, b.image, b.imageAlt, b.metaDescription, b.updatedAt, b.authorId,
              u.username as authorUsername, u.name as authorName
       FROM Blog b
       JOIN BlogCategory bc ON b.id = bc.blogId
       JOIN AdminUser u ON b.authorId = u.id
       WHERE bc.categoryId = ? AND b.status = 1
       ORDER BY b.createdAt DESC`,
      [category.id]
    );

    // Get categories for each blog
    const blogIds = blogs.map(b => b.id);
    const blogCategories = blogIds.length > 0 ? await query<Array<{
      blogId: number;
      categoryId: number;
      categoryName: string;
      categorySlug: string;
    }>>(
      `SELECT bc.blogId, c.id as categoryId, c.name as categoryName, c.slug as categorySlug
       FROM BlogCategory bc
       JOIN Category c ON bc.categoryId = c.id
       WHERE bc.blogId IN (${blogIds.map(() => '?').join(',')})`,
      blogIds
    ) : [];

    // Group categories by blogId
    const categoriesByBlog = blogCategories.reduce((acc, cat) => {
      if (!acc[cat.blogId]) acc[cat.blogId] = [];
      acc[cat.blogId].push({
        id: cat.categoryId,
        name: cat.categoryName,
        slug: cat.categorySlug
      });
      return acc;
    }, {} as Record<number, Array<{ id: number; name: string; slug: string }>>);

    // Format response
    const formattedBlogs = blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      image: blog.image,
      imageAlt: blog.imageAlt,
      metaDescription: blog.metaDescription,
      updatedAt: blog.updatedAt,
      author: {
        username: blog.authorUsername,
        name: blog.authorName
      },
      categories: categoriesByBlog[blog.id] || []
    }));

    return NextResponse.json({
      category,
      blogs: formattedBlogs
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

