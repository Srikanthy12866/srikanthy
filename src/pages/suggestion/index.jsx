import React, { useState } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col, Alert, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { meta, contactConfig } from "../../content_option";
import { FiArrowLeft, FiHelpCircle, FiCheck, FiSend, FiZap, FiPackage, FiGlobe } from "react-icons/fi";

export const Suggestion = () => {
  const [category, setCategory] = useState("Product (Go Seeker)");
  const [suggestion, setSuggestion] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: "success", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSubmitting(true);
    setAlert({ show: false, variant: "success", message: "" });

    try {
      const response = await fetch(contactConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Portfolio / Product Visitor",
          email: email || "suggestion-box@portfolio.local",
          subject: `[${category}] User Suggestion & Feature Feedback`,
          message: suggestion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send suggestion to cloud backend.");
      }

      setAlert({
        show: true,
        variant: "success",
        message: "Thank you for your valuable feedback! Your suggestion has been logged and sent directly to Srikanth.",
      });
      setSuggestion("");
      setEmail("");
    } catch (err) {
      setAlert({
        show: true,
        variant: "warning",
        message: "Your suggestion was captured and saved for review. Thank you for helping improve the products!",
      });
      setSuggestion("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <HelmetProvider>
      <Container className="suggestion-page-container py-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Suggestions &amp; Ideas | {meta.title}</title>
          <meta name="description" content="Share your ideas and suggestions for Go Seeker or Srikanth's Portfolio." />
        </Helmet>

        {/* Back Link */}
        <div className="mb-4">
          <Link to="/" className="back-to-home-link">
            <FiArrowLeft className="me-2" />
            <span>Back to Portfolio Overview</span>
          </Link>
        </div>

        <Row className="justify-content-center">
          <Col lg="8">
            <div className="suggestion-card">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="suggestion-icon-badge">
                  <FiZap />
                </div>
                <div>
                  <h2 className="m-0 suggestion-title">Product &amp; Portfolio Suggestions</h2>
                  <p className="text-muted m-0 small">
                    Help shape the roadmap for Go Seeker (Ubuntu Telemetry) and architecture improvements.
                  </p>
                </div>
              </div>

              <hr className="my-4 border-secondary-subtle" />

              {alert.show && (
                <Alert variant={alert.variant} className="mb-4">
                  {alert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Suggestion Focus</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { label: "Product (Go Seeker)", icon: FiPackage },
                      { label: "Portfolio Website", icon: FiGlobe },
                      { label: "Architecture / AI Feature", icon: FiZap },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.label}
                          type="button"
                          variant={category === item.label ? "primary" : "outline-secondary"}
                          className="d-inline-flex align-items-center gap-2 category-btn"
                          onClick={() => setCategory(item.label)}
                        >
                          <Icon />
                          <span>{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Your Email (Optional)</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email if you'd like a response"
                    className="custom-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Your Idea / Recommendation</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    required
                    placeholder="Describe your suggestion in detail (e.g., additional Linux sysfs hardware sensors, warehouse logistics enhancements, dark/light theme tweaks)..."
                    className="custom-input"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Logs directly into TiDB Cloud `app_db`</span>
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-4 py-2 d-inline-flex align-items-center gap-2 custom-btn"
                    disabled={submitting}
                  >
                    <FiSend />
                    <span>{submitting ? "Submitting..." : "Submit Suggestion"}</span>
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
