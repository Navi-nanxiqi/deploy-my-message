FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src/web/package.json src/web/package-lock.json ./src/web/
RUN npm ci --prefix src/web

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/web/dist ./src/web/dist
EXPOSE 3000
CMD ["node","dist/main.js"]
