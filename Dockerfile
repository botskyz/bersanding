# Production container for this app — a single Next.js web service.
# `deps` installs dependencies, `build` compiles with `next build`, and the
# `runtime` stage serves it with `next start` on port 8082.
#
# The CMD deliberately does NOT migrate. Schema changes are applied out of band
# by POSTing to /api/admin/migrate with the MIGRATE_SECRET header. Migrating in
# the serving CMD meant every cold start on a scale-to-zero host paid for a
# schema diff, a momentary database failure stopped the app from booting at all,
# and simultaneous cold starts raced each other applying DDL.
#
# This app uses PostgreSQL. This image does NOT bundle a database — supply a
# reachable Postgres connection string via the DATABASE_URL env var at run time
# (e.g. a managed Postgres, or a `postgres` service in your compose file).
#
# Keep this in sync with package.json: if the start port, build/start scripts,
# system packages, or required runtime files change, update this file too.

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-slim AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8082
ENV DATABASE_URL=postgres://postgres@127.0.0.1:5432/app
COPY --from=build /app ./
EXPOSE 8082
CMD ["npm", "start"]
