import React, { useState, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import {
  introdata,
  meta,
  dataabout,
  worktimeline,
  skills,
  skillGroups,
  services,
  products,
  contactConfig,
} from "../../content_option";
import blackAndWhiteImage from "../../assets/images/black-and-white-image.png";
import { useTranslation } from "react-i18next";
import {
  FiCpu,
  FiLayers,
  FiTerminal,
  FiShield,
  FiArrowRight,
  FiDownload,
  FiBriefcase,
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiExternalLink,
  FiGithub,
  FiMail,
  FiMessageSquare,
  FiAlertCircle,
  FiSend,
  FiActivity,
  FiCode,
  FiDatabase,
  FiServer,
  FiBox,
} from "react-icons/fi";
import { SiUbuntu, SiLinux } from "react-icons/si";
import { triggerResumeDownload } from "../../utils/getResume";
import { SwarmIntro } from "../../components/SwarmIntro/SwarmIntro";
import { SideNav } from "../../components/SideNav/SideNav";
import { RightActionDock } from "../../components/RightActionDock/RightActionDock";
import { UbuntuDownloadCenter } from "../../components/UbuntuDownloadCenter/UbuntuDownloadCenter";
import { pingMicroservices } from "../../utils/healthCheck";
import { Container, Row, Col, Alert, Modal, Button } from "react-bootstrap";

export const Home = () => {
  const { t } = useTranslation();

  // Swarm Intro state (Runs on load)
  const [showIntro, setShowIntro] = useState(true);

  // Ubuntu Download Center Modal for Go Seeker
  const [showDownloadCenter, setShowDownloadCenter] = useState(false);

  // Skills filter state
  const [activeSkillCategory, setActiveSkillCategory] = useState("All");

  // Contact & Ticket Form State
  const [activeContactTab, setActiveContactTab] = useState("contact"); // "contact" | "ticket"
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [ticketData, setTicketData] = useState({
    appSource: "Go-Seek",
    title: "",
    description: "",
    userName: "",
    userEmail: "",
    priority: "MEDIUM",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formAlert, setFormAlert] = useState({
    show: false,
    variant: "success",
    message: "",
    ticketCode: null,
  });

  // Microservice Health State
  const [cloudStatus, setCloudStatus] = useState({
    backend: "checking",
    auth: "checking",
  });

  // Run health check on mount and repeat every 10 min
  useEffect(() => {
    const runHealthCheck = () => {
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
    };

    runHealthCheck();
    const interval = setInterval(runHealthCheck, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle URL hash changes
  useEffect(() => {
    if (window.location.hash === "#report-ticket") {
      setActiveContactTab("ticket");
    }
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormAlert({ show: false, variant: "success", message: "", ticketCode: null });

    try {
      const response = await fetch(contactConfig.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit message.");

      setFormAlert({
        show: true,
        variant: "success",
        message: "Thank you! Your message has been sent directly to Srikanth via our backend microservice.",
        ticketCode: null,
      });
      setContactData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setFormAlert({
        show: true,
        variant: "danger",
        message: err.message || "Could not reach backend service. Please check connection.",
        ticketCode: null,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormAlert({ show: false, variant: "success", message: "", ticketCode: null });

    try {
      const response = await fetch(contactConfig.ticketEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create issue ticket.");

      setFormAlert({
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
      setFormAlert({
        show: true,
        variant: "danger",
        message: err.message || "Failed to submit ticket to backend.",
        ticketCode: null,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const productGoSeek = products[0];

  return (
    <HelmetProvider>
      {/* 1. Futuristic 404 into Swarm of Agents Intro */}
      {showIntro && <SwarmIntro onComplete={() => setShowIntro(false)} />}

      {/* 2. Left Side-Center Floating Navigation Rail */}
      <SideNav />

      {/* 3. Right Side Floating Action Hub */}
      <RightActionDock />

      <main className="portfolio-master-canvas">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* ========================================================
            SECTION 1: HERO & DETAILS (#hero)
        ======================================================== */}
        <section id="hero" className="hero-section">
          <Container>
            <Row className="align-items-center min-vh-100 py-5">
              <Col lg="6" className="order-2 order-lg-1 hero-content-col">
                <div className="agentic-badge mb-3">
                  <FiCpu className="spin-slow text-primary me-2" />
                  <span>MULTI-AGENTIC SYSTEMS &amp; SPRING BOOT ARCHITECT</span>
                </div>

                <h1 className="hero-name">{introdata.title}</h1>

                <div className="typewriter-hero mb-3">
                  <Typewriter
                    options={{
                      strings: [
                        introdata.animated.first,
                        introdata.animated.second,
                        introdata.animated.third,
                        introdata.animated.fourth,
                        introdata.animated.fifth,
                      ],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 10,
                    }}
                  />
                </div>

                <p className="hero-description">{introdata.description}</p>

                {/* Highlights Metrics */}
                <div className="hero-metrics-grid mb-4">
                  {introdata.highlights.map((h, i) => (
                    <div key={i} className="metric-chip">
                      <span className="metric-label">{h.label}:</span>
                      <span className="metric-val">{h.val}</span>
                    </div>
                  ))}
                </div>

                {/* Quick CTA Actions */}
                <div className="hero-cta-group d-flex flex-wrap gap-3">
                  <button
                    className="btn btn-primary custom-btn"
                    onClick={() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span>Hire Me / Contact</span>
                    <FiArrowRight className="ms-2" />
                  </button>

                  <button
                    className="btn btn-outline-secondary custom-btn"
                    onClick={() => triggerResumeDownload("Srikanth_Yepalagunta_Resume.pdf")}
                  >
                    <FiDownload className="me-2" />
                    <span>Download Resume</span>
                  </button>

                  <button
                    className="btn btn-outline-info custom-btn"
                    onClick={() => {
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <SiUbuntu className="me-2" />
                    <span>Go Seeker</span>
                  </button>
                </div>
              </Col>

              {/* Srikanth's Image with Cyber Agentic Frame */}
              <Col lg="6" className="order-1 order-lg-2 text-center hero-image-col mb-4 mb-lg-0">
                <div className="agentic-photo-frame">
                  <div
                    className="hero-avatar"
                    style={{ backgroundImage: `url(${blackAndWhiteImage})` }}
                  >
                    {/* Corner Reticles */}
                    <div className="reticle top-left"></div>
                    <div className="reticle top-right"></div>
                    <div className="reticle bottom-left"></div>
                    <div className="reticle bottom-right"></div>
                  </div>

                  {/* Floating Agentic Telemetry Pill */}
                  <div className="floating-agent-pill">
                    <span className="live-ping-dot"></span>
                    <div>
                      <div className="pill-title">Multi-Agent Swarm Active</div>
                      <div className="pill-sub">Java 17 · Spring Boot 3 · Linux sysfs</div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================================
            SECTION 2: ABOUT ME & VALUES (#about)
        ======================================================== */}
        <section id="about" className="section-padding about-section">
          <Container>
            <div className="section-title-wrap">
              <span className="section-tag">
                <FiTerminal /> Engineering Profile
              </span>
              <h2 className="section-heading">About Me &amp; Core Philosophy</h2>
              <p className="section-subheading">
                Specializing in distributed backend microservices, resilient event pipelines, and autonomous multi-agent software.
              </p>
            </div>

            <Row className="g-4">
              <Col lg="7">
                <div className="content-card h-100">
                  <h4 className="card-title mb-3">Architectural Focus</h4>
                  <p className="card-text mb-4">{dataabout.aboutme}</p>

                  <div className="about-bullet-grid">
                    <div className="about-bullet">
                      <FiCheckCircle className="bullet-icon text-primary" />
                      <div>
                        <strong>Event-Driven Microservices:</strong> Spring Boot 3, Kafka event pipelines, and OpenFeign inter-service communication.
                      </div>
                    </div>
                    <div className="about-bullet">
                      <FiCheckCircle className="bullet-icon text-primary" />
                      <div>
                        <strong>Warehouse Management (WMS):</strong> Real-world logistics, wave-picking, inventory receiving, and dispatch architectures.
                      </div>
                    </div>
                    <div className="about-bullet">
                      <FiCheckCircle className="bullet-icon text-primary" />
                      <div>
                        <strong>Linux Kernel Telemetry:</strong> Native hardware extraction querying Linux `/sys` interfaces with zero-guesswork precision.
                      </div>
                    </div>
                    <div className="about-bullet">
                      <FiCheckCircle className="bullet-icon text-primary" />
                      <div>
                        <strong>Multi-Agentic AI Systems:</strong> Coordinating autonomous LLM agent clusters with tool-use contracts and self-healing loops.
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col lg="5">
                <div className="content-card h-100">
                  <h4 className="card-title mb-3">Languages &amp; Core Values</h4>

                  <h6 className="text-muted text-uppercase small mb-3">Spoken Languages</h6>
                  <div className="languages-chips mb-4">
                    <span className="lang-pill">
                      <strong>English</strong> (Professional Working)
                    </span>
                    <span className="lang-pill">
                      <strong>Telugu</strong> (Native)
                    </span>
                    <span className="lang-pill">
                      <strong>Hindi</strong> (Conversational)
                    </span>
                  </div>

                  <h6 className="text-muted text-uppercase small mb-3">Primary Tech Stack</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {skillGroups.Core.map((skill, idx) => (
                      <span key={idx} className="tech-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ========================================================
            SECTION 3: WORK TIMELINE & EXPERIENCE (#experience)
        ======================================================== */}
        <section id="experience" className="section-padding experience-section">
          <Container>
            <div className="section-title-wrap">
              <span className="section-tag">
                <FiBriefcase /> Career Progression
              </span>
              <h2 className="section-heading">Work Experience &amp; Impact</h2>
              <p className="section-subheading">
                Proven track record in designing enterprise microservices, optimizing SQL databases, and engineering robust supply chain software.
              </p>
            </div>

            <div className="timeline-container">
              {worktimeline.map((item, index) => (
                <div key={index} className="timeline-card">
                  <div className="timeline-marker"></div>
                  <div className="timeline-header d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                    <div>
                      <h4 className="job-title mb-1">{item.jobtitle}</h4>
                      <h5 className="company-name text-muted">
                        <FiMapPin className="me-1 text-primary" />
                        {item.where}
                      </h5>
                    </div>
                    <span className="date-badge">
                      <FiCalendar className="me-1" />
                      {item.date}
                    </span>
                  </div>

                  <div className="timeline-body">
                    {index === 0 ? (
                      <ul className="impact-list">
                        <li>
                          Architected and scaled modular Spring Boot microservices with stateless JWT security, Spring Data JPA, and decoupled database schemas.
                        </li>
                        <li>
                          Engineered mission-critical Warehouse Management System (WMS) workflows covering inventory receiving, storage allocation, wave-picking, packing, and dispatch logistics.
                        </li>
                        <li>
                          Designed and tuned relational schemas in MySQL, implementing indexing strategies, transaction boundaries, and automated schema migrations.
                        </li>
                        <li>
                          Integrated responsive React.js frontends and Electron desktop applications with secure IPC bridges for client-side diagnostic utilities.
                        </li>
                      </ul>
                    ) : (
                      <ul className="impact-list">
                        <li>
                          Trained on full-stack Java/Spring Boot enterprise architectures and modern single-page applications with React.js.
                        </li>
                        <li>
                          Built foundational RESTful API endpoints, validated request payloads, and handled cross-origin CORS configurations.
                        </li>
                        <li>
                          Collaborated on unit testing, database seeding, and CI/CD automated pipeline builds.
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ========================================================
            SECTION 4: TECHNICAL SKILLS MATRIX (#skills)
        ======================================================== */}
        <section id="skills" className="section-padding skills-section">
          <Container>
            <div className="section-title-wrap">
              <span className="section-tag">
                <FiCode /> Competencies
              </span>
              <h2 className="section-heading">Technical Skills &amp; Domain Expertise</h2>
              <p className="section-subheading">
                Production-grade technologies across backend microservices, distributed data, and high-performance frontend interfaces.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="skills-filter-tabs mb-4">
              {["All", ...Object.keys(skillGroups)].map((cat) => (
                <button
                  key={cat}
                  className={`skill-tab-btn ${activeSkillCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveSkillCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Categorized Skill Cards */}
            <Row className="g-4">
              {Object.entries(skillGroups)
                .filter(([cat]) => activeSkillCategory === "All" || activeSkillCategory === cat)
                .map(([category, items], i) => (
                  <Col md="6" lg="4" key={i}>
                    <div className="skill-group-card h-100">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <FiCpu className="text-primary fs-5" />
                        <h5 className="m-0 group-title">{category}</h5>
                      </div>
                      <div className="skill-chips-wrap">
                        {items.map((item, idx) => (
                          <span key={idx} className="skill-chip-tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Col>
                ))}
            </Row>

            {/* Proficiency Bars */}
            <div className="proficiency-bars-block mt-5 content-card">
              <h4 className="mb-4">Core Proficiency Gauge</h4>
              <Row className="g-4">
                {skills.slice(0, 8).map((s, idx) => (
                  <Col md="6" key={idx}>
                    <div className="skill-gauge-item">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold">{s.name}</span>
                        <span className="text-primary">{s.value}%</span>
                      </div>
                      <div className="gauge-track">
                        <div className="gauge-fill" style={{ width: `${s.value}%` }}></div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </section>

        {/* ========================================================
            SECTION 5: ENGINEERING SERVICES (#services)
        ======================================================== */}
        <section id="services" className="section-padding services-section">
          <Container>
            <div className="section-title-wrap">
              <span className="section-tag">
                <FiLayers /> Architecture Offerings
              </span>
              <h2 className="section-heading">Engineering Services &amp; Capabilities</h2>
              <p className="section-subheading">
                Tailored distributed engineering solutions from greenfield systems architecture to complex warehouse modernization.
              </p>
            </div>

            <Row className="g-4">
              {services.map((srv, idx) => (
                <Col md="6" lg="4" key={idx}>
                  <div className="service-card h-100">
                    <div className="service-icon-box mb-3">
                      {idx === 0 && <FiCpu />}
                      {idx === 1 && <FiServer />}
                      {idx === 2 && <FiCode />}
                      {idx === 3 && <FiLayers />}
                      {idx === 4 && <FiBox />}
                      {idx === 5 && <FiDatabase />}
                    </div>
                    <h5 className="service-title mb-2">{srv.title}</h5>
                    <p className="service-desc">{srv.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ========================================================
            SECTION 6: PRODUCTS & GO SEEKER (#products)
        ======================================================== */}
        <section id="products" className="section-padding products-section">
          <Container>
            <div className="section-title-wrap">
              <span className="section-tag">
                <SiLinux /> Native Tooling
              </span>
              <h2 className="section-heading">Featured Product: Go Seeker</h2>
              <p className="section-subheading">
                Deep Hardware Diagnostic &amp; Real-Time Host Telemetry Suite engineered specifically for Ubuntu / Linux systems.
              </p>
            </div>

            <div className="product-spotlight-card">
              <Row className="align-items-center g-4">
                <Col lg="6">
                  <div className="product-media-wrapper">
                    <img
                      src={productGoSeek.img}
                      alt={productGoSeek.title}
                      className="img-fluid rounded-3 product-preview-img"
                    />
                    <div className="product-badge-overlay">
                      <SiUbuntu className="me-1 text-warning" />
                      <span>{productGoSeek.badge}</span>
                    </div>
                  </div>
                </Col>

                <Col lg="6">
                  <div className="product-info-block">
                    <div className="status-pill mb-2">
                      <span className="status-dot"></span>
                      <span>{productGoSeek.status}</span>
                    </div>

                    <h3 className="product-heading mb-2">{productGoSeek.title}</h3>
                    <p className="product-tagline text-muted mb-3">{productGoSeek.tagline}</p>
                    <p className="product-desc mb-4">{productGoSeek.description}</p>

                    {/* Feature Highlights */}
                    <div className="features-checklist mb-4">
                      {productGoSeek.features.slice(0, 4).map((feat, idx) => (
                        <div key={idx} className="feat-item">
                          <FiCheckCircle className="text-primary me-2" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-wrap gap-3">
                      <button
                        className="btn btn-warning custom-btn d-flex align-items-center"
                        onClick={() => setShowDownloadCenter(true)}
                      >
                        <SiUbuntu className="me-2" />
                        <span>Launch Ubuntu Download Center</span>
                      </button>

                      <a
                        href={productGoSeek.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary custom-btn d-flex align-items-center"
                      >
                        <FiGithub className="me-2" />
                        <span>GitHub Repository</span>
                      </a>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </section>

        {/* ========================================================
            SECTION 7: CONTACT & SUPPORT TICKETS (#contact)
        ======================================================== */}
        <section id="contact" className="section-padding contact-section">
          <Container>
            <div className="section-title-wrap">
              <span className="section-tag">
                <FiMail /> Get In Touch
              </span>
              <h2 className="section-heading">Contact &amp; Issue Ticketing Center</h2>
              <p className="section-subheading">
                Reach out for engineering consultations, hire me for full-stack contracts, or log a technical issue directly into TiDB Cloud Serverless (`app_db`).
              </p>

              {/* Real-Time Cloud Microservices Health Bar */}
              <div className="d-flex align-items-center gap-3 microservice-status-bar mt-3">
                <span className="small text-muted d-flex align-items-center">
                  <FiActivity className="me-1 text-primary" /> Cloud Microservices:
                </span>
                <span
                  className={`badge ${
                    cloudStatus.backend === "online" ? "bg-success" : "bg-warning text-dark"
                  } d-inline-flex align-items-center`}
                >
                  <span className="status-dot me-1">●</span>
                  Backend: {cloudStatus.backend === "online" ? "Online" : "Waking up..."}
                </span>
                <span
                  className={`badge ${
                    cloudStatus.auth === "online" ? "bg-success" : "bg-warning text-dark"
                  } d-inline-flex align-items-center`}
                >
                  <span className="status-dot me-1">●</span>
                  Auth: {cloudStatus.auth === "online" ? "Online" : "Waking up..."}
                </span>
              </div>
            </div>

            <Row className="g-4">
              <Col lg="5">
                <div className="content-card h-100">
                  <h4 className="mb-3">Contact Information</h4>
                  <p className="text-muted mb-4">{contactConfig.description}</p>

                  <div className="contact-info-list mb-4">
                    <div className="contact-info-item">
                      <FiMail className="info-icon text-primary" />
                      <div>
                        <div className="label">Primary Email</div>
                        <a href={`mailto:${contactConfig.YOUR_EMAIL}`} className="value">
                          {contactConfig.YOUR_EMAIL}
                        </a>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <FiTerminal className="info-icon text-primary" />
                      <div>
                        <div className="label">Database Cluster</div>
                        <span className="value">TiDB Cloud Serverless (app_db &amp; auth_db)</span>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <FiServer className="info-icon text-primary" />
                      <div>
                        <div className="label">Deployment Host</div>
                        <span className="value">Render.com Microservices (Java 17 / Docker)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-top border-secondary-subtle">
                    <button
                      className="btn btn-outline-success w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => triggerResumeDownload("Srikanth_Yepalagunta_Resume.pdf")}
                    >
                      <FiDownload />
                      <span>Download Latest Resume (PDF)</span>
                    </button>
                  </div>
                </div>
              </Col>

              <Col lg="7">
                <div className="content-card">
                  {/* Tabs: Direct Message vs Report Ticket */}
                  <div className="contact-tabs-header mb-4">
                    <button
                      type="button"
                      className={`contact-mode-tab ${activeContactTab === "contact" ? "active" : ""}`}
                      onClick={() => {
                        setActiveContactTab("contact");
                        setFormAlert({ show: false });
                      }}
                    >
                      <FiMessageSquare className="me-2" />
                      <span>Direct Message</span>
                    </button>

                    <button
                      type="button"
                      className={`contact-mode-tab ${activeContactTab === "ticket" ? "active" : ""}`}
                      onClick={() => {
                        setActiveContactTab("ticket");
                        setFormAlert({ show: false });
                      }}
                    >
                      <FiAlertCircle className="me-2 text-warning" />
                      <span>Report Issue Ticket</span>
                    </button>
                  </div>

                  {formAlert.show && (
                    <Alert variant={formAlert.variant} className="mb-4">
                      <div>{formAlert.message}</div>
                      {formAlert.ticketCode && (
                        <div className="mt-2 font-monospace fw-bold">
                          Ticket Reference Code: {formAlert.ticketCode}
                        </div>
                      )}
                    </Alert>
                  )}

                  {activeContactTab === "contact" ? (
                    /* Direct Message Form */
                    <form onSubmit={handleContactSubmit}>
                      <Row className="g-3">
                        <Col md="6">
                          <label className="form-label">Your Name</label>
                          <input
                            type="text"
                            name="name"
                            required
                            className="form-control custom-input"
                            placeholder="e.g. Alex Mercer"
                            value={contactData.name}
                            onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                          />
                        </Col>

                        <Col md="6">
                          <label className="form-label">Your Email</label>
                          <input
                            type="email"
                            name="email"
                            required
                            className="form-control custom-input"
                            placeholder="alex@domain.com"
                            value={contactData.email}
                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                          />
                        </Col>

                        <Col xs="12">
                          <label className="form-label">Subject</label>
                          <input
                            type="text"
                            name="subject"
                            required
                            className="form-control custom-input"
                            placeholder="Consultation / Job Opportunity / Architecture Inquiry"
                            value={contactData.subject}
                            onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                          />
                        </Col>

                        <Col xs="12">
                          <label className="form-label">Message</label>
                          <textarea
                            name="message"
                            rows="5"
                            required
                            className="form-control custom-input"
                            placeholder="Detail your requirements, project scope, or message..."
                            value={contactData.message}
                            onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                          ></textarea>
                        </Col>

                        <Col xs="12">
                          <button
                            type="submit"
                            className="btn btn-primary custom-btn w-100 py-2 d-flex align-items-center justify-content-center"
                            disabled={formLoading}
                          >
                            <FiSend className="me-2" />
                            <span>{formLoading ? "Sending to Cloud Backend..." : "Send Message"}</span>
                          </button>
                        </Col>
                      </Row>
                    </form>
                  ) : (
                    /* Issue Ticket Form */
                    <form onSubmit={handleTicketSubmit}>
                      <Row className="g-3">
                        <Col md="6">
                          <label className="form-label">Target Application</label>
                          <select
                            name="appSource"
                            className="form-select custom-input"
                            value={ticketData.appSource}
                            onChange={(e) => setTicketData({ ...ticketData, appSource: e.target.value })}
                          >
                            <option value="Go-Seek">Go-Seek (Ubuntu Hardware Diagnostics)</option>
                            <option value="Srikanthy-Portfolio">Srikanthy Portfolio</option>
                            <option value="Auth-Service">Auth-Service Microservice</option>
                            <option value="Go-Seek-Backend">Go-Seek Backend Microservice</option>
                          </select>
                        </Col>

                        <Col md="6">
                          <label className="form-label">Priority</label>
                          <select
                            name="priority"
                            className="form-select custom-input"
                            value={ticketData.priority}
                            onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                          </select>
                        </Col>

                        <Col md="6">
                          <label className="form-label">Reporter Name</label>
                          <input
                            type="text"
                            name="userName"
                            required
                            className="form-control custom-input"
                            placeholder="Your name"
                            value={ticketData.userName}
                            onChange={(e) => setTicketData({ ...ticketData, userName: e.target.value })}
                          />
                        </Col>

                        <Col md="6">
                          <label className="form-label">Reporter Email</label>
                          <input
                            type="email"
                            name="userEmail"
                            required
                            className="form-control custom-input"
                            placeholder="your.email@domain.com"
                            value={ticketData.userEmail}
                            onChange={(e) => setTicketData({ ...ticketData, userEmail: e.target.value })}
                          />
                        </Col>

                        <Col xs="12">
                          <label className="form-label">Issue Title / Summary</label>
                          <input
                            type="text"
                            name="title"
                            required
                            className="form-control custom-input"
                            placeholder="Brief summary of the defect or telemetry issue"
                            value={ticketData.title}
                            onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
                          />
                        </Col>

                        <Col xs="12">
                          <label className="form-label">Issue Description &amp; Reproduction Steps</label>
                          <textarea
                            name="description"
                            rows="4"
                            required
                            className="form-control custom-input"
                            placeholder="Describe expected vs actual behavior, environment details..."
                            value={ticketData.description}
                            onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                          ></textarea>
                        </Col>

                        <Col xs="12">
                          <button
                            type="submit"
                            className="btn btn-warning custom-btn w-100 py-2 d-flex align-items-center justify-content-center text-dark fw-bold"
                            disabled={formLoading}
                          >
                            <FiAlertCircle className="me-2" />
                            <span>{formLoading ? "Logging into app_db..." : "Log Issue Ticket"}</span>
                          </button>
                        </Col>
                      </Row>
                    </form>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Footer */}
        <footer className="py-4 text-center text-muted border-top border-secondary-subtle">
          <Container>
            <p className="m-0 small">
              &copy; {new Date().getFullYear()} Srikanth Yepalagunta · Multi-Agentic Systems Architect · Powered by Spring Boot 3 &amp; React.
            </p>
          </Container>
        </footer>
      </main>

      {/* Ubuntu Download Center Modal */}
      <Modal
        show={showDownloadCenter}
        onHide={() => setShowDownloadCenter(false)}
        size="xl"
        centered
        className="ubuntu-modal-override"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="d-flex align-items-center gap-2">
            <SiUbuntu className="text-warning" />
            <span>Go Seeker — Ubuntu / Linux Hardware Telemetry Suite</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <UbuntuDownloadCenter
            product={productGoSeek}
            clientOS={{ name: "Ubuntu Linux", isUbuntu: true, isLinuxFamily: true }}
            onGuideDownload={() => {}}
            isUbuntuDetected={true}
          />
        </Modal.Body>
      </Modal>
    </HelmetProvider>
  );
};
