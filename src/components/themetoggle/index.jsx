import React, { useEffect, useState } from "react";
import { FiMoon, FiSun, FiCoffee } from "react-icons/fi";
import "./style.css";

const THEMES = ["dark", "light", "cream"];

const Themetoggle = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const nextTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const next = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <FiSun className="theme-icon light-icon" title="Light Theme (Click to switch to Cream)" />;
      case "cream":
        return <FiCoffee className="theme-icon cream-icon" title="Cream Theme (Click to switch to Dark)" />;
      default:
        return <FiMoon className="theme-icon dark-icon" title="Dark Theme (Click to switch to Light)" />;
    }
  };

  return (
    <button
      className="theme-toggle-btn nav_ac"
      onClick={nextTheme}
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme.toUpperCase()} (Click to toggle Dark / Light / Cream)`}
    >
      <span className="theme-icon-wrap">{getIcon()}</span>
      <span className="theme-name d-none d-md-inline">{theme}</span>
    </button>
  );
};

export default Themetoggle;
