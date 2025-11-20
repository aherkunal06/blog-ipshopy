"use client";
import { useState, useEffect } from "react";
import { useThemeContext } from "@/context/ThemeContext";

interface AboutEntry {
  id: number;
  content: string;
  imageUrl?: string;
  title?: string;
}

const extractHeadings = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const nodes = Array.from(doc.querySelectorAll("h4"));
  return nodes.map((node, i) => {
    const text = node.textContent?.trim() || `Section ${i + 1}`;
    const id =
      text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
      `section-${i + 1}`;
    node.setAttribute("id", id);
    return { id, text };
  });
};

const injectIds = (html: string, headings: { id: string; text: string }[]) => {
  if (headings.length === 0) return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  let idx = 0;
  doc.querySelectorAll("h4").forEach((h) => {
    const match = headings[idx];
    if (match) h.setAttribute("id", match.id);
    idx++;
  });
  return doc.body.innerHTML;
};

const About = () => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const [abouts, setAbouts] = useState<AboutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/information?type=ABOUT&status=APPROVED", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch About Us (${res.status})`);
        const data = await res.json();
        if (alive && Array.isArray(data)) setAbouts(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading)
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${isDark ? "border-blue-400" : "border-blue-600"}`}></div>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Loading content...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`max-w-md mx-auto text-center p-8 rounded-2xl shadow-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-red-100"}`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-red-900/30" : "bg-red-50"}`}>
            <svg className={`w-8 h-8 ${isDark ? "text-red-400" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Error Loading Content</h3>
          <p className={`text-sm ${isDark ? "text-gray-300" : "text-red-600"}`}>{error}</p>
        </div>
      </div>
    );

  if (abouts.length === 0)
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`max-w-md mx-auto text-center p-8 rounded-2xl shadow-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? "bg-blue-900/30" : "bg-blue-50"}`}>
            <svg className={`w-8 h-8 ${isDark ? "text-blue-400" : "text-blue-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>No Content Available</h3>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>About Us content will appear here once available.</p>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"}`}>
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute w-96 h-96 -top-48 -left-48 rounded-full filter blur-3xl opacity-70 animate-pulse ${isDark ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20" : "bg-gradient-to-r from-blue-400/30 to-cyan-400/20"}`}
          ></div>
          <div
            className={`absolute w-80 h-80 top-32 -right-40 rounded-full filter blur-3xl opacity-50 animate-pulse delay-1000 ${isDark ? "bg-gradient-to-r from-emerald-500/15 to-blue-500/15" : "bg-gradient-to-r from-emerald-400/20 to-blue-400/15"}`}
          ></div>
          <div
            className={`absolute w-64 h-64 bottom-0 left-1/3 rounded-full filter blur-3xl opacity-40 animate-pulse delay-2000 ${isDark ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10" : "bg-gradient-to-r from-purple-400/15 to-pink-400/10"}`}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h5 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 animate-pulse">
                About
              </span>{" "}
              <span className={`${isDark ? "text-white" : "text-gray-900"}`}>Our Story</span>
            </h5>
            <p className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Discover our journey, mission, and the values that drive everything we do
            </p>
            
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        {abouts.map((about, index) => {
          const headings = extractHeadings(about.content || "");
          const htmlWithIds = injectIds(about.content || "", headings);

          return (
            <div key={about.id} className={`${index > 0 ? "mt-20" : ""}`}>
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
                  {/* Enhanced TOC */}
                  {headings.length > 0 && (
                    <div className="xl:w-80 flex-shrink-0">
                      <div className={`sticky top-24 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                        isDark 
                          ? "bg-gray-800/80 border-gray-700 shadow-2xl" 
                          : "bg-white/80 border-gray-200 shadow-xl"
                      }`}>
                        <div className="flex items-center mb-4">
                          <div className={`w-1 h-6 rounded-full mr-3 ${isDark ? "bg-blue-400" : "bg-blue-500"}`}></div>
                          <h2 className={`font-bold text-lg ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                            Table of Contents
                          </h2>
                        </div>
                        
                        <div className={`h-px mb-4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                        
                        <nav className="space-y-2">
                          {headings.map((h) => (
                            <a
                              key={h.id}
                              href={`#${h.id}`}
                              className={`flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                isDark 
                                  ? "text-gray-300 hover:text-white hover:bg-gray-700/50" 
                                  : "text-gray-700 hover:text-gray-900 hover:bg-blue-50"
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full mr-3 transition-colors group-hover:scale-110 ${
                                isDark ? "bg-gray-600 group-hover:bg-blue-400" : "bg-gray-400 group-hover:bg-blue-500"
                              }`}></span>
                              <span className="truncate">{h.text}</span>
                            </a>
                          ))}
                        </nav>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Article Content */}
                  <div className="flex-1 min-w-0">
                    <article className={`p-8 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                      isDark 
                        ? "bg-gray-800/60 border-gray-700 shadow-2xl" 
                        : "bg-white/60 border-gray-200 shadow-xl"
                    }`}>
                      {about.title && (
                        <header className="mb-8">
                          <h1 className={`text-3xl md:text-4xl font-bold leading-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                            {about.title}
                          </h1>
                          <div className={`h-1 w-16 mt-4 rounded-full bg-gradient-to-r ${isDark ? "from-blue-400 to-cyan-400" : "from-blue-500 to-cyan-500"}`}></div>
                        </header>
                      )}
                      
                      {about.imageUrl && (
                        <div className="mb-8 group">
                          <div className="overflow-hidden rounded-2xl shadow-lg">
                            <img 
                              src={about.imageUrl} 
                              alt={about.title || "About Image"} 
                              className="w-full max-h-96 object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>
                        </div>
                      )}
                      
                      <div
                        className={`prose prose-lg max-w-none leading-relaxed ${
                          isDark 
                            ? "prose-invert text-gray-200 prose-headings:text-gray-100 prose-links:text-blue-400 prose-strong:text-gray-100" 
                            : "text-gray-800 prose-headings:text-gray-900 prose-links:text-blue-600 prose-strong:text-gray-900"
                        } prose-headings:font-bold prose-headings:tracking-tight prose-p:mb-6 prose-headings:mb-4 prose-headings:mt-8`}
                        dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                      />
                    </article>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Footer Section */}
      <div className={`mt-20 py-12 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="container mx-auto px-6 text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${
            isDark ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Want to know more? Feel free to reach out to us
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;