"use client";

import { useThemeContext } from "@/context/ThemeContext";
import HeroSection from "@/section-user/HeroSection";
import HeroCards from "@/section-user/HeroCards";
import FeaturedArticles from "@/section-user/FeaturedArticles";
import Banner from "@/section-user/Banner";
import ExploreCategories from "@/section-user/ExploreCategories";
import SocialMedia from "@/section-user/SocialMedia";

export default function Home() {
  const { theme } = useThemeContext();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-black" : "bg-gray-50"}`}>
      <HeroSection />
      <HeroCards />
      <FeaturedArticles />
      <Banner />
      <ExploreCategories />
      <SocialMedia />
    </div>
  );
}
