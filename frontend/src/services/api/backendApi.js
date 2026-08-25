const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint) {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`
  );

  if (!response.ok) {
    throw new Error(
      `Backend request failed: ${response.status}`
    );
  }

  return response.json();
}


// =========================================================
// HEALTH
// =========================================================

export async function getHealth() {
  return request("/health");
}


// =========================================================
// VISION STATUS
// =========================================================

export async function getVisionStatus() {
  return request("/vision/status");
}


// =========================================================
// VISION PIPELINE
// =========================================================

export async function getVisionPipeline() {
  return request("/vision/pipeline");
}


// =========================================================
// HAND TRACKING STATUS
// =========================================================

export async function getHandTrackingStatus() {
  return request("/vision/hands/status");
}


// =========================================================
// DASHBOARD METRICS
// =========================================================

export async function getDashboardStatus() {
  return request("/dashboard/status");
}


// =========================================================
// COMPLETE BACKEND STATUS
// =========================================================

export async function getBackendStatus() {
  const [
    health,
    vision,
    pipeline,
    handTracking,
    dashboard,
  ] = await Promise.all([
    getHealth(),
    getVisionStatus(),
    getVisionPipeline(),
    getHandTrackingStatus(),
    getDashboardStatus(),
  ]);

  return {
    health,
    vision,
    pipeline,
    handTracking,
    dashboard,
  };
}