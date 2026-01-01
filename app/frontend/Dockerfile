# ======================================================
# Stage 1: Build Stage
# ======================================================
FROM node:24-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency definition files first this improves Docker layer caching
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Environment variable for Vite build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the react application
RUN npm run build


# ======================================================
# Stage 2: Serve Stage (Nginx)
# ======================================================
FROM nginx:1.28-alpine

# Copy build artifacts (Vite uses 'dist' by default), from the build stage to Nginx's default web directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config for React Router support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground mode, Required for Docker containers to keep running
CMD ["nginx", "-g", "daemon off;"]
