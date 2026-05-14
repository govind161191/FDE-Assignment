/**
 * Centralized Axios client for the Library Management System backend.
 * The base URL can be overridden via REACT_APP_API_URL.
 */
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
