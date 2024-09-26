# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Expose port 3000 (default for React)
EXPOSE 3000

# Start the React application
CMD ["sh", "-c", "npm install && npm start"]
