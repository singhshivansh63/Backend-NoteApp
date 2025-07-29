# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy rest of the source code
COPY . .

# Build TypeScript (if you're using it)
RUN npm run build

# Expose port and run app
EXPOSE 5000
CMD ["npm", "start"]
