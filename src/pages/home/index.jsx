import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta } from "../../content_option";
import { Link } from "react-router-dom";
import blackAndWhiteImage from "../../assets/images/black-and-white-image.png";
import { useTranslation } from "react-i18next";
import { FiCpu, FiLayers, FiTerminal, FiShield, FiArrowRight, FiLifeBuoy, FiDownload } from "react-icons/fi";
import { triggerResumeDownload } from "../../utils/getResume";

export const Home = () => {
  const { t } = useTranslation();

  return (
    <HelmetProvider>
      <section id="home" className="home">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <div className="intro_sec d-block d-lg-flex align-items-center">
          <div
            className="h_bg-image order-1 order-lg-2 h-100"
            style={{ backgroundImage: `url(${blackAndWhiteImage})` }}
          >
            {/* Multi-Agentic Floating Status Pill */}
            <div className="agentic-status-chip">
              <span className="agentic-pulse-dot"></span>
              <span className="agentic-chip-title">Multi-Agent Swarm Active</span>
              <span className="agentic-chip-sub">Spring Boot · React · Linux sysfs</span>
            </div>
          </div>

          <div className="text order-2 order-lg-1 h-100 d-lg-flex justify-content-center">
            <div className="align-self-center">
              <div className="intro mx-auto">
                <div className="agentic-badge mb-3">
                  <FiCpu className="me-1" />
                  <span>MULTI-AGENTIC SYSTEMS &amp; DISTRIBUTED ARCHITECTURE</span>
                </div>

                <h2 className="mb-2 intro-name">{introdata.title}</h2>

                <h1 className="fluidz-48 mb-3 typewriter-wrapper">
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
                      delay: 45,
                    }}
                  />
                </h1>

                <p className="mb-4 intro-desc">{introdata.description}</p>

                {/* Tech & Architecture Capability Badges */}
                <div className="agentic-highlights-grid mb-4">
                  <div className="highlight-pill">
                    <FiLayers className="highlight-icon" />
                    <span>Microservices &amp; Multi-DB</span>
                  </div>
                  <div className="highlight-pill">
                    <FiTerminal className="highlight-icon" />
                    <span>Autonomous AI Tool-Use</span>
                  </div>
                  <div className="highlight-pill">
                    <FiShield className="highlight-icon" />
                    <span>Stateless JWT Security</span>
                  </div>
                </div>

                <div className="intro_btn-action pb-5">
                  <Link to="/products" className="text_2">
                    <div id="button_p" className="ac_btn btn">
                      {t("my_products")}
                      <FiArrowRight className="ms-2" />
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>

                  <Link to="/contact">
                    <div id="button_h" className="ac_btn btn">
                      {t("contact_me")}
                      <div className="ring one"></div>
                      <div className="ring two"></div>
                      <div className="ring three"></div>
                    </div>
                  </Link>

                  <Link to="/contact#report-ticket" className="ticket-link-btn me-2">
                    <FiLifeBuoy className="me-1" />
                    <span>Submit Issue Ticket</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => triggerResumeDownload()}
                    className="resume-download-btn"
                    title="Download Official Resume via Backend Proxy"
                  >
                    <FiDownload className="me-1" />
                    <span>{t('Resume')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HelmetProvider>
  );
};
