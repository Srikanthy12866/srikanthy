import React, { useState } from "react";
import "./style.css";
import {
  FiSend,
  FiPackage,
  FiMail,
  FiDownload,
  FiAlertCircle,
  FiHelpCircle,
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiFacebook,
  FiShare2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { triggerResumeDownload } from "../../utils/getResume";
import { socialprofils, contactConfig } from "../../content_option";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export const RightActionDock = () => {
  const [downloading, setDownloading] = useState(false);
  const [showSocials, setShowSocials] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestCategory, setSuggestCategory] = useState("Product");
  const [suggestionText, setSuggestionText] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [suggestSubmitted, setSuggestSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Resume Download Handler
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await triggerResumeDownload("Srikanth_Yepalagunta_Resume.pdf");
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  // 1-Click Jump Helper
  const scrollTo = (id, extraAction) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (extraAction) extraAction();
    }
  };

  // Submit suggestion to backend
  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    setSubmitting(true);

    try {
      await fetch(contactConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Portfolio Visitor (Suggestion)",
          email: senderEmail || "visitor-suggestion@portfolio.local",
          subject: `[${suggestCategory} Suggestion] Portfolio Feedback`,
          message: suggestionText,
        }),
      });
      setSuggestSubmitted(true);
      setTimeout(() => {
        setSuggestSubmitted(false);
        setShowSuggestModal(false);
        setSuggestionText("");
      }, 2000);
    } catch (err) {
      console.warn("Suggestion logged with fallback:", err);
      setSuggestSubmitted(true);
      setTimeout(() => {
        setSuggestSubmitted(false);
        setShowSuggestModal(false);
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <aside className="right-action-dock" aria-label="Action Hub">
        <div className="right-glass-rail">
          {/* 1. Hire Me */}
          <button
            className="action-btn hire-btn"
            onClick={() => scrollTo("contact")}
            title="Hire Me / Consultation"
            aria-label="Hire Me"
          >
            <FiSend className="action-icon" />
            <span className="action-tooltip">Hire Me</span>
          </button>

          {/* 2. Products */}
          <button
            className="action-btn"
            onClick={() => scrollTo("products")}
            title="Go Seeker & Products"
            aria-label="Products"
          >
            <FiPackage className="action-icon" />
            <span className="action-tooltip">Products</span>
          </button>

          {/* 3. Contact Me */}
          <button
            className="action-btn"
            onClick={() => scrollTo("contact")}
            title="Contact Me"
            aria-label="Contact Me"
          >
            <FiMail className="action-icon" />
            <span className="action-tooltip">Contact Me</span>
          </button>

          {/* 4. Download Resume */}
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

          {/* 5. Report an Issue */}
          <button
            className="action-btn"
            onClick={() => {
              window.location.hash = "#report-ticket";
              scrollTo("contact");
            }}
            title="Report an Issue Ticket"
            aria-label="Report an Issue"
          >
            <FiAlertCircle className="action-icon text-warning" />
            <span className="action-tooltip">Report Issue</span>
          </button>

          {/* 6. Suggestion for Product / Portfolio */}
          <button
            className="action-btn"
            onClick={() => setShowSuggestModal(true)}
            title="Suggest for Products or Portfolio"
            aria-label="Suggestion"
          >
            <FiHelpCircle className="action-icon" />
            <span className="action-tooltip">Suggestions</span>
          </button>

          {/* 7. GitHub Details */}
          <a
            href={socialprofils.github || "https://github.com/Srikanthy12866"}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            title="GitHub Repositories & Activity"
            aria-label="GitHub Details"
          >
            <FiGithub className="action-icon" />
            <span className="action-tooltip">GitHub Profile</span>
          </a>

          {/* 8. Social Hub Toggle */}
          <div className="social-hub-wrapper">
            <button
              className={`action-btn ${showSocials ? "active" : ""}`}
              onClick={() => setShowSocials(!showSocials)}
              title="Social Media Profiles"
              aria-label="Social Media"
            >
              <FiShare2 className="action-icon" />
              <span className="action-tooltip">Socials</span>
            </button>

            {/* Social Flyout */}
            {showSocials && (
              <div className="social-flyout">
                <a
                  href={socialprofils.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-sub-btn"
                  title="LinkedIn"
                >
                  <FiLinkedin />
                </a>
                <a
                  href={socialprofils.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-sub-btn"
                  title="GitHub"
                >
                  <FiGithub />
                </a>
                <a
                  href={socialprofils.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-sub-btn"
                  title="Instagram"
                >
                  <FiInstagram />
                </a>
                <a
                  href={socialprofils.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-sub-btn"
                  title="Facebook"
                >
                  <FiFacebook />
                </a>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Suggestion Modal */}
      <Modal
        show={showSuggestModal}
        onHide={() => setShowSuggestModal(false)}
        centered
        className="suggestion-modal"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="d-flex align-items-center gap-2">
            <FiHelpCircle className="text-primary" />
            <span>Product &amp; Portfolio Suggestions</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {suggestSubmitted ? (
            <Alert variant="success" className="d-flex align-items-center gap-2">
              <FiCheck className="fs-4" />
              <div>
                <strong>Thank you!</strong> Your suggestion has been forwarded directly to Srikanth.
              </div>
            </Alert>
          ) : (
            <Form onSubmit={handleSuggestionSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Suggestion Category</Form.Label>
                <div className="d-flex gap-2">
                  {["Product (Go Seeker)", "Portfolio Website", "New Feature"].map((cat) => (
                    <Button
                      key={cat}
                      variant={suggestCategory === cat ? "primary" : "outline-secondary"}
                      size="sm"
                      onClick={() => setSuggestCategory(cat)}
                      type="button"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Email (Optional, for follow-up)</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@domain.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Your Feedback or Idea</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  placeholder="Share ideas for Go Seeker hardware telemetry, warehouse management features, or UI improvements..."
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowSuggestModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Submit Suggestion"}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
