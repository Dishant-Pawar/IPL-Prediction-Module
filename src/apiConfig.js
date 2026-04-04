// In Vercel, the API and Frontend are on the same domain, so we use relative paths.
// For local development, Vite handles the proxy to localhost:5000 via vite.config.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
