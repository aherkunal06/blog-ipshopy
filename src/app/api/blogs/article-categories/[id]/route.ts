import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

// GET /api/categories/:id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const category = await queryOne<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
    }>(
      'SELECT id, name, slug, description, image FROM Category WHERE id = ?',
      [Number(id)]
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get blogs in this category
    const blogs = await query<Array<{
      id: number;
      title: string;
      slug: string;
      image: string | null;
      metaDescription: string | null;
      updatedAt: Date;
      authorUsername: string;
      authorName: string;
    }>>(
      `SELECT b.id, b.title, b.slug, b.image, b.metaDescription, b.updatedAt,
              u.username as authorUsername, u.name as authorName
       FROM Blog b
       JOIN BlogCategory bc ON b.id = bc.blogId
       JOIN AdminUser u ON b.authorId = u.id
       WHERE bc.categoryId = ?
       ORDER BY b.createdAt DESC`,
      [Number(id)]
    );

    // Format response
    const formattedBlogs = blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      image: blog.image,
      metaDescription: blog.metaDescription,
      updatedAt: blog.updatedAt,
      author: {
        username: blog.authorUsername,
        name: blog.authorName
      }
    }));

    return NextResponse.json(formattedBlogs);
  } catch (error) {
    console.error("Error fetching blogs for category:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs for category" },
      { status: 500 }
    );
  }
}

