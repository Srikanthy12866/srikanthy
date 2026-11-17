import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { FiCpu, FiTerminal, FiCheckCircle, FiFastForward } from "react-icons/fi";

export const SwarmIntro = ({ onComplete }) => {
  // Phases: 'SHOW_404' -> 'ZOOM_BLACK' -> 'SWARM_BUILD' -> 'FINISHED'
  const [phase, setPhase] = useState("SHOW_404");
  const [logs, setLogs] = useState([]);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Phase 1: 404 for 0.5 sec, then zoom overcover for 0.5 sec, then swarm build
  useEffect(() => {
    // 0.5s: 404 shows -> start zooming into black
    const timer1 = setTimeout(() => {
      setPhase("ZOOM_BLACK");
    }, 500);

    // 1.0s: 404 has overcovered in black -> swarm of agents arrives from all directions
    const timer2 = setTimeout(() => {
      setPhase("SWARM_BUILD");
    }, 1000);

    // Stream agent logs during swarm build
    const logTimers = [
      setTimeout(() => setLogs((prev) => [...prev, "[AGENT-01] Intercepting 404... Multi-Agent Swarm Deployed"]), 1100),
      setTimeout(() => setLogs((prev) => [...prev, "[AGENT-02] Establishing Spring Boot Microservices Mesh"]), 1400),
      setTimeout(() => setLogs((prev) => [...prev, "[AGENT-03] Linking TiDB Cloud Serverless (auth_db & app_db)"]), 1700),
      setTimeout(() => setLogs((prev) => [...prev, "[AGENT-04] Mounting Linux sysfs Real-Time Telemetry Bridge"]), 2000),
      setTimeout(() => setLogs((prev) => [...prev, "[AGENT-05] Reconstructing React Single-Page Architecture"]), 2300),
      setTimeout(() => setLogs((prev) => [...prev, "[SWARM] System Built Successfully (100%). Launching..."]), 2600),
    ];

    // Finish building at 3.0s
    const timer3 = setTimeout(() => {
      setPhase("FINISHED");
      if (onComplete) onComplete();
    }, 3100);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPhase("FINISHED");
        if (onComplete) onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      logTimers.forEach(clearTimeout);
      window.removeEventListener("keydown", handleKeyDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  // Particle Swarm Canvas Animation
  useEffect(() => {
    if (phase !== "SWARM_BUILD") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate agents coming from all 4 boundaries (top, bottom, left, right)
    const agentCount = 65;
    const agents = [];

    for (let i = 0; i < agentCount; i++) {
      let x, y;
      const side = i % 4;
      if (side === 0) {
        // Top
        x = Math.random() * width;
        y = -20;
      } else if (side === 1) {
        // Bottom
        x = Math.random() * width;
        y = height + 20;
      } else if (side === 2) {
        // Left
        x = -20;
        y = Math.random() * height;
      } else {
        // Right
        x = width + 20;
        y = Math.random() * height;
      }

      // Target somewhere near center grid
      const targetX = width * 0.15 + Math.random() * (width * 0.7);
      const targetY = height * 0.15 + Math.random() * (height * 0.7);

      agents.push({
        x,
        y,
        targetX,
        targetY,
        vx: (targetX - x) * 0.035 + (Math.random() - 0.5) * 2,
        vy: (targetY - y) * 0.035 + (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 2,
        color: i % 3 === 0 ? "#38bdf8" : i % 3 === 1 ? "#818cf8" : "#34d399",
        trail: [],
        connected: false,
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Draw cyber grid
      ctx.strokeStyle = "rgba(56, 189, 248, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Update and draw agents
      agents.forEach((agent, idx) => {
        // Move toward target
        const dx = agent.targetX - agent.x;
        const dy = agent.targetY - agent.y;
        agent.vx += dx * 0.002;
        agent.vy += dy * 0.002;
        agent.vx *= 0.94;
        agent.vy *= 0.94;

        agent.x += agent.vx;
        agent.y += agent.vy;

        // Keep trail
        agent.trail.push({ x: agent.x, y: agent.y });
        if (agent.trail.length > 8) agent.trail.shift();

        // Draw trail
        ctx.strokeStyle = agent.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let t = 0; t < agent.trail.length; t++) {
          const pt = agent.trail[t];
          if (t === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Draw agent head / drone node
        ctx.fillStyle = agent.color;
        ctx.shadowColor = agent.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, agent.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw inter-agent construction beam
        for (let j = idx + 1; j < agents.length; j++) {
          const other = agents[j];
          const dist = Math.hypot(other.x - agent.x, other.y - agent.y);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(agent.x, agent.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase]);

  if (phase === "FINISHED") return null;

  return (
    <div className={`swarm-intro-container ${phase.toLowerCase()}`}>
      {/* Skip button */}
      <button
        className="skip-intro-btn"
        onClick={() => {
          setPhase("FINISHED");
          if (onComplete) onComplete();
        }}
      >
        <FiFastForward className="me-1" /> Skip Intro [ESC]
      </button>

      {/* 404 Stage: Big 404 that zooms and overcovers to black */}
      {(phase === "SHOW_404" || phase === "ZOOM_BLACK") && (
        <div className={`big-404-wrapper ${phase === "ZOOM_BLACK" ? "zoom-overcover" : ""}`}>
          <div className="glitch-404" data-text="404">
            404
          </div>
          <div className="glitch-subtext">
            <span className="error-badge">ERROR</span>
            <span>ARCHITECTURE NOT FOUND</span>
          </div>
          <div className="terminal-status-line">
            <span className="cursor-blink">_</span>
          </div>
        </div>
      )}

      {/* Swarm Stage: Canvas and HUD Logs */}
      {phase === "SWARM_BUILD" && (
        <>
          <canvas ref={canvasRef} className="swarm-canvas" />

          <div className="swarm-hud-overlay">
            <div className="swarm-header-badge">
              <FiCpu className="spin-icon text-cyan me-2" />
              <span>AUTONOMOUS MULTI-AGENT SWARM INITIATED</span>
            </div>

            <div className="swarm-construction-title">
              <h2>Building Srikanth's Systems Architecture...</h2>
              <div className="progress-bar-swarm">
                <div className="progress-fill"></div>
              </div>
            </div>

            {/* Terminal Agent Logs */}
            <div className="swarm-terminal-logs">
              <div className="terminal-topbar">
                <FiTerminal className="me-1" />
                <span>agent-orchestrator.log</span>
              </div>
              <div className="terminal-body">
                {logs.map((log, index) => (
                  <div key={index} className="log-line">
                    <span className="log-bullet">&gt;</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
