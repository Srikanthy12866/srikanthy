import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, contactConfig } from "../../content_option";
import { Container, Row, Col, Alert, Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FiMail,
  FiMessageSquare,
  FiAlertCircle,
  FiCheckCircle,
  FiSend,
  FiLifeBuoy,
  FiBriefcase,
  FiList,
  FiArrowLeft,
  FiLock,
  FiUnlock,
  FiRefreshCw,
  FiTag,
  FiUser,
  FiClock,
} from "react-icons/fi";

export const ContactUs = () => {
  const { t } = useTranslation();
  // Tabs: "contact" | "collab" | "ticket" | "registry"
  const [activeTab, setActiveTab] = useState("contact");

  // Direct Contact State
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Commercial Collaboration State
  const [collabData, setCollabData] = useState({
    name: "",
    email: "",
    organization: "",
    collabType: "Enterprise Architecture Consulting",
    timeline: "1-3 Months",
    budgetScope: "Flexible / To Discuss",
    proposal: "",
  });

  // Ticket Form State
  const [ticketData, setTicketData] = useState({
    appSource: "Go-Seek",
    title: "",
    description: "",
    userName: "",
    userEmail: "",
    priority: "MEDIUM",
  });

  // Ticket Registry / Status Management State
  const [searchEmail, setSearchEmail] = useState("srikanthy12866@gmail.com");
  const [ticketsList, setTicketsList] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);
  const [ticketStatusDrafts, setTicketStatusDrafts] = useState({});

  // Auth State for Status Modification
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("admin_auth_token") || "");
  const [authEmail, setAuthEmail] = useState(() => sessionStorage.getItem("admin_auth_email") || "");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCreds, setLoginCreds] = useState({ email: "srikanthy12866@gmail.com", password: "", secretKey: "" });
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    variant: "success",
    message: "",
    ticketCode: null,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get("tab");
    if (window.location.hash === "#report-ticket" || tabParam === "ticket") {
      setActiveTab("ticket");
    } else if (tabParam === "collab" || searchParams.get("type") === "hire") {
      setActiveTab("collab");
    } else if (tabParam === "registry" || tabParam === "tickets") {
      setActiveTab("registry");
    }
  }, []);

  // Fetch tickets whenever registry tab is active or auth token changes
  useEffect(() => {
    if (activeTab === "registry") {
      fetchTickets();
    }
  }, [activeTab, authToken]);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      let url = `${contactConfig.backendBaseUrl}/api/tickets`;
      const headers = { "Content-Type": "application/json" };

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      } else if (searchEmail.trim()) {
        url = `${contactConfig.backendBaseUrl}/api/tickets/my?email=${encodeURIComponent(searchEmail.trim())}`;
      }

      const res = await fetch(url, { headers });
      if (!res.ok) {
        if (!authToken && searchEmail.trim()) {
          // Fallback to public tracking if endpoint returned error
          setTicketsList([]);
          return;
        }
        throw new Error("Unable to retrieve tickets.");
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTicketsList(list);

      // Initialize drafts
      const initialDrafts = {};
      list.forEach((t) => {
        initialDrafts[t.id] = t.status || "OPEN";
      });
      setTicketStatusDrafts(initialDrafts);
    } catch (err) {
      setAlert({
        show: true,
        variant: "warning",
        message: "Could not load tickets: " + (err.message || "Network issue"),
        ticketCode: null,
      });
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleStatusChange = async (ticketId) => {
    if (!authToken) {
      setShowLoginModal(true);
      return;
    }

    const newStatus = ticketStatusDrafts[ticketId];
    if (!newStatus) return;

    setUpdatingTicketId(ticketId);
    try {
      const res = await fetch(`${contactConfig.backendBaseUrl}/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.message || updated.error || "Failed to update ticket status");
      }

      setTicketsList((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status: updated.status } : t)));

      setAlert({
        show: true,
        variant: "success",
        message: `Ticket ${updated.ticketCode || ticketId} status successfully updated to ${updated.status}.`,
        ticketCode: null,
      });
    } catch (err) {
      setAlert({
        show: true,
        variant: "danger",
        message: "Error updating status: " + err.message,
        ticketCode: null,
      });
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Option 1: Master Secret Key
    if (loginCreds.secretKey.trim()) {
      const key = loginCreds.secretKey.trim();
      setAuthToken(key);
      setAuthEmail("srikanthy12866@gmail.com");
      sessionStorage.setItem("admin_auth_token", key);
      sessionStorage.setItem("admin_auth_email", "srikanthy12866@gmail.com");
      setShowLoginModal(false);
      setAlert({
        show: true,
        variant: "success",
        message: "Authenticated successfully with Master Admin Key. You can now update ticket statuses.",
        ticketCode: null,
      });
      return;
    }

    // Option 2: Account Login via auth-service
    if (!loginCreds.email.trim() || !loginCreds.password) {
      setLoginError("Please provide your email & password, or enter the Master Admin Key.");
      return;
    }

    try {
      const res = await fetch(contactConfig.authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginCreds.email.trim(), password: loginCreds.password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || "Login failed. Invalid credentials.");
      }

      const token = data.token || data.accessToken;
      setAuthToken(token);
      setAuthEmail(data.email || loginCreds.email);
      sessionStorage.setItem("admin_auth_token", token);
      sessionStorage.setItem("admin_auth_email", data.email || loginCreds.email);
      setShowLoginModal(false);
      setAlert({
        show: true,
        variant: "success",
        message: `Signed in as ${data.email || loginCreds.email}. Administrative controls unlocked.`,
        ticketCode: null,
      });
    } catch (err) {
      setLoginError(err.message || "Failed to authenticate.");
    }
  };

  const handleLogout = () => {
    setAuthToken("");
    setAuthEmail("");
    sessionStorage.removeItem("admin_auth_token");
    sessionStorage.removeItem("admin_auth_email");
    setAlert({
      show: true,
      variant: "info",
      message: "Signed out of backend administration session.",
      ticketCode: null,
    });
  };

  // Submit Direct Contact Form
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
        message: "Thank you! Your direct message has been delivered to Srikanth.",
        ticketCode: null,
      });
      setContactData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setAlert({
        show: true,
        variant: "danger",
        message: err.message || "Could not reach backend service.",
        ticketCode: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit Commercial Collaboration Form
  const handleCollabSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, variant: "success", message: "", ticketCode: null });

    const formattedMessage = `
==================================================
COMMERCIAL COLLABORATION PROPOSAL
==================================================
Organization / Entity: ${collabData.organization || "Independent Entity"}
Collaborator Name:     ${collabData.name}
Work Email:            ${collabData.email}
Collaboration Domain:  ${collabData.collabType}
Expected Timeline:     ${collabData.timeline}
Budget / Scope Model:  ${collabData.budgetScope}

Detailed Proposal & Vision:
--------------------------------------------------
${collabData.proposal}
==================================================
    `.trim();

    const payload = {
      name: `${collabData.name} (${collabData.organization || "Commercial Partner"})`,
      email: collabData.email.trim(),
      subject: `[Commercial Collaboration] ${collabData.collabType} - ${collabData.organization || collabData.name}`,
      message: formattedMessage,
    };

    try {
      const response = await fetch(contactConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit collaboration proposal.");
      }

      setAlert({
        show: true,
        variant: "success",
        message: `Collaboration proposal submitted successfully! A direct notification has been dispatched to ${contactConfig.YOUR_EMAIL}.`,
        ticketCode: null,
      });

      setCollabData({
        name: "",
        email: "",
        organization: "",
        collabType: "Enterprise Architecture Consulting",
        timeline: "1-3 Months",
        budgetScope: "Flexible / To Discuss",
        proposal: "",
      });
    } catch (err) {
      setAlert({
        show: true,
        variant: "danger",
        message: err.message || "Failed to submit proposal to backend.",
        ticketCode: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit Issue Ticket
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
        message: `Issue ticket logged successfully! You can track it under the 'Ticket Registry' tab.`,
        ticketCode: data.ticketCode,
      });

      setSearchEmail(ticketData.userEmail);
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

  const getPriorityBadgeClass = (p) => {
    switch (p?.toUpperCase()) {
      case "CRITICAL":
        return "bg-danger";
      case "HIGH":
        return "bg-warning text-dark";
      case "MEDIUM":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s?.toUpperCase()) {
      case "RESOLVED":
        return "bg-success";
      case "IN_PROGRESS":
        return "bg-info text-dark";
      case "CLOSED":
        return "bg-dark";
      default:
        return "bg-warning text-dark";
    }
  };

  return (
    <HelmetProvider>
      <Container className="contact-page-container pb-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Commercial Collaboration &amp; Support</title>
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
            <h1 className="display-4 mb-2">{t("contact_me")} &amp; Commercial Desk</h1>
            <p className="text-muted contact-header-sub">
              Partner on high-performance enterprise systems, submit a commercial collaboration proposal, or manage issue tickets.
            </p>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* 4 Navigation Tabs */}
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
            className={`contact-mode-btn ${activeTab === "collab" ? "active" : ""}`}
            onClick={() => { setActiveTab("collab"); setAlert({ show: false }); }}
          >
            <FiBriefcase className="me-2" />
            <span>Commercial Collaboration</span>
            <span className="badge-new ms-2">Commercial</span>
          </button>

          <button
            type="button"
            className={`contact-mode-btn ${activeTab === "ticket" ? "active" : ""}`}
            onClick={() => { setActiveTab("ticket"); setAlert({ show: false }); }}
          >
            <FiLifeBuoy className="me-2" />
            <span>Submit Ticket</span>
          </button>

          <button
            type="button"
            className={`contact-mode-btn ${activeTab === "registry" ? "active" : ""}`}
            onClick={() => { setActiveTab("registry"); setAlert({ show: false }); }}
          >
            <FiList className="me-2" />
            <span>My Tickets &amp; Status</span>
            {authToken && <span className="badge bg-success ms-2">Admin</span>}
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
                    Your Ticket Tracking Reference: <span className="badge bg-primary fs-6">{alert.ticketCode}</span>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        <Row className="sec_sp">
          {/* Left Info Panel */}
          <Col lg="4" className="mb-4">
            <div className="contact-info-card p-4 rounded-3 h-100">
              <h3 className="color_sec mb-3">
                {activeTab === "collab"
                  ? "Enterprise Partnerships"
                  : activeTab === "registry"
                  ? "Ticket Management"
                  : activeTab === "ticket"
                  ? "Support Desk"
                  : t("get_in_touch")}
              </h3>
              <p className="contact-desc">
                {activeTab === "collab"
                  ? "Open for commercial software licensing, enterprise hardware telemetry driver integrations, and dedicated full-stack architecture contracts."
                  : activeTab === "registry"
                  ? "View tickets highlighted by your email address or authenticate as Administrator to review and update lifecycle statuses in real-time."
                  : contactConfig.description}
              </p>

              <div className="contact-details mt-4">
                <div className="contact-item d-flex align-items-center mb-3">
                  <FiMail className="contact-icon me-3 text-primary" />
                  <div>
                    <span className="contact-label d-block text-muted small">Direct Developer Email</span>
                    <a href={`mailto:${contactConfig.YOUR_EMAIL}`} className="contact-val">
                      {contactConfig.YOUR_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="contact-backend-pill p-3 mt-4 rounded-3">
                  <div className="small font-monospace text-success mb-1">● ENTERPRISE SERVICE SYNC</div>
                  <div className="small text-muted">
                    Inquiries, proposals, and tickets are delivered directly into secure cloud datastores with automated notification dispatch.
                  </div>
                </div>

                {/* Authentication Status Pill */}
                <div className="admin-status-pill p-3 mt-3 rounded-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="small text-muted d-flex align-items-center gap-1">
                      {authToken ? <FiUnlock className="text-success" /> : <FiLock className="text-muted" />}
                      Session:
                    </span>
                    {authToken ? (
                      <span className="badge bg-success">Authenticated Admin</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                  {authToken && (
                    <div className="mt-2 d-flex align-items-center justify-content-between">
                      <span className="small text-truncate" style={{ maxWidth: "160px" }}>
                        {authEmail || "Admin Session"}
                      </span>
                      <button className="btn btn-sm btn-link text-danger p-0 text-decoration-none" onClick={handleLogout}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          {/* Right Action Panel */}
          <Col lg="8">
            {/* ========================================================
                TAB 1: DIRECT CONTACT FORM
            ======================================================== */}
            {activeTab === "contact" && (
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
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
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
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      />
                    </Col>
                  </Row>

                  <div className="form-group mb-3">
                    <label className="form-label small text-muted">Subject</label>
                    <input
                      className="form-control rounded-2"
                      name="subject"
                      placeholder="e.g. Microservice Architecture Discussion"
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
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
                      onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2" type="submit" disabled={loading}>
                    <FiSend />
                    <span>{loading ? t("sending") : t("send")}</span>
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================
                TAB 2: COMMERCIAL COLLABORATION FORM
            ======================================================== */}
            {activeTab === "collab" && (
              <div className="collab-form-wrap p-4 rounded-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="mb-0">Commercial Collaboration Proposal</h4>
                  <span className="badge bg-primary">Partnership Portal</span>
                </div>
                <p className="text-muted small mb-4">
                  Submit enterprise collaboration proposals, software integration inquiries, or commercial contracts directly for evaluation.
                </p>

                <form onSubmit={handleCollabSubmit} className="contact__form">
                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Organization / Entity Name *</label>
                      <input
                        className="form-control rounded-2"
                        placeholder="Company, Startup, or Lab"
                        value={collabData.organization}
                        type="text"
                        required
                        onChange={(e) => setCollabData({ ...collabData, organization: e.target.value })}
                      />
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Collaborator Name *</label>
                      <input
                        className="form-control rounded-2"
                        placeholder="Lead / Representative Name"
                        value={collabData.name}
                        type="text"
                        required
                        onChange={(e) => setCollabData({ ...collabData, name: e.target.value })}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Corporate / Work Email *</label>
                      <input
                        className="form-control rounded-2"
                        placeholder="representative@organization.com"
                        type="email"
                        value={collabData.email}
                        required
                        onChange={(e) => setCollabData({ ...collabData, email: e.target.value })}
                      />
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Collaboration Model *</label>
                      <select
                        className="form-control rounded-2"
                        value={collabData.collabType}
                        onChange={(e) => setCollabData({ ...collabData, collabType: e.target.value })}
                      >
                        <option value="Enterprise Architecture Consulting">Enterprise Architecture Consulting</option>
                        <option value="Commercial Licensing / Partnership">Commercial Software Licensing / Partnership</option>
                        <option value="Custom Hardware Telemetry Development">Custom Hardware Telemetry Driver Development</option>
                        <option value="System Integration & Cloud Migration">System Integration &amp; Cloud Migration</option>
                        <option value="Open-Source Advisory & Sponsorship">Open-Source Advisory &amp; Sponsorship</option>
                      </select>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Projected Timeline</label>
                      <select
                        className="form-control rounded-2"
                        value={collabData.timeline}
                        onChange={(e) => setCollabData({ ...collabData, timeline: e.target.value })}
                      >
                        <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                        <option value="1-3 Months">1-3 Months</option>
                        <option value="3-6 Months">3-6 Months</option>
                        <option value="Long-term Strategic (> 6 Months)">Long-term Strategic (&gt; 6 Months)</option>
                        <option value="Flexible Roadmap">Flexible Roadmap</option>
                      </select>
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Budget / Scope Scope</label>
                      <select
                        className="form-control rounded-2"
                        value={collabData.budgetScope}
                        onChange={(e) => setCollabData({ ...collabData, budgetScope: e.target.value })}
                      >
                        <option value="Tier 1: < $5,000 (Advisory / Small Project)">Tier 1: &lt; $5,000 (Advisory / Small)</option>
                        <option value="Tier 2: $5,000 - $20,000 (Core Module)">Tier 2: $5,000 - $20,000 (Core Module)</option>
                        <option value="Tier 3: $20,000+ (Full Enterprise Solution)">Tier 3: $20,000+ (Full Enterprise Solution)</option>
                        <option value="Equity / Revenue-Share Model">Equity / Revenue-Share Model</option>
                        <option value="Flexible / To Discuss">Flexible / To Discuss</option>
                      </select>
                    </Col>
                  </Row>

                  <div className="form-group mb-4">
                    <label className="form-label small text-muted">Proposal Scope, Objectives &amp; Technical Requirements *</label>
                    <textarea
                      className="form-control rounded-2"
                      placeholder="Outline the collaboration goals, architecture requirements, technology stack, and desired outcomes..."
                      rows="5"
                      value={collabData.proposal}
                      onChange={(e) => setCollabData({ ...collabData, proposal: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <button className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2" type="submit" disabled={loading}>
                    <FiBriefcase />
                    <span>{loading ? "Submitting Proposal…" : "Submit Collaboration Proposal"}</span>
                  </button>
                </form>
              </div>
            )}

            {/* ========================================================
                TAB 3: ISSUE TICKET SUBMISSION
            ======================================================== */}
            {activeTab === "ticket" && (
              <div className="ticket-form-wrap p-4 rounded-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="mb-0">Report Application Defect</h4>
                  <span className="badge bg-warning text-dark">Automated Support Dispatch</span>
                </div>
                <p className="text-muted small mb-4">
                  Log a defect or technical issue found in <strong>Go-Seek</strong> or this <strong>Portfolio</strong>.
                </p>

                <form onSubmit={handleTicketSubmit} className="contact__form">
                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Application Source *</label>
                      <select
                        className="form-control rounded-2"
                        value={ticketData.appSource}
                        onChange={(e) => setTicketData({ ...ticketData, appSource: e.target.value })}
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
                        value={ticketData.priority}
                        onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
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
                      placeholder="e.g. High CPU utilization reporting mismatch"
                      type="text"
                      value={ticketData.title}
                      required
                      onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
                    />
                  </div>

                  <Row>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Your Name</label>
                      <input
                        className="form-control rounded-2"
                        placeholder="Reporter Name"
                        type="text"
                        value={ticketData.userName}
                        onChange={(e) => setTicketData({ ...ticketData, userName: e.target.value })}
                      />
                    </Col>
                    <Col md="6" className="form-group mb-3">
                      <label className="form-label small text-muted">Reporter Email *</label>
                      <input
                        className="form-control rounded-2"
                        placeholder="email@example.com"
                        type="email"
                        value={ticketData.userEmail}
                        required
                        onChange={(e) => setTicketData({ ...ticketData, userEmail: e.target.value })}
                      />
                    </Col>
                  </Row>

                  <div className="form-group mb-4">
                    <label className="form-label small text-muted">Issue Details &amp; Steps to Reproduce *</label>
                    <textarea
                      className="form-control rounded-2"
                      placeholder="Describe what occurred, your device or OS, and expected behavior..."
                      rows="4"
                      value={ticketData.description}
                      onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
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

            {/* ========================================================
                TAB 4: TICKET REGISTRY & STATUS MANAGEMENT
            ======================================================== */}
            {activeTab === "registry" && (
              <div className="registry-wrap p-4 rounded-3">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                  <div>
                    <h4 className="mb-1">Ticket Registry &amp; Lifecycle Status</h4>
                    <p className="text-muted small mb-0">
                      {authToken
                        ? `Logged in as Administrator (${authEmail}). You have permissions to update ticket status.`
                        : `Viewing tickets highlighted by: ${searchEmail || "all"}. Sign in to modify ticket status.`}
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <Button variant="outline-secondary" size="sm" onClick={fetchTickets} disabled={loadingTickets}>
                      <FiRefreshCw className={loadingTickets ? "spin-icon" : ""} /> Refresh
                    </Button>
                    {!authToken ? (
                      <Button variant="primary" size="sm" onClick={() => setShowLoginModal(true)}>
                        <FiLock className="me-1" /> Admin Sign In
                      </Button>
                    ) : (
                      <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                        <FiUnlock className="me-1" /> Sign Out
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email Filter Bar for Unauthenticated Users */}
                {!authToken && (
                  <div className="search-filter-box p-3 rounded-3 mb-4">
                    <div className="row g-2 align-items-center">
                      <div className="col-sm-8">
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          placeholder="Filter by reporter email (e.g. srikanthy12866@gmail.com)"
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                        />
                      </div>
                      <div className="col-sm-4">
                        <button className="btn btn-sm btn-outline-primary w-100" onClick={fetchTickets} disabled={loadingTickets}>
                          Filter My Tickets
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tickets List */}
                {loadingTickets ? (
                  <div className="text-center py-5 text-muted">
                    <FiRefreshCw className="spin-icon fs-3 mb-2" />
                    <div>Loading ticket records from cloud datastore…</div>
                  </div>
                ) : ticketsList.length === 0 ? (
                  <div className="text-center py-5 text-muted border rounded-3 p-4">
                    <FiTag className="fs-1 mb-2 text-secondary" />
                    <h5>No Tickets Found</h5>
                    <p className="small mb-0">
                      {authToken
                        ? "No tickets currently registered in the database."
                        : `No tickets found matching "${searchEmail}". Try logging in or submit a new ticket.`}
                    </p>
                  </div>
                ) : (
                  <div className="tickets-grid d-flex flex-column gap-3">
                    {ticketsList.map((ticket) => (
                      <div key={ticket.id} className="ticket-record-card p-3 rounded-3">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <span className="ticket-code-badge font-monospace">{ticket.ticketCode}</span>
                            <span className="badge bg-secondary">{ticket.appSource || "Go-Seek"}</span>
                            <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                              {ticket.priority || "MEDIUM"}
                            </span>
                          </div>
                          <span className={`badge ${getStatusBadgeClass(ticket.status)} fs-7 px-3 py-1`}>
                            ● {ticket.status || "OPEN"}
                          </span>
                        </div>

                        <h5 className="ticket-record-title mb-1">{ticket.title}</h5>
                        <p className="ticket-record-desc text-muted small mb-2">{ticket.description}</p>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top">
                          <div className="small text-muted d-flex align-items-center gap-3">
                            <span className="d-inline-flex align-items-center gap-1">
                              <FiUser size={13} /> {ticket.userName || "Reporter"} ({ticket.userEmail})
                            </span>
                            {ticket.createdAt && (
                              <span className="d-inline-flex align-items-center gap-1">
                                <FiClock size={13} /> {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Lifecycle Status Modification Option */}
                          {authToken ? (
                            <div className="status-updater-control d-flex align-items-center gap-2">
                              <label className="small text-muted mb-0 fw-semibold">Status:</label>
                              <select
                                className="form-select form-select-sm py-1 px-2 status-select"
                                value={ticketStatusDrafts[ticket.id] || ticket.status || "OPEN"}
                                onChange={(e) =>
                                  setTicketStatusDrafts({
                                    ...ticketStatusDrafts,
                                    [ticket.id]: e.target.value,
                                  })
                                }
                              >
                                <option value="OPEN">OPEN</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="RESOLVED">RESOLVED</option>
                                <option value="CLOSED">CLOSED</option>
                              </select>
                              <Button
                                size="sm"
                                variant="primary"
                                className="py-1 px-2"
                                disabled={
                                  updatingTicketId === ticket.id ||
                                  (ticketStatusDrafts[ticket.id] || ticket.status) === ticket.status
                                }
                                onClick={() => handleStatusChange(ticket.id)}
                              >
                                {updatingTicketId === ticket.id ? "Saving…" : "Update"}
                              </Button>
                            </div>
                          ) : (
                            <div className="small text-muted fst-italic">
                              Status: <strong>{ticket.status || "OPEN"}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>

        {/* Administrative Login Modal */}
        <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 d-flex align-items-center gap-2">
              <FiLock className="text-primary" /> Administrator Sign In
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-muted small mb-3">
              Authenticate to unlock real-time ticket status updates and full database lifecycle access.
            </p>

            {loginError && <Alert variant="danger" className="py-2 small">{loginError}</Alert>}

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label small text-muted">Admin Master Secret Key</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="Paste gs-internal-secret-token-..."
                  value={loginCreds.secretKey}
                  onChange={(e) => setLoginCreds({ ...loginCreds, secretKey: e.target.value })}
                />
                <div className="form-text small">Instant elevation using internal service key.</div>
              </div>

              <div className="text-center my-2 text-muted small fw-semibold">— OR USER LOGIN —</div>

              <div className="mb-3">
                <label className="form-label small text-muted">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  value={loginCreds.email}
                  onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">Password</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  placeholder="••••••••"
                  value={loginCreds.password}
                  onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" size="sm" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Sign In &amp; Unlock
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
      <div className={loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};

export default ContactUs;
