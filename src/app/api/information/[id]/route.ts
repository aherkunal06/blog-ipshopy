// app/api/information/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute, transaction, connQuery, connExecute } from "@/lib/db";

const allowedStatus = ["PENDING", "APPROVED", "DISAPPROVED"] as const;
type Status = (typeof allowedStatus)[number];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json();
    const content = body?.content;
    const status = body?.status as Status | undefined;

    if (status && !allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    if (status === "APPROVED") {
      const updated = await transaction(async (conn) => {
        // Get the information entry to know its type
        const infoEntry = await connQuery<Array<{
          id: number;
          type: string;
          content: string;
          status: string;
        }>>(
          conn,
          'SELECT * FROM information WHERE id = ?',
          [id]
        );

        if (!infoEntry || infoEntry.length === 0) {
          throw new Error('Information entry not found');
        }

        const entry = infoEntry[0];

        // Update the current entry
        const updates: string[] = [];
        const params: any[] = [];

        if (content) {
          updates.push('content = ?');
          params.push(content);
        }
        updates.push('status = ?');
        params.push(status);
        params.push(id);

        await connExecute(
          conn,
          `UPDATE information SET ${updates.join(', ')} WHERE id = ?`,
          params
        );

        // Set other entries of the same type to PENDING (except DISAPPROVED ones)
        await connExecute(
          conn,
          `UPDATE information SET status = 'PENDING' 
           WHERE type = ? AND id != ? AND status != 'DISAPPROVED'`,
          [entry.type, id]
        );

        // Fetch updated entry
        const updatedEntry = await connQuery<Array<{
          id: number;
          type: string;
          content: string;
          status: string;
          createdAt: Date;
          updatedAt: Date;
        }>>(
          conn,
          'SELECT * FROM information WHERE id = ?',
          [id]
        );

        return updatedEntry[0];
      });

      return NextResponse.json(updated, { status: 200 });
    }

    if (content && content.length > 10000) {
      return NextResponse.json({ error: "Content too long" }, { status: 400 });
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (content) {
      updates.push('content = ?');
      params.push(content);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    params.push(id);

    await execute(
      `UPDATE information SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updated = await queryOne<{
      id: number;
      type: string;
      content: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>(
      'SELECT * FROM information WHERE id = ?',
      [id]
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/information/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update information" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const deleted = await queryOne<{
      id: number;
      type: string;
      content: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>(
      'SELECT * FROM information WHERE id = ?',
      [id]
    );

    if (!deleted) {
      return NextResponse.json({ error: "Information not found" }, { status: 404 });
    }

    await execute('DELETE FROM information WHERE id = ?', [id]);

    return NextResponse.json({ success: true, deleted }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/information/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete information" },
      { status: 500 }
    );
  }
}

