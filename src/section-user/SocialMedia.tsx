"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useThemeContext } from "@/context/ThemeContext";
import { FaLinkedin, FaThumbsUp, FaShare } from "react-icons/fa";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.12, duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const SocialMedia = () => {
  const { theme } = useThemeContext();

  return (
    <div
      className={`px-4 md:px-10 py-6 md:py-12 text-center relative overflow-hidden transition-colors duration-150 ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      }`}
    >
      <h2 className="font-semibold mb-6 text-2xl sm:text-3xl md:text-5xl leading-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
        Social Media{" "}
        <span className={theme === "dark" ? "text-sky-400" : "text-sky-500"}>Updates</span>
      </h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.35, once: true }}
        className="flex gap-4 md:gap-6 py-2 overflow-x-auto md:overflow-x-hidden px-1 md:px-0 scrollbar-hide"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[260px] sm:w-[300px] md:w-1/3"
          >
            <SocialMediaCard theme={theme} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SocialMedia;

interface SocialMediaCardProps {
  theme: string;
}

const SocialMediaCard = ({ theme }: SocialMediaCardProps) => {
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const cardText = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const hoverBg = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const iconColor = theme === "dark" ? "text-sky-400" : "text-sky-600";

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        rotateX: 1.5,
        rotateY: 1,
        boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      whileTap={{ scale: 0.97 }}
      tabIndex={0}
      className={`p-4 sm:p-5 rounded-2xl text-left border border-black/10 shadow-lg cursor-pointer transition-all duration-300 ${cardBg} ${cardText} ${hoverBg}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <FaLinkedin className={`${iconColor} text-xl`} />
        <h3 className="text-lg sm:text-xl font-bold">LinkedIn</h3>
      </div>

      <p className="text-sm sm:text-base mb-3 leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam,
        explicabo molestiae recusandae aspernatur expedita praesentium omnis
        quis soluta.
      </p>

      <div className="flex gap-4 items-center text-sm sm:text-base">
        <div className="flex items-center gap-1">
          <FaThumbsUp />
          <span className="font-medium">2.5k</span>
        </div>
        <div className="flex items-center gap-1">
          <FaShare />
          <span className="font-medium">234</span>
        </div>
      </div>
    </motion.div>
  );
};
