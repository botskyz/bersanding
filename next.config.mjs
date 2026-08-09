/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The platform's build and preview own `.next`. A throwaway smoke-test dev
  // server sets NEXT_DIST_DIR so it writes somewhere else — `next dev` wipes and
  // rewrites its dist dir on startup, which would otherwise fail with EBUSY (or
  // corrupt the output) whenever it overlaps a platform build of the same tree.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // The preview runs behind the sandbox proxy/iframe. Allow cross-origin dev
  // requests from the proxy so HMR and asset requests are not rejected.
  allowedDevOrigins: ['*'],
  // The live preview IS a dev server, so Next's dev tools indicator would float
  // over the app the user is looking at and read as part of their product.
  devIndicators: false,
  // postgres-js is a pure-JS driver — keep it external so Next does not try to
  // bundle the database client into the server output.
  serverExternalPackages: ['postgres'],
}

export default nextConfig
