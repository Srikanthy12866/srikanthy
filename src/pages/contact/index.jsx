import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, contactConfig } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FiMail, FiMessageSquare, FiAlertCircle, FiCheckCircle, FiSend, FiLifeBuoy, FiActivity, FiArrowLeft } from "react-icons/fi";
import { pingMicroservices } from "../../utils/healthCheck";

export const ContactUs = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("contact"); // "contact" or "ticket"

  // Contact Form State (Goal 3)
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Ticket Form State (Goal 7)
  const [ticketData, setTicketData] = useState({
    appSource: "Go-Seek",
    title: "",
    description: "",
    userName: "",
    userEmail: "",
    priority: "MEDIUM",
  });

  const [loading, setLoading] = useState(false);
  const [cloudStatus, setCloudStatus] = useState({
    backend: "checking", // "checking", "online", "waking"
    auth: "checking",
  });
  const [alert, setAlert] = useState({
    show: false,
    variant: "success",
    message: "",
    ticketCode: null,
  });

  // Call health check APIs to both microservices upon navigating to contact page,
  // then repeat every 10 minutes while the user stays on the page (Render sleeps after 15 min idle)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (window.location.hash === "#report-ticket" || searchParams.get("tab") === "ticket") {
      setActiveTab("ticket");
    }
    if (searchParams.get("type") === "hire") {
      setActiveTab("contact");
      setContactData((prev) => ({
        ...prev,
        subject: prev.subject || "Consulting & Engineering Opportunity",
      }));
    }

    const runHealthCheck = () =>
      pingMicroservices().then((results) => {
        if (Array.isArray(results)) {
          const backendRes = results.find((r) => r && r.name === "go-seek-backend");
          const authRes = results.find((r) => r && r.name === "auth-service");
          setCloudStatus({
            backend: backendRes && backendRes.ok ? "online" : "waking",
            auth: authRes && authRes.ok ? "online" : "waking",
          });
        }
      });

    runHealthCheck();
    const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
    const intervalId = setInterval(runHealthCheck, KEEP_ALIVE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  const handleContactChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  // Submit Contact Message to Backend Microservice (Goal 3)
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, variant: "success", message: "", ticketCode: null });

    try {
      const response = await fetch(contactConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit contact message.");
      }

      setAlert({
        show: true,
        variant: "success",
        message: "Thank you! Your message has been sent directly to Srikanth via our backend service.",
        ticketCode: null,
      });

      setContactData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setAlert({
        show: true,
        variant: "danger",
        message: err.message || "Could not reach backend service. Please check server status.",
        ticketCode: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit Issue Ticket to Backend Microservice (Goal 7)
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, variant: "success", message: "", ticketCode: null });

    try {
      const response = await fetch(contactConfig.ticketEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create issue ticket.");
      }

      setAlert({
        show: true,
        variant: "success",
        message: `Issue ticket logged successfully in app_db! Notification sent to ${contactConfig.YOUR_EMAIL}.`,
        ticketCode: data.ticketCode,
      });

      setTicketData({
        appSource: "Go-Seek",
        title: "",
        description: "",
        userName: "",
        userEmail: "",
        priority: "MEDIUM",
      });
    } catch (err) {
      setAlert({
        show: true,
        variant: "danger",
        message: err.message || "Failed to submit ticket to backend service.",
        ticketCode: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Container className="contact-page-container pb-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact &amp; Support</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* Back Link */}
        <div className="mb-3 pt-4">
          <Link to="/" className="back-to-home-link d-inline-flex align-items-center text-decoration-none">
            <FiArrowLeft className="me-2" />
            <span>Back to Portfolio Overview</span>
          </Link>
        </div>

        <Row className="mb-4 mt-2">
          <Col lg="10">
            <h1 className="display-4 mb-2">{t("contact_me")} &amp; Support</h1>
            <p className="text-muted contact-header-sub">
              Reach out for engineering inquiries, architecture consultations, or submit a technical issue ticket for Go-Seek or this portfolio.
            </p>
            <hr className="t_border my-4 ml-0 text-left" />
            <div className="d-flex align-items-center gap-3 microservice-status-bar mb-3">
              <span className="small text-muted d-flex align-items-center">
                <FiActivity className="me-1 text-primary" /> Cloud Microservices:
              </span>
              <span className={`badge ${cloudStatus.backend === "online" ? "bg-success" : "bg-warning text-dark"} d-inline-flex align-items-center`}>
                <span className="status-dot me-1">●</span>
                Backend: {cloudStatus.backend === "online" ? "Online" : "Waking up..."}
              </span>
              <span className={`badge ${cloudStatus.auth === "online" ? "bg-success" : "bg-warning text-dark"} d-inline-flex align-items-center`}>
                <span className="status-dot me-1">●</span>
                Auth: {cloudStatus.auth === "online" ? "Online" : "Waking up..."}
              </span>
            </div>
          </Col>
        </Row>

        {/* Form Selector Tabs (Contact vs Ticketing System) */}
        <div className="contact-mode-tabs mb-4">
          <button
            type="button"
            className={`contact-mode-btn ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => { setActiveTab("contact"); setAlert({ show: false }); }}
          >
            <FiMessageSquare className="me-2" />
            <span>Direct Message</span>
          </button>
          <button
            type="button"
            className={`contact-mode-btn ${activeTab === "ticket" ? "active" : ""}`}
            onClick={() => { setActiveTab("ticket"); setAlert({ show: false }); }}
          >
            <FiLifeBuoy className="me-2" />
            <span>Submit Issue Ticket</span>
            <span className="badge-new ms-2">Ticketing System</span>
          </button>
        </div>

        {alert.show && (
          <Alert
            variant={alert.variant}
            className="rounded-3 mb-4 shadow-sm"
            onClose={() => setAlert({ show: false })}
            dismissible
          >
            <div className="d-flex align-items-center gap-2">
              {alert.variant === "success" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
              <div>
                <strong>{alert.message}</strong>
                {alert.ticketCode && (
                  <div className="mt-1">
                    Your Ticket ID: <span className="badge bg-primary fs-6">{alert.ticketCode}</span>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        <Row className="sec_sp">
          <Col lg="5" className="mb-5">
            <div className="contact-info-card p-4 rounded-3">
              <h3 className="color_sec mb-3">
                {activeTab === "contact" ? t("get_in_touch") : "Issue Support Desk"}
              </h3>
              <p className="contact-desc">{contactConfig.description}</p>

              <div className="contact-details mt-4">
                <div className="contact-item d-flex align-items-center mb-3">
                  <FiMail className="contact-icon me-3" />
                  <div>
                    <span className="contact-label d-block text-muted small">Direct Developer Email</span>
                    <a href={`mailto:${contactConfig.YOUR_EMAIL}`} className="contact-val">
                      {contactConfig.YOUR_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="contact-backend-pill p-3 mt-4 rounded-3">
                  <div className="small font-monospace text-success mb-1">● BACKEND MICROSERVICE ACTIVE</div>
                  <div className="small text-muted">
                    No third-party failure points. Inquiries and tickets are stored securely in <strong>app_db</strong> and emailed directly via Spring Boot JavaMail.
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col lg="7">
            {activeTab === "contact" ? (
              /* TAB 1: Direct Contact Form (Goal 3) */
              <div className="contact-form-wrap p-4 rounded-3">
                <h4 className="mb-3">Send a Direct Message</h4>
                <form onSubmit={handleContactSubmit} className="contact__form">
                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Your Name *</label>
                      <input
                        className="form-control rounded-2"
                        name="name"
                        placeholder={t("name")}
                        value={contactData.name}
                        type="text"
                        required
                        onChange={handleContactChange}
                      />
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Your Email *</label>
                      <input
                        className="form-control rounded-2"
                        name="email"
                        placeholder={t("email")}
                        type="email"
                        value={contactData.email}
                        required
                        onChange={handleContactChange}
                      />
                    </Col>
                  </Row>

                  <div className="form-group mb-3">
                    <label className="form-label small text-muted">Subject</label>
                    <input
                      className="form-control rounded-2"
                      name="subject"
                      placeholder="e.g. Microservice Consulting / Collaboration"
                      type="text"
                      value={contactData.subject}
                      onChange={handleContactChange}
                    />
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label small text-muted">Message *</label>
                    <textarea
                      className="form-control rounded-2"
                      name="message"
                      placeholder={t("message")}
                      rows="5"
                      value={contactData.message}
                      onChange={handleContactChange}
                      required
                    ></textarea>
                  </div>

                  <button className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2" type="submit" disabled={loading}>
                    <FiSend />
                    <span>{loading ? t("sending") : t("send")}</span>
                  </button>
                </form>
              </div>
            ) : (
              /* TAB 2: Support Ticketing System (Goal 7) */
              <div className="ticket-form-wrap p-4 rounded-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="mb-0">Report Application Issue</h4>
                  <span className="badge bg-warning text-dark">Tickets DB: app_db</span>
                </div>
                <p className="text-muted small mb-4">
                  Report any issues or bugs found in either <strong>Go-Seek</strong> or this <strong>Portfolio</strong>. This will log a ticket and send an immediate notification to Srikanth.
                </p>

                <form onSubmit={handleTicketSubmit} className="contact__form">
                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Application Source *</label>
                      <select
                        className="form-control rounded-2"
                        name="appSource"
                        value={ticketData.appSource}
                        onChange={handleTicketChange}
                        required
                      >
                        <option value="Go-Seek">Go-Seek Application</option>
                        <option value="Portfolio">Portfolio Website (srikanthy)</option>
                      </select>
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Priority / Severity *</label>
                      <select
                        className="form-control rounded-2"
                        name="priority"
                        value={ticketData.priority}
                        onChange={handleTicketChange}
                        required
                      >
                        <option value="LOW">Low - Visual / Minor glitch</option>
                        <option value="MEDIUM">Medium - Functional bug</option>
                        <option value="HIGH">High - Broken feature</option>
                        <option value="CRITICAL">Critical - Crash / Blocker</option>
                      </select>
                    </Col>
                  </Row>

                  <div className="form-group mb-3">
                    <label className="form-label small text-muted">Issue Title / Summary *</label>
                    <input
                      className="form-control rounded-2"
                      name="title"
                      placeholder="e.g. Modal layout broken on mobile viewport"
                      type="text"
                      value={ticketData.title}
                      required
                      onChange={handleTicketChange}
                    />
                  </div>

                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Your Name</label>
                      <input
                        className="form-control rounded-2"
                        name="userName"
                        placeholder="Name"
                        type="text"
                        value={ticketData.userName}
                        onChange={handleTicketChange}
                      />
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Your Email (for ticket updates) *</label>
                      <input
                        className="form-control rounded-2"
                        name="userEmail"
                        placeholder="email@example.com"
                        type="email"
                        value={ticketData.userEmail}
                        required
                        onChange={handleTicketChange}
                      />
                    </Col>
                  </Row>

                  <div className="form-group mb-4">
                    <label className="form-label small text-muted">Issue Details &amp; Steps to Reproduce *</label>
                    <textarea
                      className="form-control rounded-2"
                      name="description"
                      placeholder="Describe what occurred, your device or browser, and expected behavior..."
                      rows="4"
                      value={ticketData.description}
                      onChange={handleTicketChange}
                      required
                    ></textarea>
                  </div>

                  <button className="btn btn-warning px-4 py-2 d-inline-flex align-items-center gap-2 fw-semibold" type="submit" disabled={loading}>
                    <FiLifeBuoy />
                    <span>{loading ? "Submitting Ticket…" : "Submit Issue Ticket"}</span>
                  </button>
                </form>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <div className={loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};

export default ContactUs;
