"use client";

import Navbar from "./Navbar";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return <Navbar theme={theme} toggleTheme={toggleTheme} />;
};

export default Header;
