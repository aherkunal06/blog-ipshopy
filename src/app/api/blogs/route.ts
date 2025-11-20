// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/uploadImageMiddleware";
import { query, queryOne, insert, transaction } from "@/lib/db";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const sessionUserId = (session?.user as any)?.id;

    if (!sessionUserId) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;
    const metaKeywords = formData.get("metaKeywords") as string;
    const categoryIdsString = formData.get("categoryIds") as string;
    const slug = formData.get("slug") as string;
    const imageAlt = formData.get("imageAlt") as string;

    const imageFile = formData.get("image") as File | null;
    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }

    const categoryIds = categoryIdsString
      ? categoryIdsString
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((n) => Number.isFinite(n))
      : [];

    const authorId = Number(sessionUserId);

    // Use transaction to create blog and categories
    const blog = await transaction(async (conn) => {
      // Insert blog
      const blogId = await connInsert(
        conn,
        `INSERT INTO Blog (title, slug, content, metaTitle, metaDescription, metaKeywords, image, imageAlt, authorId)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, content, metaTitle, metaDescription, metaKeywords, imageUrl, imageAlt, authorId]
      );

      // Insert blog categories
      if (categoryIds.length > 0) {
        for (const catId of categoryIds) {
          await connExecute(
            conn,
            'INSERT INTO BlogCategory (blogId, categoryId) VALUES (?, ?)',
            [blogId, catId]
          );
        }
      }

      // Fetch the created blog
      const blogData = await connQuery<Array<{
        id: number;
        title: string;
        slug: string;
        content: string;
        image: string | null;
        imageAlt: string | null;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        status: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
      }>>(
        conn,
        'SELECT * FROM Blog WHERE id = ?',
        [blogId]
      );

      return blogData[0];
    });

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search")?.trim() || "";
    const suggest = url.searchParams.get("suggest") === "1";
    const skip = (page - 1) * limit;

    // Suggest mode: return minimal fields quickly
    if (suggest) {
      let sql = 'SELECT id, title, slug FROM Blog WHERE status = 1';
      const params: any[] = [];

      if (search.length > 0) {
        sql += ' AND (title LIKE ? OR content LIKE ?)';
        const searchTerm = search.length === 1 ? `${search}%` : `%${search}%`;
        params.push(searchTerm, searchTerm);
      }

      sql += ' ORDER BY createdAt DESC LIMIT 10';

      const suggestions = await query<Array<{ id: number; title: string; slug: string }>>(sql, params);

      return NextResponse.json({ blogs: suggestions });
    }

    // Full listing (homepage and list pages)
    let whereClause = '';
    const params: any[] = [];

    if (search.length > 0) {
      const searchTerm = search.length === 1 ? `${search}%` : `%${search}%`;
      whereClause = 'WHERE (b.title LIKE ? OR b.content LIKE ?)';
      params.push(searchTerm, searchTerm);
    }

    // Get blogs with pagination
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
       JOIN AdminUser u ON b.authorId = u.id
       ${whereClause}
       ORDER BY b.createdAt DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, skip]
    );

    // Get total count
    const countResult = await query<Array<{ count: bigint }>>(
      `SELECT COUNT(*) as count FROM Blog b ${whereClause}`,
      params
    );
    const totalBlogs = Number(countResult[0]?.count || 0);

    // Get categories for each blog
    const blogIds = blogs.map(b => b.id);
    const categories = blogIds.length > 0 ? await query<Array<{
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
    const categoriesByBlog = categories.reduce((acc, cat) => {
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

    const totalPages = Math.ceil(totalBlogs / limit);
    return NextResponse.json({ blogs: formattedBlogs, totalPages, currentPage: page });
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

