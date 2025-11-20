import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: filter by type & status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");

    let sql = 'SELECT * FROM information WHERE 1=1';
    const params: any[] = [];

    if (typeParam) {
      sql += ' AND type = ?';
      params.push(typeParam);
    }

    if (statusParam) {
      sql += ' AND status = ?';
      params.push(statusParam);
    }

    sql += ' ORDER BY createdAt DESC';

    const infos = await query<Array<{
      id: number;
      type: string;
      content: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>>(sql, params);

    return NextResponse.json(infos, { status: 200 });
  } catch (error) {
    console.error("GET /api/information/status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

