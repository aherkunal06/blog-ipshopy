// src/app/api/blogs/[slug]/route.ts
import { NextResponse } from "next/server";
import { queryOne, query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface BlogParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: BlogParams) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is missing" },
      { status: 400 }
    );
  }

  try {
    // Get blog with author
    const blog = await queryOne<{
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
      authorUsername: string;
      authorName: string;
    }>(
      `SELECT b.*, u.username as authorUsername, u.name as authorName
       FROM Blog b
       JOIN AdminUser u ON b.authorId = u.id
       WHERE b.slug = ? AND b.status = 1`,
      [slug]
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Get categories
    const categories = await query<Array<{
      id: number;
      name: string;
      image: string | null;
    }>>(
      `SELECT c.id, c.name, c.image
       FROM BlogCategory bc
       JOIN Category c ON bc.categoryId = c.id
       WHERE bc.blogId = ?`,
      [blog.id]
    );

    // Get FAQs
    const faqs = await query<Array<{
      id: number;
      question: string;
      answer: string;
      createdAt: Date;
      updatedAt: Date;
    }>>(
      'SELECT * FROM FAQ WHERE blogId = ?',
      [blog.id]
    );

    // Get comments
    const comments = await query<Array<{
      id: number;
      content: string;
      userId: number;
      createdAt: Date;
      updatedAt: Date;
      userName: string;
      userEmail: string;
    }>>(
      `SELECT c.*, u.name as userName, u.email as userEmail
       FROM Comment c
       JOIN User u ON c.userId = u.id
       WHERE c.blogId = ?
       ORDER BY c.createdAt ASC`,
      [blog.id]
    );

    // Get likes
    const likes = await query<Array<{
      id: number;
      userId: number;
      createdAt: Date;
    }>>(
      'SELECT id, userId, createdAt FROM Likes WHERE blogId = ?',
      [blog.id]
    );

    // Get favorites
    const favorites = await query<Array<{
      id: number;
      userId: number;
      createdAt: Date;
    }>>(
      'SELECT id, userId, createdAt FROM Favorite WHERE blogId = ?',
      [blog.id]
    );

    // Get related articles
    const relatedArticles = await query<Array<{
      id: number;
      title: string;
      slug: string;
      image: string | null;
    }>>(
      `SELECT b.id, b.title, b.slug, b.image
       FROM BlogRelation br
       JOIN Blog b ON br.relatedBlogId = b.id
       WHERE br.blogId = ?`,
      [blog.id]
    );

    // Format response
    const formattedBlog = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      image: blog.image,
      imageAlt: blog.imageAlt,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords,
      status: blog.status,
      authorId: blog.authorId,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      author: {
        username: blog.authorUsername,
        name: blog.authorName
      },
      categories: categories.map(cat => ({
        category: {
          id: cat.id,
          name: cat.name,
          image: cat.image
        }
      })),
      faqs: faqs,
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          name: comment.userName,
          email: comment.userEmail
        }
      })),
      likes: likes,
      favorites: favorites,
      relatedArticles: relatedArticles.map(article => ({
        relatedBlog: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          image: article.image
        }
      }))
    };

    return NextResponse.json(formattedBlog);
  } catch (error) {
    console.error("Error fetching blog details:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog details" },
      { status: 500 }
    );
  }
}

