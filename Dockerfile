# Use an official Node.js runtime as a parent image
FROM cypress/factory

# # Install necessary dependencies for Cypress UI mode
# RUN apt-get update \
#     && apt-get install -y \
#         libgtk-3-0 \
#         libnss3 \
#         libasound2 \
#         libgbm1 \
#         xvfb \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json /app


RUN npm install

# # Install Cypress
# RUN npm install cypress --save-dev

# Copy the rest of the application code to the working directory
COPY . .

# Command to run Cypress tests in UI mode
CMD ["npm", "run", "cy:run"]