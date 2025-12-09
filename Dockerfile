# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first for faster caching
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# IMPORTANT: Take the API Key from the build arguments
ARG GEMINI_API_KEY

# Write it to .env.local so Vite can see it during the build
RUN echo "GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Build the React app
RUN npm run build

# 2. Serve Stage
FROM nginx:alpine

# Copy custom configuration (We will create this file next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built artifacts from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port Cloud Run needs
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
