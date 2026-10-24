# Alternative to Render: any container host (Koyeb, Fly.io, Cloud Run).
# Build from the REPO ROOT so ../data is included:  docker build -f backend/Dockerfile .
FROM node:24-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend ./backend
COPY data ./data
WORKDIR /app/backend
ENV NODE_ENV=production PORT=4000
EXPOSE 4000
CMD ["npm", "start"]
