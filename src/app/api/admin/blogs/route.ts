import { NextResponse } from 'next/server';
import { query, queryOne, execute } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const statusParam = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const skip = (page - 1) * pageSize;

    // Build WHERE conditions dynamically
    const whereClauses: string[] = [];
    const queryParams: any[] = [];

    if (search) {
      whereClauses.push('(LOWER(b.title) LIKE ? OR LOWER(u.username) LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    if (statusParam === 'true' || statusParam === 'false') {
      whereClauses.push('b.status = ?');
      queryParams.push(statusParam === 'true' ? 1 : 0);
    }

    if (startDate) {
      whereClauses.push('b.createdAt >= ?');
      queryParams.push(startDate);
    }

    if (endDate) {
      whereClauses.push('b.createdAt <= ?');
      queryParams.push(endDate);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Query paginated blogs
    const blogs = await query<Array<{
      id: number;
      title: string;
      image: string | null;
      status: number;
      authorId: number;
      authorUsername: string;
    }>>(
      `SELECT b.id, b.title, b.image, b.status, b.authorId, u.username as authorUsername
       FROM Blog b
       JOIN AdminUser u ON b.authorId = u.id
       ${whereSQL}
       ORDER BY b.createdAt DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, pageSize, skip]
    );

    // Query total count
    const countResult = await queryOne<{ count: bigint }>(
      `SELECT COUNT(*) as count
       FROM Blog b
       JOIN AdminUser u ON b.authorId = u.id
       ${whereSQL}`,
      queryParams
    );

    const total = Number(countResult?.count) || 0;

    // Reformat the result to match frontend expectations
    const formatted = blogs.map(blog => ({
      id: Number(blog.id),
      title: blog.title,
      image: blog.image,
      status: !!blog.status,
      authorId: Number(blog.authorId),
      author: { username: blog.authorUsername },
    }));

    return NextResponse.json({ blogs: formatted, total });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const affectedRows = await execute(
      'UPDATE Blog SET status = ? WHERE id = ?',
      [status ? 1 : 0, id]
    );

    if (affectedRows === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const updated = await queryOne<{
      id: number;
      title: string;
      image: string | null;
      status: number;
      authorId: number;
    }>('SELECT id, title, image, status, authorId FROM Blog WHERE id = ?', [id]);

    return NextResponse.json({
      id: updated!.id,
      title: updated!.title,
      image: updated!.image,
      status: !!updated!.status,
      authorId: updated!.authorId
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

