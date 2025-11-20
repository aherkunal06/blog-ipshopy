import { execute } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blogId = Number(id);
    
    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    // Delete blog (cascade will handle related records)
    const affectedRows = await execute('DELETE FROM Blog WHERE id = ?', [blogId]);

    if (affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to delete blog" }, { status: 500 });
  }
}

