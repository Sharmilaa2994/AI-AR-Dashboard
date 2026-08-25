const API_BASE_URL = "http://127.0.0.1:8000";

export async function getDashboardStatus() {
  const response = await fetch(
    `${API_BASE_URL}/dashboard/status`
  );

  if (!response.ok) {
    throw new Error(
      `Dashboard API error: ${response.status}`
    );
  }

  return response.json();
}