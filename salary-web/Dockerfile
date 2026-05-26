# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only the node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest of the application files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
