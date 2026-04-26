#!/bin/sh

# Create the data directory if it doesn't exist
mkdir -p /app/data

# Run migrations
npx prisma db push

# Start the application
node server.js
