// src/app/blogs/category/[slug]/page.tsx
import { queryOne, query } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await queryOne<{
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
  }>(
    'SELECT id, name, slug, description, image FROM Category WHERE slug = ?',
    [slug]
  );

  if (!category) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold">Category not found</h2>
      </div>
    );
  }

  // Get blogs in this category
  const blogs = await query<Array<{
    id: number;
    title: string;
    slug: string;
    image: string | null;
    metaDescription: string | null;
    createdAt: Date;
  }>>(
    `SELECT b.id, b.title, b.slug, b.image, b.metaDescription, b.createdAt
     FROM Blog b
     JOIN BlogCategory bc ON b.id = bc.blogId
     WHERE bc.categoryId = ? AND b.status = 1
     ORDER BY b.createdAt DESC`,
    [category.id]
  );

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "Unknown date";
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto pt-20">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        {category.name}
      </h1>

      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No blogs have been added to this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const imgSrc = blog.image || "/default-blog.png";

            return (
              <div key={blog.id} className="flex">
                <Link
                  href={`/${blog.slug}`}
                  className="block w-full group"
                >
                  <article className="h-[400px] bg-white dark:bg-black rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border border-gray-200 dark:border-gray-700 flex flex-col">
                    {/* Image Section - Fixed Height */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <Image
                        src={imgSrc}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content Section - Fixed Height */}
                    <div className="p-4 flex-1 flex flex-col justify-between h-[208px]">
                      {/* Title */}
                      <div className="mb-3">
                        <h2
                          className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '3.5rem', // Fixed height for 2 lines
                          }}
                        >
                          {blog.title}
                        </h2>
                      </div>

                      {/* Description */}
                      <div className="mb-4 flex-1">
                        <p
                          className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '4rem', // Fixed height for 3 lines
                          }}
                        >
                          {blog.metaDescription || "Read this blog to learn more..."}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                        <time
                          dateTime={blog.createdAt?.toISOString()}
                          className="text-xs text-gray-500 dark:text-gray-400 font-medium"
                        >
                          {blog.createdAt ? formatDate(blog.createdAt) : "Unknown date"}
                        </time>

                        {/* Read More Arrow */}
                        <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
