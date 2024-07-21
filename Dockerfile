# Use an official Node.js runtime as a parent image
FROM cypress/factory

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json /app

RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Command to run Cypress tests in UI mode  "npx", "cypress", "open"
CMD ["npm", "run", "cy:run"]