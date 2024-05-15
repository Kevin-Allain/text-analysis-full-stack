# Use an official Node.js runtime as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# # Update from YouTube tutorial, necessity unsure
# ENV PATH /app/node_modules/.bin:$PATH 

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build the Next.js app
RUN npm run build

# Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

#### Is there any way to make an update when recreating a image?! index.js should look different!
# Seems like it is!

# Define command to run the app
CMD ["npm", "start"]