// src/app/admin/blogs/edit/[id]/page.tsx
import BlogForm from '@/admin-components/BlogForm';

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageParams) {
  const { id } = await params; // Next.js 15 requires awaiting params
  const blogId = Number.parseInt(id, 10);
  return <BlogForm blogId={blogId} />;
}
