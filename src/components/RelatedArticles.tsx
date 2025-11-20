"use client";
import Image from "next/image";
interface RelatedBlogSummary { id: number; title: string; slug: string; image: string; }
interface BlogRelation { relatedBlog?: RelatedBlogSummary; }
interface Props { relatedArticles: BlogRelation[]; }

export default function RelatedArticles({ relatedArticles }: Props) {
  if (!relatedArticles.length) return null;
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-3">Related Articles</h2>
      <div className="flex flex-col gap-3">
        {relatedArticles.map(
          (rel) =>
            rel.relatedBlog && (
              <a
                key={rel.relatedBlog.id}
                href={`/blogs/${rel.relatedBlog.slug}`}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 dark:text-sky-400 transition"
              >
                <Image
                  src={rel.relatedBlog.image || "/placeholder.png"}
                  alt={rel.relatedBlog.title}
                  width={50}
                  height={50}
                  className="object-cover rounded-md"
                />
                <span>{rel.relatedBlog.title}</span>
              </a>
            )
        )}
      </div>
    </div>
  );
}
