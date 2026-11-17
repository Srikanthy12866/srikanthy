import React, { useState, useMemo, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { products, meta, socialprofils } from "../../content_option";
import { useTranslation } from "react-i18next";
import {
  FiExternalLink,
  FiGithub,
  FiSearch,
  FiCheckCircle,
  FiLayers,
  FiCpu,
  FiActivity,
  FiX,
  FiDownload,
  FiTerminal,
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import { SiUbuntu, SiDebian, SiLinux } from "react-icons/si";
import { UbuntuDownloadCenter } from "../../components/UbuntuDownloadCenter/UbuntuDownloadCenter";

// Detect Client Operating System with specific Ubuntu recognition
export const detectClientOS = () => {
  if (typeof window === "undefined" || !window.navigator) {
    return { name: "Unknown OS", isUbuntu: false, isLinuxFamily: false };
  }

  const userAgent = window.navigator.userAgent || "";
  const platform = window.navigator.platform || "";

  if (/Android/i.test(userAgent)) {
    return { name: "Android", isUbuntu: false, isLinuxFamily: false };
  }
  if (/iPad|iPhone|iPod/.test(userAgent) || (platform === "MacIntel" && window.navigator.maxTouchPoints > 1)) {
    return { name: "iOS", isUbuntu: false, isLinuxFamily: false };
  }
  if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) || /Mac OS X/i.test(userAgent)) {
    return { name: "macOS", isUbuntu: false, isLinuxFamily: false };
  }
  if (/Win32|Win64|Windows|WinCE/i.test(platform) || /Windows NT|Win64|WOW64/i.test(userAgent)) {
    let winVer = "Windows";
    if (/Windows NT 10.0/i.test(userAgent)) winVer = "Windows 10/11";
    return { name: winVer, isUbuntu: false, isLinuxFamily: false };
  }
  if (/Linux|X11/i.test(platform) || /Linux|X11|Ubuntu|Debian|Fedora|CentOS|RedHat/i.test(userAgent)) {
    const isUbuntuExplicit = /Ubuntu/i.test(userAgent) || /Ubuntu/i.test(platform);
    return {
      name: isUbuntuExplicit ? "Ubuntu Linux" : "Linux (Ubuntu Compatible)",
      isUbuntu: true,
      isLinuxFamily: true,
    };
  }
  return { name: "Unknown OS", isUbuntu: false, isLinuxFamily: false };
};

// Generate comprehensive Ubuntu / Linux User Guide
const generateUserGuide = (product) => {
  const prodTitle = product?.title || "Go Seeker";
  const repoUrl = product?.github || "https://github.com/Srikanthy12866/Go-Seek";

  return `================================================================================
                    ${prodTitle.toUpperCase()} - USER GUIDE & QUICK START
            Deep Hardware Diagnostic Suite for Ubuntu / Linux
================================================================================

Repository: ${repoUrl}
Platform:   Ubuntu 20.04 / 22.04 / 24.04 LTS (and Debian/Linux family)
Runtime:    Node.js (>= 18.x), Electron, React

--------------------------------------------------------------------------------
1. SYSTEM REQUIREMENTS & PREREQUISITES
--------------------------------------------------------------------------------
- Operating System: Ubuntu, Debian, Fedora, Arch Linux (x86_64 or ARM64)
- Linux Kernel: 5.x or 6.x with readable /sys/devices and /proc interfaces
- Node.js & npm: Node.js 18 or newer recommended

Install dependencies on Ubuntu/Debian:
  $ sudo apt update
  $ sudo apt install -y curl git build-essential

--------------------------------------------------------------------------------
2. RUNNING THE APPLICATION
--------------------------------------------------------------------------------
Option A: Full Desktop Mode (Electron with real-time kernel telemetry):
  $ npm run desktop

Option B: Standalone Package Installation:
  $ sudo dpkg -i Go-Seek-0.1.0-amd64.deb

================================================================================
Generated for: Srikanth Yepalagunta - ${prodTitle} Project
================================================================================`;
};

