// This config detects if you are in development or production on Vercel.
const isProduction = import.meta.env.PROD;

// In a Vercel Monorepo, the endpoint is local to the same domain.
// If you've manually set VITE_API_URL, we use that.
// Otherwise, in production we use '' (for same-domain calls), and in dev we use localhost:5000.
export const API_BASE_URL = import.meta.env.VITE_API_URL || (isProduction ? '' : 'http://localhost:5000');

console.log(`[IPL Matrix] Targeted API Base: ${API_BASE_URL || '(Same Domain)'}`);
