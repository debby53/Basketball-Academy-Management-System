ARG NODE_ENV=production

# Development stage
FROM node:20 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20 AS production

WORKDIR /app

COPY package*.json ./
# Install a lightweight static server globally
RUN npm install -g serve && npm ci --omit=dev

COPY . .
COPY --from=build /app/dist ./dist

EXPOSE 5173

ENV NODE_ENV=production

# Serve the built static files on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
