/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    env: {
    KINDE_SITE_URL: process.env.KINDE_SITE_URL ?? `https://repolens.vercel.app`,
    KINDE_POST_LOGOUT_REDIRECT_URL:
      process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? `https://repolens.vercel.app`,
    KINDE_POST_LOGIN_REDIRECT_URL:
      process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? `https://repolens.vercel.app/auth/sync-user-to-db`,
      
  },
    async rewrites() {
        return [
          { source: "/api/auth/:path*", destination: "/api/auth/:path*" },
          { source: "/login/oauth2/:path*", destination: "/login/oauth2/:path*" },
          { source: "/sync-user-to-db", destination: "/sync-user-to-db" },
          { source: "/:path*", destination: "/" },
        ];
      },
};

export default config;
