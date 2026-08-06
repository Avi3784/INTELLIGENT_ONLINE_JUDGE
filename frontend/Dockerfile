# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:5000/api
ARG VITE_BACKEND_URL=http://localhost:5000
ARG VITE_SOCKET_URL=http://localhost:5000
ARG VITE_OAUTH_URL=http://localhost:5000

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
ENV VITE_OAUTH_URL=${VITE_OAUTH_URL}

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
