// src/app/blogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

interface Category {
  id: number;
  name: string;
  image: string;
}

interface BlogCategory {
  category: Category;
}

interface Author {
  username: string;
  name?: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface Comment {
  id: number;
  content: string;
}

interface RelatedBlogSummary {
  id: number;
  title: string;
  slug: string;
  image: string;
}

interface BlogRelation {
  relatedBlog?: RelatedBlogSummary;
  mainBlog?: RelatedBlogSummary;
}

interface BlogDetails {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: boolean;
  author: { username: string };
  categories: BlogCategory[];
  faqs: FAQ[];
  comments: Comment[];
  likes: any[];
  favorites: any[];
  relatedArticles: BlogRelation[];
  relatedTo: BlogRelation[];
  createdAt: string;
  updatedAt: string;
}

// Fetch blog by slug
async function getBlogBySlug(slug: string): Promise<BlogDetails | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  } catch (err) {
    console.error("Error fetching blog:", err);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Blog Post Not Found", description: "Blog not found" };

  const keywordsArray = blog.metaKeywords
    ? blog.metaKeywords.split(",").map((kw) => kw.trim())
    : blog.metaTitle
    ? blog.metaTitle.split(" ").map((w) => w.toLowerCase())
    : blog.title.split(" ").map((w) => w.toLowerCase());

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.title,
    keywords: keywordsArray.join(", "),
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.title,
      url: `${baseUrl}/blogs/${blog.slug}`,
      siteName: "Your Blog Name",
      images: blog.image ? [{ url: blog.image, width: 800, height: 600, alt: blog.title }] : [],
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
    },
    twitter: {
      card: blog.image ? "summary_large_image" : "summary",
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.title,
      creator: blog.author.username ? `@${blog.author.username}` : undefined,
      images: blog.image ? [blog.image] : [],
    },
    alternates: { canonical: `${baseUrl}/blogs/${blog.slug}` },
  };
}

// Blog page
export default async function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mt-5 pt-12 pb-8">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-gray-200 bg-clip-text text-transparent leading-tight mb-6">
            {blog.title}
          </h1>

          {/* Author & Date Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {(blog.author.username || blog.author.name || 'A')[0].toUpperCase()}
              </div>
              <span className="font-medium">{blog.author.username || blog.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Updated {formatDate(blog.updatedAt)}</span>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] relative rounded-2xl overflow-hidden shadow-2xl mb-12 group">
              <Image 
                src={blog.image} 
                alt={blog.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
                priority 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Blog Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Engagement Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Engagement</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Likes</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{blog.likes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Favorites</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{blog.favorites.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Comments</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{blog.comments.length}</span>
                </div>
              </div>
            </div>

            {/* Related Articles Sidebar */}
            {blog.relatedArticles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Related Articles</h3>
                <div className="space-y-4">
                  {blog.relatedArticles.slice(0, 3).map(
                    (rel) =>
                      rel.relatedBlog && (
                        <Link
                          key={rel.relatedBlog.id}
                          href={`/blogs/${rel.relatedBlog.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                            <div className="w-16 h-12 relative flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={rel.relatedBlog.image || "/placeholder.png"}
                                alt={rel.relatedBlog.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                                {rel.relatedBlog.title}
                              </h4>
                            </div>
                          </div>
                        </Link>
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQs Section */}
        {blog.faqs.length > 0 && (
          <div className="mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {blog.faqs.map((faq, index) => (
                  <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              Comments ({blog.comments.length})
            </h2>
            {blog.comments.length > 0 ? (
              <div className="space-y-6">
                {blog.comments.map((comment, index) => (
                  <div key={comment.id} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-r-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Anonymous User</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}