// Utility to trigger client-side text file download
const triggerFileDownload = (content, filename, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const Products = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState(null);
  const [modalTab, setModalTab] = useState("overview"); // "overview" | "downloads" | "architecture"

  const [detectedOS, setDetectedOS] = useState(() => detectClientOS());

  useEffect(() => {
    setDetectedOS(detectClientOS());
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.techStack.some((tech) => tech.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenProduct = (product, initialTab = "overview") => {
    setActiveProduct(product);
    setModalTab(initialTab);
  };

  const handleDownload = (product = activeProduct) => {
    if (!product) return;
    setDetectedOS(detectClientOS());
    handleOpenProduct(product, "downloads");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveProduct(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <HelmetProvider>
      <Container className="About-header products_section pb-5">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Products | {meta.title} </title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* Back Link */}
        <div className="mb-3 pt-4">
          <Link to="/" className="back-to-home-link d-inline-flex align-items-center text-decoration-none">
            <FiArrowLeft className="me-2" />
            <span>Back to Portfolio Overview</span>
          </Link>
        </div>

        {/* Section Header */}
        <Row className="mb-4 mt-2">
          <Col lg="10">
            <h1 className="display-4 mb-2 products-main-title">
              {t("products_title")}
            </h1>
            <p className="products-subtitle text-muted">
              Explore engineered applications, real-time Linux diagnostic suites, and distributed software systems.
            </p>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* Search & Filter Toolbar */}
        <div className="products-toolbar mb-4">
          <div className="products-search-wrapper mb-3 mb-md-0">
            <FiSearch className="search-icon" />
            <input
              type="text"
              id="product-search-input"
              className="products-search-input"
              placeholder={t("search_products")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="products-filter-pills">
            {categories.map((category) => {
              const count =
                category === "All"
                  ? products.length
                  : products.filter((p) => p.category === category).length;

              return (
                <button
                  key={category}
                  className={`filter-pill ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span>
                    {category === "All" ? t("all_categories") : category}
                  </span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products-box text-center py-5">
            <FiCpu className="empty-icon mb-3" />
            <h3 className="h4">{t("no_products_found")}</h3>
            <p className="text-muted">
              Try adjusting your search terms or filter selection.
            </p>
            <button
              className="btn btn-outline-secondary mt-3 px-4 py-2"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              {t("reset_filters")}
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const isSingle = filteredProducts.length === 1;
              return (
                <div
                  key={product.id}
                  className={`product-card ${isSingle ? "featured-single" : ""}`}
                  onClick={() => handleOpenProduct(product, "overview")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleOpenProduct(product, "overview");
                    }
                  }}
                >
                  <div className="product-media">
                    <img
                      src={product.img}
                      alt={product.title}
                      loading="lazy"
                      className="product-image"
                    />
                    <div className="media-overlay"></div>
                    <div className="product-badge-group">
                      <span className="product-category-tag">
                        {product.category}
                      </span>
                      <span className="product-status-indicator">
                        <span className="pulse-dot"></span>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  <div className="product-body">
                    <div className="product-header">
                      <h3 className="product-title">{product.title}</h3>
                      <p className="product-tagline">{product.tagline}</p>
                    </div>

                    <p className="product-description-snippet">
                      {product.description}
                    </p>

                    <div className="product-features-snippet">
                      {product.features
                        .slice(0, isSingle ? 4 : 2)
                        .map((feat, idx) => (
                          <div key={idx} className="feature-snippet-item">
                            <FiCheckCircle className="check-icon me-2" />
                            <span>{feat}</span>
                          </div>
                        ))}
                    </div>

                    <div className="product-tech-chips">
                      {(isSingle
                        ? product.techStack
                        : product.techStack.slice(0, 4)
                      ).map((tech, idx) => (
                        <span key={idx} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                      {!isSingle && product.techStack.length > 4 && (
                        <span className="tech-badge-more">
                          +{product.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    <div
                      className="product-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="product-btn-primary"
                        onClick={() => handleOpenProduct(product, "overview")}
                      >
                        <FiLayers className="me-2" />
                        {t("quick_view")}
                      </button>

                      <button
                        className="product-btn-download"
                        onClick={() => handleDownload(product)}
                        title="Download for Ubuntu / Linux"
                      >
                        <SiUbuntu className="me-1 ubuntu-card-icon" />
                        Download
                      </button>

                      <a
                        href={product.github || socialprofils.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-btn-icon"
                        title={t("view_code")}
                        aria-label={`${product.title} GitHub repository`}
                      >
                        <FiGithub />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Responsive Product Quick View Modal */}
        {activeProduct && (
          <Modal
            show={!!activeProduct}
            onHide={() => setActiveProduct(null)}
            size="lg"
            centered
            className="product-detail-modal"
          >
            <div className="modal-content-glass">
              {/* Header */}
              <div className="modal-header-custom">
                <div className="modal-title-group">
                  <span className="modal-category-badge">
                    {activeProduct.category}
                  </span>
                  <h2 className="modal-product-title mt-1">
                    {activeProduct.title}
                  </h2>
                  <p className="modal-product-tagline text-muted mb-0">
                    {activeProduct.tagline}
                  </p>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setActiveProduct(null)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              {/* Modal Navigation Tabs (Responsive & Clear) */}
              <div className="modal-nav-tabs">
                <button
                  type="button"
                  className={`modal-tab-btn ${modalTab === "overview" ? "active" : ""}`}
                  onClick={() => setModalTab("overview")}
                >
                  <FiInfo className="me-1" />
                  <span>Overview &amp; Features</span>
                </button>
                <button
                  type="button"
                  className={`modal-tab-btn ${modalTab === "downloads" ? "active" : ""}`}
                  onClick={() => setModalTab("downloads")}
                >
                  <FiDownload className="me-1" />
                  <span>Downloads &amp; Packages</span>
                </button>
                <button
                  type="button"
                  className={`modal-tab-btn ${modalTab === "architecture" ? "active" : ""}`}
                  onClick={() => setModalTab("architecture")}
                >
                  <FiCpu className="me-1" />
                  <span>Kernel Architecture</span>
                </button>
              </div>

              <div className="modal-body-custom">
                {/* Visual Banner */}
                <div className="modal-banner-img-wrap mb-4">
                  <img
                    src={activeProduct.img}
                    alt={activeProduct.title}
                    className="modal-banner-img"
                  />
                  <div className="modal-banner-overlay">
                    {activeProduct.stats && (
                      <div className="modal-stats-bar">
                        {Object.entries(activeProduct.stats).map(
                          ([key, value]) => (
                            <div key={key} className="stat-item">
                              <span className="stat-label">
                                {key.toUpperCase()}
                              </span>
                              <span className="stat-value">{value}</span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* TAB 1: Overview & Features */}
                {modalTab === "overview" && (
                  <div className="tab-pane-fade">
                    {/* Structured Product Description */}
                    <div className="modal-section mb-4">
                      <h4 className="modal-section-title">
                        <FiActivity className="me-2 text-primary" />
                        Product Description
                      </h4>
                      <div className="product-full-desc-card p-3 rounded-3 mb-3">
                        <p className="modal-desc-text mb-2">
                          {activeProduct.description}
                        </p>
                        <p className="modal-desc-sub text-muted small mb-0">
                          Designed with strict zero-guesswork telemetry principles: if a hardware metric cannot be authenticated through Linux kernel interfaces, it is honestly reported rather than fabricated.
                        </p>
                      </div>
                    </div>

                    {/* Key Capabilities */}
                    <div className="modal-section mb-4">
                      <h4 className="modal-section-title">
                        <FiCheckCircle className="me-2 text-success" />
                        {t("key_capabilities")}
                      </h4>
                      <div className="modal-features-list">
                        {activeProduct.features.map((feat, idx) => (
                          <div key={idx} className="modal-feature-row">
                            <FiCheckCircle className="feature-check-icon text-success" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="modal-section mb-4">
                      <h4 className="modal-section-title">
                        <FiLayers className="me-2 text-info" />
                        {t("tech_stack")}
                      </h4>
                      <div className="modal-tech-cloud">
                        {activeProduct.techStack.map((tech, idx) => (
                          <span key={idx} className="modal-tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Downloads & Packages */}
                {modalTab === "downloads" && (
                  <div className="tab-pane-fade" id="ubuntu-download-center">
                    <UbuntuDownloadCenter
                      product={activeProduct}
                      clientOS={detectedOS}
                      isUbuntuDetected={detectedOS?.isUbuntu || detectedOS?.isLinuxFamily}
                      onGuideDownload={() =>
                        triggerFileDownload(
                          generateUserGuide(activeProduct),
                          `${activeProduct.title.replace(/\s+/g, "_")}_Ubuntu_User_Guide.txt`
                        )
                      }
                    />
                  </div>
                )}

                {/* TAB 3: Kernel Architecture */}
                {modalTab === "architecture" && (
                  <div className="tab-pane-fade">
                    <div className="modal-section mb-4">
                      <h4 className="modal-section-title">
                        <FiCpu className="me-2 text-warning" />
                        {t("architecture_overview")}
                      </h4>
                      <div className="architecture-box p-3 rounded-3 mb-3">
                        <p className="mb-2">{activeProduct.architecture}</p>
                      </div>

                      <div className="arch-breakdown-cards">
                        <div className="arch-card p-3 mb-2 rounded-2">
                          <strong className="d-block text-primary small">1. Sandboxed IPC Layer</strong>
                          <span className="small text-muted">
                            Strict contextIsolation: true and nodeIntegration: false keeps Chromium renderer decoupled from host root privileges.
                          </span>
                        </div>
                        <div className="arch-card p-3 mb-2 rounded-2">
                          <strong className="d-block text-primary small">2. Kernel sysfs Telemetry</strong>
                          <span className="small text-muted">
                            Direct queries against /sys/devices/system/cpu and /sys/class/thermal sample true hardware clock frequencies continuously.
                          </span>
                        </div>
                        <div className="arch-card p-3 mb-2 rounded-2">
                          <strong className="d-block text-primary small">3. Reactive Polling Engine</strong>
                          <span className="small text-muted">
                            1-second reactive polling loop feeds dynamic React telemetry gauges with minimal CPU overhead.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer-custom">
                <div className="d-flex align-items-center gap-2 flex-wrap w-100 justify-content-between">
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      className="modal-action-btn primary"
                      onClick={() => setModalTab("downloads")}
                    >
                      <SiUbuntu className="me-1" />
                      Ubuntu Downloads (.deb)
                    </button>
                    <a
                      href={activeProduct.github || socialprofils.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-action-btn secondary"
                    >
                      <FiGithub className="me-1" />
                      {t("view_code")}
                    </a>
                  </div>

                  {activeProduct.link && activeProduct.link !== "#" && (
                    <a
                      href={activeProduct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-action-btn secondary"
                    >
                      <FiExternalLink className="me-1" />
                      Repository
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </Container>
    </HelmetProvider>
  );
};

export const Portfolio = Products;
export default Products;
