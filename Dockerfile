FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy application code
COPY . .

# Expose server port
EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["npm", "start"]
