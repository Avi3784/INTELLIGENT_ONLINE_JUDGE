FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
