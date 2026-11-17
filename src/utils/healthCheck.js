/**
 * Direct Microservice Health Check Utility
 * Calls both backend microservices (go-seek-backend and auth-service)
 * to wake up Render containers and verify connectivity.
 */

const GO_SEEK_BACKEND_HEALTH = `${import.meta.env.VITE_BACKEND_URL || "https://go-seek-backend.onrender.com"}/api/health`;
const AUTH_SERVICE_HEALTH = "https://auth-service-v3f4.onrender.com/api/health";

export async function pingMicroservices() {
  const ping = async (name, url) => {
    const start = Date.now();
    try {
      const res = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
      });
      const data = await res.json().catch(() => null);
      const elapsed = Date.now() - start;
      console.log(`[HealthCheck] ${name} (${url}) status ${res.status} in ${elapsed}ms:`, data);
      return { name, ok: res.ok, status: res.status, data, elapsed };
    } catch (err) {
      console.warn(`[HealthCheck] ${name} connecting (${url}):`, err.message);
      return { name, ok: false, error: err.message };
    }
  };

  // Directly trigger health check APIs to both microservices in parallel
  return Promise.all([
    ping("go-seek-backend", GO_SEEK_BACKEND_HEALTH),
    ping("auth-service", AUTH_SERVICE_HEALTH),
  ]);
}
