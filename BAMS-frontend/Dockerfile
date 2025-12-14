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
RUN npm ci --only=production

COPY . .
COPY --from=build /app/dist ./dist

EXPOSE 5173

ENV NODE_ENV=production

CMD ["npm", "run", "preview", "--", "--host"]
