// app/api/information/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, insert, transaction, connQuery, connExecute } from "@/lib/db";

const allowedStatus = ["PENDING", "APPROVED", "DISAPPROVED"] as const;
type Status = (typeof allowedStatus)[number];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? undefined;
    const status = searchParams.get("status") ?? undefined;

    let sql = 'SELECT * FROM information WHERE 1=1';
    const params: any[] = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY createdAt DESC';

    const items = await query<Array<{
      id: number;
      type: string;
      content: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>>(sql, params);

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("GET /api/information error:", error);
    return NextResponse.json({ error: "Failed to fetch information" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = body?.content;
    const type = body?.type;
    const requestedStatus = body?.status as Status | undefined;

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!type || typeof type !== "string") {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }
    if (requestedStatus && !allowedStatus.includes(requestedStatus)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // If explicitly APPROVED -> create + set others to PENDING
    if (requestedStatus === "APPROVED") {
      const created = await transaction(async (conn) => {
        const newInfoId = await connInsert(
          conn,
          'INSERT INTO information (content, type, status) VALUES (?, ?, ?)',
          [content, type, "APPROVED"]
        );

        // Set other entries of the same type to PENDING (except DISAPPROVED)
        await connExecute(
          conn,
          `UPDATE information SET status = 'PENDING' 
           WHERE type = ? AND id != ? AND status != 'DISAPPROVED'`,
          [type, newInfoId]
        );

        const newInfo = await connQuery<Array<{
          id: number;
          type: string;
          content: string;
          status: string;
          createdAt: Date;
          updatedAt: Date;
        }>>(
          conn,
          'SELECT * FROM information WHERE id = ?',
          [newInfoId]
        );

        return newInfo[0];
      });

      return NextResponse.json(created, { status: 201 });
    }

    // Default: first entry of this type = APPROVED, others = PENDING
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM information WHERE type = ? LIMIT 1',
      [type]
    );
    const status: Status = existing ? "PENDING" : "APPROVED";

    const newInfoId = await insert(
      'INSERT INTO information (content, type, status) VALUES (?, ?, ?)',
      [content, type, status]
    );

    const newInfo = await queryOne<{
      id: number;
      type: string;
      content: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>(
      'SELECT * FROM information WHERE id = ?',
      [newInfoId]
    );

    return NextResponse.json(newInfo, { status: 201 });
  } catch (error) {
    console.error("POST /api/information error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

