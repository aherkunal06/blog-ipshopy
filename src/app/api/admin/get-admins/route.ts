import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { hasSuperAdminAccess } from "@/lib/hasSuperAdminAccess";

export async function GET(req: NextRequest) {
  try {
    // Verify admin token
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Check if user has admin access
    const session = { user: { role: token.role, email: token.email } };
    const hasAccess = await hasSuperAdminAccess(session as any);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Fetch all admin users
    const admins = await query<Array<{
      id: number;
      username: string;
      status: string;
      isSuper: boolean;
      role: string;
      createdAt: Date;
    }>>(
      `SELECT id, username, status, isSuper, role, createdAt
       FROM AdminUser
       ORDER BY createdAt DESC`
    );

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

