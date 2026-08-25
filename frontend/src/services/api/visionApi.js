const API_BASE_URL = "http://127.0.0.1:8000";

export async function getVisionStatus() {
  const response = await fetch(
    `${API_BASE_URL}/vision/status`
  );

  if (!response.ok) {
    throw new Error("Vision status request failed");
  }

  return response.json();
}

export async function getVisionPipeline() {
  const response = await fetch(
    `${API_BASE_URL}/vision/pipeline`
  );

  if (!response.ok) {
    throw new Error("Vision pipeline request failed");
  }

  return response.json();
}