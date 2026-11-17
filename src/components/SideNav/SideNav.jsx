import React, { useState, useEffect } from "react";
import "./style.css";
import {
  FiTerminal,
  FiUser,
  FiBriefcase,
  FiCpu,
  FiLayers,
  FiPackage,
  FiMail,
} from "react-icons/fi";

const NAV_ITEMS = [
  { id: "hero", label: "Intro", icon: FiTerminal },
  { id: "about", label: "About Me", icon: FiUser },
  { id: "experience", label: "Work Timeline", icon: FiBriefcase },
  { id: "skills", label: "Technical Skills", icon: FiCpu },
  { id: "services", label: "Architecture & Services", icon: FiLayers },
];

export const SideNav = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionElements = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter((item) => item.el !== null);

      if (sectionElements.length === 0) return;

      const viewportOffset = window.innerHeight * 0.35;
      let current = sectionElements[0].id;

      for (let i = 0; i < sectionElements.length; i++) {
        const rect = sectionElements[i].el.getBoundingClientRect();
        if (rect.top <= viewportOffset) {
          current = sectionElements[i].id;
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="side-center-nav-dock" aria-label="Quick section navigation">
      <div className="dock-glass-rail">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              className={`dock-nav-item ${isActive ? "active" : ""}`}
              onClick={() => scrollTo(item.id)}
              aria-label={item.label}
              title={item.label}
            >
              <span className="dock-icon-wrapper">
                <Icon className="dock-icon" />
              </span>
              <span className="dock-active-dot"></span>
              <span className="dock-tooltip">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
