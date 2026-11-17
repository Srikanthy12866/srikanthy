import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import {
  FiSend,
  FiPackage,
  FiMail,
  FiDownload,
  FiAlertCircle,
  FiHelpCircle,
  FiGithub,
} from "react-icons/fi";
import { triggerResumeDownload } from "../../utils/getResume";
import { socialprofils } from "../../content_option";

export const RightActionDock = () => {
  const [downloading, setDownloading] = useState(false);

  // Resume Download Handler
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await triggerResumeDownload("Srikanth_Yepalagunta_Resume.pdf");
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  return (
    <aside className="right-action-dock" aria-label="Action Hub">
      <div className="right-glass-rail">
        {/* 1. Hire Me -> Dedicated Contact page with hire intent */}
        <Link
          to="/contact?type=hire"
          className="action-btn hire-btn"
          title="Hire Me / Consultation"
          aria-label="Hire Me"
        >
          <FiSend className="action-icon" />
          <span className="action-tooltip">Hire Me</span>
        </Link>

        {/* 2. Products -> Dedicated Products Page */}
        <Link
          to="/products"
          className="action-btn"
          title="Go Seeker & Products"
          aria-label="Products"
        >
          <FiPackage className="action-icon" />
          <span className="action-tooltip">Products</span>
        </Link>

        {/* 3. Contact Me -> Dedicated Contact Page */}
        <Link
          to="/contact"
          className="action-btn"
          title="Contact Me"
          aria-label="Contact Me"
        >
          <FiMail className="action-icon" />
          <span className="action-tooltip">Contact Me</span>
        </Link>

        {/* 4. Download Resume -> Stream PDF from backend */}
        <button
          className={`action-btn resume-btn ${downloading ? "downloading" : ""}`}
          onClick={handleDownload}
          title="Download Resume (Google Drive Stream)"
          aria-label="Download Resume"
        >
          <FiDownload className="action-icon" />
          <span className="action-tooltip">
            {downloading ? "Streaming PDF..." : "Download Resume"}
          </span>
        </button>

        {/* 5. Report an Issue -> Dedicated Contact page with ticket tab */}
        <Link
          to="/contact?tab=ticket"
          className="action-btn"
          title="Report an Issue Ticket"
          aria-label="Report an Issue"
        >
          <FiAlertCircle className="action-icon text-warning" />
          <span className="action-tooltip">Report Issue</span>
        </Link>

        {/* 6. Suggestion for Product / Portfolio -> Dedicated Suggestion Page */}
        <Link
          to="/suggestion"
          className="action-btn"
          title="Suggest for Products or Portfolio"
          aria-label="Suggestion"
        >
          <FiHelpCircle className="action-icon" />
          <span className="action-tooltip">Suggestions</span>
        </Link>

        {/* 7. GitHub Details -> Opens GitHub repositories in new tab */}
        <a
          href={socialprofils.github || "https://github.com/Srikanthy12866?tab=repositories"}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn"
          title="GitHub Repositories & Activity"
          aria-label="GitHub Details"
        >
          <FiGithub className="action-icon" />
          <span className="action-tooltip">GitHub Profile</span>
        </a>
      </div>
    </aside>
  );
};
