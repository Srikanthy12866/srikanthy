import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import {
  FiTerminal,
  FiUser,
  FiBriefcase,
  FiCpu,
  FiLayers,
  FiShare2,
  FiLinkedin,
  FiGithub,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";
import { socialprofils } from "../../content_option";

const NAV_ITEMS = [
  { id: "hero", label: "Intro", icon: FiTerminal },
  { id: "about", label: "About Me", icon: FiUser },
  { id: "experience", label: "Work Timeline", icon: FiBriefcase },
  { id: "skills", label: "Technical Skills", icon: FiCpu },
  { id: "services", label: "Architecture & Services", icon: FiLayers },
];

export const SideNav = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [showSocials, setShowSocials] = useState(false);
  const socialWrapperRef = useRef(null);

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

  // Close flyout only when clicking completely outside the dock
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (socialWrapperRef.current && !socialWrapperRef.current.contains(e.target)) {
        setShowSocials(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

        {/* Subtle separator */}
        <div className="dock-divider"></div>

        {/* Social Hub Icon switched to Left side dock */}
        <div className="left-social-wrapper" ref={socialWrapperRef}>
          <button
            type="button"
            className={`dock-nav-item social-toggle-btn ${showSocials ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowSocials((prev) => !prev);
            }}
            title="Social Profiles"
            aria-label="Social Profiles"
          >
            <span className="dock-icon-wrapper">
              <FiShare2 className="dock-icon" />
            </span>
            <span className="dock-tooltip">Socials</span>
          </button>

          {/* Social Flyout: maintained and visible when clicked */}
          {showSocials && (
            <div
              className="left-social-flyout"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={socialprofils.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sub-btn"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <FiLinkedin />
              </a>
              <a
                href={socialprofils.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sub-btn"
                title="GitHub"
                aria-label="GitHub"
              >
                <FiGithub />
              </a>
              <a
                href={socialprofils.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sub-btn"
                title="Instagram"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              <a
                href={socialprofils.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-sub-btn"
                title="Facebook"
                aria-label="Facebook"
              >
                <FiFacebook />
              </a>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
