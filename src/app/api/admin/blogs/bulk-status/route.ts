import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export async function PATCH(req: Request) {
  try {
    const { ids, status } = await req.json();

    if (!Array.isArray(ids) || typeof status !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    if (ids.length === 0) {
      return NextResponse.json({ updatedCount: 0 });
    }

    const placeholders = ids.map(() => '?').join(',');
    const affectedRows = await execute(
      `UPDATE Blog SET status = ? WHERE id IN (${placeholders})`,
      [status ? 1 : 0, ...ids]
    );

    return NextResponse.json({ updatedCount: affectedRows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

