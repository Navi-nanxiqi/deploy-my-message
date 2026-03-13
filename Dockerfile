FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist /app/dist
COPY --from=build /app/src/web/dist /app/src/web/dist
EXPOSE 3000
CMD ["node","dist/main.js"]