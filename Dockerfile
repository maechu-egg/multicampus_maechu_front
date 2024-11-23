# Use the official Node.js image as a base
FROM cloudtype/node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and lock files
COPY ./package*.json ./
COPY ./yarn.lock ./

# Install dependencies
RUN echo "use npmjs.org registry" \
    && if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --force; \
    elif [ -f pnpm-lock.yaml ]; then pnpm i --frozen-lockfile; \
    elif [ -f package.json ]; then yarn; fi

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use Nginx to serve the application
FROM nginx:1.20-alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
