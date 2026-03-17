FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src/web/package.json src/web/package-lock.json ./src/web/
RUN npm install --prefix src/web

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/web/dist ./src/web/dist
EXPOSE 3000
CMD ["node","dist/main.js"]
