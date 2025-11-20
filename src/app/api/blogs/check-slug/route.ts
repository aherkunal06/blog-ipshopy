import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const excludeId = url.searchParams.get('excludeId'); // Optional: for editing existing blogs

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Check if the slug exists in the database
    const existingBlog = await queryOne<{ id: number }>(
      'SELECT id FROM Blog WHERE slug = ?',
      [slug]
    );

    let isUnique = !existingBlog;

    // If checking for an existing blog (e.g., during edit)
    if (excludeId && existingBlog) {
      if (existingBlog.id === parseInt(excludeId)) {
        isUnique = true; // The slug belongs to the current blog being edited, so it's unique for itself
      } else {
        isUnique = false; // The slug belongs to another blog
      }
    }

    return NextResponse.json({ isUnique });
  } catch (error) {
    console.error('Error checking slug uniqueness:', error);
    return NextResponse.json({ error: 'Failed to check slug uniqueness' }, { status: 500 });
  }
}

