# Use latest stable Node.js version
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json, then install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Install nodemon and ts-node globally for development
RUN npm install -g nodemon ts-node

# Expose port for the application
EXPOSE 3000

# Run the application in development mode using nodemon
CMD ["npm", "run", "dev"]