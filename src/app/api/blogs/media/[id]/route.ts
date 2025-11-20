// app/api/blogs/media/[id]/route.ts
import { NextResponse } from "next/server";
import { queryOne, execute } from "@/lib/db";
import { uploadImageToCloudinary } from "@/lib/uploadImageMiddleware";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!id) return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });

    const form = await req.formData();
    const title = form.get("title") as string | null;
    const imageAlt = form.get("imageAlt") as string | null;
    const imageFile = form.get("image") as File | null;

    const existing = await queryOne<{
      id: number;
      title: string;
      image: string | null;
      imageAlt: string | null;
    }>('SELECT id, title, image, imageAlt FROM Blog WHERE id = ?', [id]);

    if (!existing) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    let uploadedUrl: string | null = null;

    if (imageFile) {
      // Upload new image
      const { secure_url } = await uploadImageToCloudinary(imageFile);
      uploadedUrl = secure_url;
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (title !== null) {
      updates.push('title = ?');
      params.push(title);
    } else {
      updates.push('title = ?');
      params.push(existing.title);
    }

    if (imageAlt !== null) {
      updates.push('imageAlt = ?');
      params.push(imageAlt);
    } else {
      updates.push('imageAlt = ?');
      params.push(existing.imageAlt);
    }

    if (uploadedUrl !== null) {
      updates.push('image = ?');
      params.push(uploadedUrl);
    } else {
      updates.push('image = ?');
      params.push(existing.image);
    }

    params.push(id);

    await execute(
      `UPDATE Blog SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const updated = await queryOne<{
      id: number;
      title: string;
      image: string | null;
      imageAlt: string | null;
    }>('SELECT id, title, image, imageAlt FROM Blog WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      blog: updated,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || "Failed to update blog image" },
      { status: 500 }
    );
  }
}

