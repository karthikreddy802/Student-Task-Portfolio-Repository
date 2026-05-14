# Use Node image
FROM node:20-slim

# Set work directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy project
COPY . /app/

# Expose port 5173
EXPOSE 5173:80

# Start development server
CMD ["npm", "run", "dev", "--", "--host"]
