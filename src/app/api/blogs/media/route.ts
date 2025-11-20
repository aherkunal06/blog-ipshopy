///src/app/api/blogs/media/route.ts
import { query, queryOne } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "8");
    const skip = (page - 1) * limit;

    const [blogs, countResult] = await Promise.all([
      query<Array<{
        id: number;
        title: string;
        image: string | null;
        imageAlt: string | null;
      }>>(
        'SELECT id, title, image, imageAlt FROM Blog ORDER BY createdAt DESC LIMIT ? OFFSET ?',
        [limit, skip]
      ),
      queryOne<{ count: bigint }>('SELECT COUNT(*) as count FROM Blog')
    ]);

    const totalBlogs = Number(countResult?.count || 0);
    const totalPages = Math.ceil(totalBlogs / limit);

    return NextResponse.json({
      blogs,
      totalPages,
      currentPage: page,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blog images" },
      { status: 500 }
    );
  }
}

