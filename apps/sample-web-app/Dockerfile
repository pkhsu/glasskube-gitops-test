# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install --only=production

# Bundle app source
COPY . .

# Use a smaller base image for the final stage
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy installed dependencies and source code from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/index.js ./index.js

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable (optional, can be overridden)
ENV NODE_ENV production

# Run the app when the container launches
CMD [ "node", "index.js" ]
