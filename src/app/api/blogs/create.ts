import type { NextApiRequest, NextApiResponse } from "next";
import { transaction, connInsert, connExecute, connQuery } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const {
      metaTitle,
      metaDescription,
      metaKeywords,
      mainHeading,
      cardMoreDetails,
      faq,
      relatedArticles,
      slug,
      categories,
    } = req.body;

    const blog = await transaction(async (conn) => {
      // Create blog
      const blogId = await connInsert(
        conn,
        `INSERT INTO Blog (title, slug, content, metaTitle, metaDescription, metaKeywords, status, authorId)
         VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
        [mainHeading, slug, "", metaTitle, metaDescription, Array.isArray(metaKeywords) ? metaKeywords.join(",") : metaKeywords]
      );

      // Create or connect categories
      if (Array.isArray(categories) && categories.length > 0) {
        for (const catName of categories) {
          // Check if category exists
          let category = await connQuery<Array<{ id: number }>>(
            conn,
            'SELECT id FROM Category WHERE name = ?',
            [catName]
          );

          let categoryId: number;
          if (category.length === 0) {
            // Create category if it doesn't exist
            categoryId = await connInsert(
              conn,
              'INSERT INTO Category (name, slug) VALUES (?, ?)',
              [catName, catName.toLowerCase().replace(/\s+/g, '-')]
            );
          } else {
            categoryId = category[0].id;
          }

          // Link blog to category
          await connExecute(
            conn,
            'INSERT INTO BlogCategory (blogId, categoryId) VALUES (?, ?)',
            [blogId, categoryId]
          );
        }
      }

      // Create FAQs
      if (Array.isArray(faq) && faq.length > 0) {
        for (const item of faq) {
          await connInsert(
            conn,
            'INSERT INTO FAQ (blogId, question, answer) VALUES (?, ?, ?)',
            [blogId, item.headlineForFAQ, item.headlineFaqDescription]
          );
        }
      }

      // Fetch created blog with relations
      const blogData = await connQuery<Array<{
        id: number;
        title: string;
        slug: string;
        content: string;
        metaTitle: string | null;
        metaDescription: string | null;
        metaKeywords: string | null;
        status: boolean;
        authorId: number;
        createdAt: Date;
        updatedAt: Date;
      }>>(
        conn,
        'SELECT * FROM Blog WHERE id = ?',
        [blogId]
      );

      return blogData[0];
    });

    return res.status(201).json(blog);
  } catch (error) {
    console.error("Blog creation error:", error);
    return res.status(500).json({ message: "Failed to create blog" });
  }
}

