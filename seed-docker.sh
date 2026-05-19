#!/bin/bash
# Script to rebuild Docker containers and seed the database

echo "Stopping existing containers..."
docker compose down

echo "Rebuilding containers..."
docker compose up --build -d

echo "Waiting for services to be ready..."
sleep 10

echo "Seeding database..."
docker compose exec server npm run seed --workspace server

echo "Done! Dashboard available at http://localhost:5173"
