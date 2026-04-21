# Build stage
FROM node:20-alpine AS build
WORKDIR /src
RUN npm install -g pnpm@10
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @luxbank/brand build
RUN cd app/site && STATIC_EXPORT=1 pnpm build

# Runtime stage
FROM ghcr.io/hanzoai/spa:latest
COPY --from=build /src/app/site/out /public
ENV PORT=3000
ENV ROOT=/public
EXPOSE 3000
