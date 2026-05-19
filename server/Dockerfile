FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install

FROM deps AS build
COPY server ./server
RUN npm run build --workspace server

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --omit=dev --workspace server
# Install tsx for seeding
RUN npm install tsx --workspace server
COPY --from=build /app/server/dist ./server/dist
# Copy source files for seeding
COPY server/src ./server/src
EXPOSE 5000
CMD ["npm", "run", "start", "--workspace", "server"]
