# ---------- Stage 1: Build the React App ----------
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build the app
COPY . .
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:stable-alpine

# Copy build files from first stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
