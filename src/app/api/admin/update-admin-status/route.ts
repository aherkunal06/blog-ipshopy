import { NextRequest, NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { hasSuperAdminAccess } from "@/lib/hasSuperAdminAccess";

export async function POST(req: NextRequest) {
  try {
    // Verify admin token
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Check if user has super admin access
    const session = { user: { role: token.role, email: token.email } };
    const hasAccess = await hasSuperAdminAccess(session as any);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Unauthorized: Insufficient permissions" },
        { status: 403 }
      );
    }

    // Parse request body
    const { id, status } = await req.json();
    
    if (!id || !status || !["active", "inactive"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Check if trying to modify a super admin
    const adminToUpdate = await queryOne<{ isSuper: boolean }>(
      'SELECT isSuper FROM AdminUser WHERE id = ?',
      [id]
    );

    if (!adminToUpdate) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    if (adminToUpdate.isSuper) {
      return NextResponse.json(
        { error: "Cannot modify super admin status" },
        { status: 403 }
      );
    }

    // Update admin status (convert active/inactive to approved/pending)
    const dbStatus = status === 'active' ? 'approved' : 'pending';
    await execute(
      'UPDATE AdminUser SET status = ? WHERE id = ?',
      [dbStatus, id]
    );

    // Fetch updated admin
    const updatedAdmin = await queryOne<{
      id: number;
      username: string;
      status: string;
      isSuper: boolean;
      role: string;
    }>(
      'SELECT id, username, status, isSuper, role FROM AdminUser WHERE id = ?',
      [id]
    );

    return NextResponse.json({ admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating admin status:", error);
    return NextResponse.json(
      { error: "Failed to update admin status" },
      { status: 500 }
    );
  }
}

