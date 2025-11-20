import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const blogs = await query<Array<{
      id: number;
      title: string;
      slug: string;
      content: string;
      image: string | null;
      status: boolean;
      authorId: number;
      createdAt: Date;
      updatedAt: Date;
    }>>(
      'SELECT * FROM Blog ORDER BY createdAt DESC'
    );

    // Get categories for each blog
    const blogIds = blogs.map(b => b.id);
    const categories = blogIds.length > 0 ? await query<Array<{
      blogId: number;
      categoryId: number;
      categoryName: string;
    }>>(
      `SELECT bc.blogId, c.id as categoryId, c.name as categoryName
       FROM BlogCategory bc
       JOIN Category c ON bc.categoryId = c.id
       WHERE bc.blogId IN (${blogIds.map(() => '?').join(',')})`,
      blogIds
    ) : [];

    // Get FAQs for each blog
    const faqs = blogIds.length > 0 ? await query<Array<{
      blogId: number;
      id: number;
      question: string;
      answer: string;
    }>>(
      `SELECT * FROM FAQ WHERE blogId IN (${blogIds.map(() => '?').join(',')})`,
      blogIds
    ) : [];

    // Get related articles
    const relatedArticles = blogIds.length > 0 ? await query<Array<{
      blogId: number;
      relatedBlogId: number;
    }>>(
      `SELECT blogId, relatedBlogId FROM BlogRelation WHERE blogId IN (${blogIds.map(() => '?').join(',')})`,
      blogIds
    ) : [];

    // Format response
    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      categories: categories
        .filter(c => c.blogId === blog.id)
        .map(c => ({ category: { id: c.categoryId, name: c.categoryName } })),
      faqs: faqs.filter(f => f.blogId === blog.id),
      relatedArticles: relatedArticles
        .filter(r => r.blogId === blog.id)
        .map(r => ({ relatedBlog: { id: r.relatedBlogId } }))
    }));

    return res.status(200).json(formattedBlogs);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

