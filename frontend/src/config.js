/**
 * Frontend configuration
 *
 * Central configuration for API and WebSocket endpoints.
 * Uses Vite environment variables in production, falls back to localhost
 * values for local development.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const OAUTH_URL = import.meta.env.VITE_OAUTH_URL || 'http://localhost:5000';

export { API_BASE_URL, SOCKET_URL, OAUTH_URL };
