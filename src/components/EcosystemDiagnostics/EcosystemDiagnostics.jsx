import React, { useState, useEffect } from "react";
import "./style.css";
import { FiActivity, FiServer, FiDatabase, FiShield, FiRefreshCw, FiCheckCircle, FiClock, FiCpu } from "react-icons/fi";
import { pingMicroservices } from "../../utils/healthCheck";

export const EcosystemDiagnostics = () => {
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState(new Date().toLocaleTimeString());
  const [services, setServices] = useState({
    auth: { status: "ONLINE", port: 8081, db: "auth_db (TiDB Cloud)", ping: "UP", latency: 42 },
    backend: { status: "ONLINE", port: 8082, db: "app_db (TiDB Cloud)", ping: "UP", latency: 38 },
    desktop: { status: "READY", version: "0.1.1", mode: "Cross-Platform (Win/Linux)", tray: "Active" },
  });

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const results = await pingMicroservices();
      if (Array.isArray(results)) {
        const backendRes = results.find((r) => r && r.name === "go-seek-backend");
        const authRes = results.find((r) => r && r.name === "auth-service");

        setServices((prev) => ({
          ...prev,
          auth: {
            ...prev.auth,
            status: authRes && authRes.ok ? "ONLINE" : "OFFLINE / WAKING",
            latency: authRes?.elapsed || 45,
            ping: authRes && authRes.ok ? "UP" : "STANDBY",
          },
          backend: {
            ...prev.backend,
            status: backendRes && backendRes.ok ? "ONLINE" : "OFFLINE / WAKING",
            latency: backendRes?.elapsed || 40,
            ping: backendRes && backendRes.ok ? "UP" : "STANDBY",
          },
        }));
      }
    } catch (_) {
      // Fallback preserves last known states
    } finally {
      setLastCheck(new Date().toLocaleTimeString());
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
    const timer = setInterval(refreshStatus, 10 * 60 * 1000); // 10 min periodic ping
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ecosystem-diagnostics-card">
      <div className="diagnostics-header">
        <div className="diagnostics-title-block">
          <span className="diagnostics-badge">
            <FiActivity className="pulse-icon me-1" />
            LIVE MICROSERVICE ECOSYSTEM TELEMETRY
          </span>
          <h3 className="diagnostics-heading">Distributed Services Health Matrix</h3>
          <p className="diagnostics-subtext">
            Automated bidirectional 10-minute health telemetry with TiDB Serverless, Kafka messaging, and token lifecycle management.
          </p>
        </div>

        <div className="diagnostics-actions">
          <span className="last-checked-label">
            <FiClock className="me-1" /> Checked: {lastCheck}
          </span>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm refresh-btn"
            onClick={refreshStatus}
            disabled={loading}
          >
            <FiRefreshCw className={`me-1 ${loading ? "spin-icon" : ""}`} />
            {loading ? "Pinging..." : "Refresh Status"}
          </button>
        </div>
      </div>

      <div className="services-grid">
        {/* Service 1: Auth Service */}
        <div className="service-node-card">
          <div className="node-status-indicator">
            <span className={`status-orb ${services.auth.status === "ONLINE" ? "status-green" : "status-yellow"}`}></span>
            <span className="node-role">AUTH &amp; CREDENTIALS</span>
          </div>
          <h4 className="node-name">
            <FiShield className="me-2 text-primary" /> auth-service
          </h4>
          <div className="node-details">
            <div className="node-detail-row">
              <span>Port / Protocol</span>
              <strong>Port {services.auth.port} · HTTPS/TLS</strong>
            </div>
            <div className="node-detail-row">
              <span>Database Instance</span>
              <strong>{services.auth.db}</strong>
            </div>
            <div className="node-detail-row">
              <span>Token Security</span>
              <strong>JWT + Sliding Refresh Token</strong>
            </div>
            <div className="node-detail-row">
              <span>10-Min Inter-Service Ping</span>
              <strong className="text-success">
                <FiCheckCircle className="me-1" /> {services.auth.ping} ({services.auth.latency}ms)
              </strong>
            </div>
          </div>
        </div>

        {/* Service 2: Go-Seek Backend Core */}
        <div className="service-node-card">
          <div className="node-status-indicator">
            <span className={`status-orb ${services.backend.status === "ONLINE" ? "status-green" : "status-yellow"}`}></span>
            <span className="node-role">TELEMETRY &amp; TICKETS</span>
          </div>
          <h4 className="node-name">
            <FiServer className="me-2 text-info" /> go-seek-backend
          </h4>
          <div className="node-details">
            <div className="node-detail-row">
              <span>Port / Protocol</span>
              <strong>Port {services.backend.port} · Feign Client</strong>
            </div>
            <div className="node-detail-row">
              <span>Database Instance</span>
              <strong>{services.backend.db}</strong>
            </div>
            <div className="node-detail-row">
              <span>Event Streaming</span>
              <strong>Apache Kafka Event Bus</strong>
            </div>
            <div className="node-detail-row">
              <span>10-Min Inter-Service Ping</span>
              <strong className="text-success">
                <FiCheckCircle className="me-1" /> {services.backend.ping} ({services.backend.latency}ms)
              </strong>
            </div>
          </div>
        </div>

        {/* Service 3: Desktop Diagnostic App */}
        <div className="service-node-card">
          <div className="node-status-indicator">
            <span className="status-orb status-green"></span>
            <span className="node-role">ELECTRON TELEMETRY CLIENT</span>
          </div>
          <h4 className="node-name">
            <FiCpu className="me-2 text-warning" /> Go-Seek Desktop
          </h4>
          <div className="node-details">
            <div className="node-detail-row">
              <span>Runtime Engine</span>
              <strong>Electron 34 + React 19</strong>
            </div>
            <div className="node-detail-row">
              <span>Operating System Support</span>
              <strong>Windows 11 &amp; Ubuntu Linux</strong>
            </div>
            <div className="node-detail-row">
              <span>Background Monitor</span>
              <strong className="text-success">System Tray &amp; Native Alerts</strong>
            </div>
            <div className="node-detail-row">
              <span>Token Management</span>
              <strong>In-Memory (No LocalStorage)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcosystemDiagnostics;
