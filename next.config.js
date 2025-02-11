/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    async rewrites() {
        return [
          // Allow Kinde Auth routes
          { source: "/api/auth/:path*", destination: "/api/auth/:path*" },
          { source: "/login/oauth2/:path*", destination: "/login/oauth2/:path*" },
          // Allow the sync-user-to-db route
          { source: "/sync-user-to-db", destination: "/sync-user-to-db" },
          // Redirect all other paths to `/`
          { source: "/:path*", destination: "/" },
        ];
      },
};

export default config;
