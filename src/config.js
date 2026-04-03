// This file detects if you are in production (Vercel) or development (Localhost)
const isProduction = import.meta.env.PROD;

// In Production, it MUST use the VITE_API_URL you set in Vercel.
// In Development, it defaults to localhost:5000.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

if (isProduction && !import.meta.env.VITE_API_URL) {
    console.warn("CRITICAL: VITE_API_URL is missing in Vercel settings. Backend connection will fail!");
}
