# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /home/harshwardhan/Desktop/Node/NODE

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]