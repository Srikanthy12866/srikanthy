import React, { useState } from "react";
import "./style.css";
import { FiSearch, FiCheckCircle, FiClock, FiAlertCircle, FiTag } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://go-seek-backend.onrender.com";

export const TicketTracker = () => {
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;

    setLoading(true);
    setError(null);
    setTicket(null);

    const cleanCode = ticketCode.trim().toUpperCase();

    try {
      const res = await fetch(`${BACKEND_URL}/api/tickets/track/${encodeURIComponent(cleanCode)}`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? "No ticket found with this reference code." : "Failed to retrieve ticket status.");
      }
      const data = await res.json();
      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status, stepName) => {
    const order = ["OPEN", "TRIAGED", "IN_PROGRESS", "RESOLVED", "CLOSED"];
    const currentIndex = order.indexOf(status?.toUpperCase() || "OPEN");
    const stepIndex = order.indexOf(stepName);

    if (currentIndex >= stepIndex) return "completed";
    if (currentIndex === stepIndex - 1) return "current";
    return "pending";
  };

  return (
    <div className="ticket-tracker-card">
      <div className="tracker-header">
        <span className="tracker-tag">
          <FiTag className="me-1" /> LIVE ISSUE &amp; TICKET TRACKER
        </span>
        <h3 className="tracker-title">Track Support Ticket Status</h3>
        <p className="tracker-subtitle">
          Enter your reference code (e.g. <code>TICK-9021</code>) to track real-time resolution progress from our backend.
        </p>
      </div>

      <form onSubmit={handleTrack} className="tracker-form">
        <div className="tracker-input-group">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Enter ticket code (e.g. TICK-XXXX)..."
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            className="tracker-input"
          />
          <button type="submit" className="tracker-submit-btn" disabled={loading || !ticketCode.trim()}>
            {loading ? "Searching..." : "Track Status"}
          </button>
        </div>
      </form>

      {error && (
        <div className="tracker-error-alert">
          <FiAlertCircle className="me-2" /> {error}
        </div>
      )}

      {ticket && (
        <div className="ticket-result-box">
          <div className="ticket-result-header">
            <div>
              <span className="ticket-ref-code">{ticket.ticketCode}</span>
              <h4 className="ticket-title-display">{ticket.title}</h4>
            </div>
            <div className="ticket-badges">
              <span className={`priority-pill priority-${(ticket.priority || "MEDIUM").toLowerCase()}`}>
                {ticket.priority || "MEDIUM"}
              </span>
              <span className="source-pill">{ticket.appSource || "Go-Seek"}</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="ticket-stepper">
            <div className={`step-node ${getStepStatus(ticket.status, "OPEN")}`}>
              <div className="step-dot"><FiCheckCircle /></div>
              <span>Submitted</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${getStepStatus(ticket.status, "IN_PROGRESS")}`}>
              <div className="step-dot"><FiClock /></div>
              <span>In Progress</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-node ${getStepStatus(ticket.status, "RESOLVED")}`}>
              <div className="step-dot"><FiCheckCircle /></div>
              <span>Resolved</span>
            </div>
          </div>

          <div className="ticket-meta-grid">
            <div>
              <span>Current Status</span>
              <strong className="status-highlight">{ticket.status}</strong>
            </div>
            <div>
              <span>Submitted By</span>
              <strong>{ticket.userName || "User"} ({ticket.userEmail})</strong>
            </div>
            <div>
              <span>Created Timestamp</span>
              <strong>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : "Recently"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTracker;
