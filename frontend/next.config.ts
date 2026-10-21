import type { NextConfig } from "next";

// Backend requests go through the Next.js origin so session cookies remain
// first-party in browsers that block cross-site cookies.
const backendOrigin = (
  process.env.BACKEND_API_ORIGIN ||
  (process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5050"
    : "https://e-motion-7vds.onrender.com")
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [{
      source: "/backend-api/:path*",
      destination: `${backendOrigin}/:path*`,
    }];
  },
};

export default nextConfig;
