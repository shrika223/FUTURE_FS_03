// In dev, CRA proxy forwards /api and /uploads to the backend (see setupProxy.js)
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";
const SERVER_ROOT = process.env.REACT_APP_SERVER_URL || "";

export const API_ENDPOINTS = {
  ORDERS: `${API_BASE_URL}/orders`,
  MENU: `${API_BASE_URL}/menu`,
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_VERIFY: `${API_BASE_URL}/admin/verify`,
  HEALTH: `${API_BASE_URL}/health`
};

export const ADMIN_TOKEN_KEY = "brewhavenAdminToken";
export const OFFLINE_ADMIN_TOKEN_PREFIX = "offline-admin-";

/** Matches backend/.env defaults — used when server is not running */
export const ADMIN_CREDENTIALS = {
  email: "admin@brewhaven.com",
  password: "BrewHaven@2024"
};

export function getServerUrl() {
  return SERVER_ROOT || "";
}

export default API_BASE_URL;