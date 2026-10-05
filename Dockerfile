# Multi-stage production image:
# 1) Build the Vite SPA with the API key injected at build time
# 2) Serve the static assets with nginx

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite embeds VITE_* values into the client bundle during `npm run build`.
ARG VITE_OPENWEATHER_API_KEY=your_api_key_here
ARG VITE_USE_MOCK_API=false
ARG VITE_CITIES_REMOTE_URL=

ENV VITE_OPENWEATHER_API_KEY=$VITE_OPENWEATHER_API_KEY \
    VITE_USE_MOCK_API=$VITE_USE_MOCK_API \
    VITE_CITIES_REMOTE_URL=$VITE_CITIES_REMOTE_URL

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
