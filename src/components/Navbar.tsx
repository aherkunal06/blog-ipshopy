"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useThemeContext } from "@/context/ThemeContext";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

type Suggestion = { id: number; title: string; slug: string };

const pages = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
];

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useThemeContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setShowDropdown(false);
      setActiveIndex(-1);
      controllerRef.current?.abort();
      return;
    }

    const handler = setTimeout(async () => {
      try {
        // Abort previous request only before starting a new one
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        const res = await fetch(
          `/api/blogs?search=${encodeURIComponent(searchQuery)}&suggest=1`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setSearchResults((data.blogs || []) as Suggestion[]);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selectedBlog = searchResults[activeIndex >= 0 ? activeIndex : 0];
      if (selectedBlog) {
        router.push(`/site/${selectedBlog.slug}`);
        setSearchQuery("");
        setShowDropdown(false);
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setMobileSearchOpen(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/user/login" });
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const linkBaseClass = "text-sm font-medium cursor-pointer transition-all duration-300 relative group";
  const linkThemeClass = (active: boolean) => {
    if (active) {
      return "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500";
    }
    return theme === "dark"
      ? "text-gray-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400"
      : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600";
  };

  const linkUnderline = (active: boolean) => (
    <span
      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform transition-transform duration-300 ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md ${
          theme === "dark" ? "bg-gray-900/90 border-b border-gray-800" : "bg-white/90 border-b border-gray-200 shadow-sm"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push("/")}>
              <div className="w-10 h-10 relative transition-transform duration-300 group-hover:scale-105">
                <Image src="/ipshopylogo.png" alt="Logo" fill className="object-cover rounded-xl shadow-md" />
              </div>
              <div className="hidden sm:block text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse">
                ipshopyBlogs
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {pages.map((page) => (
                <Link key={page.link} href={page.link}>
                  <span className={`${linkBaseClass} ${linkThemeClass(pathname === page.link)} px-3 py-2`}>
                    {page.title}
                    {linkUnderline(pathname === page.link)}
                  </span>
                </Link>
              ))}
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:block relative">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  className={`pl-4 pr-10 py-2.5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:bg-gray-800"
                      : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white"
                  }`}
                />
                <FaSearch className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
              </div>

              {showDropdown && (
                <div
                  className={`absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-xl border shadow-2xl backdrop-blur-sm ${
                    theme === "dark" ? "bg-gray-800/95 border-gray-600 text-white" : "bg-white/95 border-gray-200 text-gray-900"
                  }`}
                >
                  {loading ? (
                    <div className="px-4 py-3 text-center">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                      <span className="ml-2 text-sm">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((blog, index) => (
                      <div
                        key={blog.id}
                        className={`px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                          activeIndex === index ? "bg-purple-500 text-white" : theme === "dark" ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-100"
                        }`}
                        onClick={() => {
                          router.push(`/site/${blog.slug}`);
                          setSearchQuery("");
                          setShowDropdown(false);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="font-medium text-sm truncate">{blog.title}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop Auth & Theme */}
            <div className="hidden lg:flex items-center space-x-4">
              {!session ? (
                <button
                  onClick={() => router.push("/auth/user/login")}
                  className={`px-6 py-2 rounded-full border-2 font-medium transition-all duration-300 hover:scale-105 ${
                    theme === "dark" ? "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
              ) : (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all duration-300 hover:scale-105 ${
                      theme === "dark" ? "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    {getInitials(session.user.name)}
                  </button>

                  {dropdownOpen && (
                    <div className={`absolute right-0 mt-3 w-48 rounded-xl shadow-2xl border backdrop-blur-sm ${theme === "dark" ? "bg-gray-800/95 border-gray-600" : "bg-white/95 border-gray-200"}`}>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/auth/user/login" });
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm font-medium rounded-b-xl transition-colors ${theme === "dark" ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button onClick={toggleTheme} className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${theme === "dark" ? "text-yellow-400 hover:bg-yellow-400/10" : "text-gray-600 hover:bg-gray-200"}`}>
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center space-x-2">
              <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                <FaSearch className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`relative p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block h-0.5 w-6 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""} ${theme === "dark" ? "bg-white" : "bg-gray-900"}`} />
                  <span className={`block h-0.5 w-6 my-1 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "opacity-100"} ${theme === "dark" ? "bg-white" : "bg-gray-900"}`} />
                  <span className={`block h-0.5 w-6 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""} ${theme === "dark" ? "bg-white" : "bg-gray-900"}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="lg:hidden px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  className={`w-full pl-4 pr-10 py-2.5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                    theme === "dark" ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <button onClick={() => setMobileSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <FaTimes className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />
                </button>
              </div>

              {showDropdown && (
                <div className={`absolute left-4 right-4 z-50 mt-2 max-h-64 overflow-auto rounded-xl border shadow-2xl ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                  {loading ? (
                    <div className="px-4 py-3 text-center">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                      <span className="ml-2 text-sm">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((blog, index) => (
                      <div
                        key={blog.id}
                        className={`px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                          activeIndex === index ? "bg-purple-500 text-white" : theme === "dark" ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-100"
                        }`}
                        onClick={() => {
                          router.push(`/site/${blog.slug}`);
                          setSearchQuery("");
                          setShowDropdown(false);
                          setMobileSearchOpen(false);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <div className="font-medium text-sm truncate">{blog.title}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileMenu} />
          <div className={`fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 lg:hidden ${theme === "dark" ? "bg-gray-900" : "bg-white"} shadow-2xl`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Menu</h2>
                <button onClick={closeMobileMenu} className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                  <FaTimes className={theme === "dark" ? "text-white" : "text-gray-900"} />
                </button>
              </div>

              <nav className="space-y-4">
                {pages.map((page) => (
                  <Link key={page.link} href={page.link} onClick={closeMobileMenu}>
                    <div
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        pathname === page.link ? "bg-purple-500 text-white" : theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page.title}
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {!session ? (
                  <button
                    onClick={() => {
                      router.push("/auth/user/login");
                      closeMobileMenu();
                    }}
                    className={`w-full px-4 py-3 rounded-lg font-medium border-2 transition-colors ${
                      theme === "dark" ? "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" : "border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    Sign In
                  </button>
                ) : (
                  <>
                    <div className={`px-4 py-3 rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                      <p className="font-medium text-sm truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut({ callbackUrl: "/auth/user/login" });
                        closeMobileMenu();
                      }}
                      className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${theme === "dark" ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
                    >
                      Logout
                    </button>
                  </>
                )}

                <button onClick={toggleTheme} className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                  {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;

