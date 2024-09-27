
#!/bin/bash

# Step 1: Stop and remove all Docker containers, networks, and volumes
echo "Stopping and removing existing containers, networks, and volumes..."
docker-compose down -v

# Step 2: Rebuild the Docker images without using cache
echo "Building Docker images with no cache..."
docker-compose build --no-cache

# Step 3: Start Docker containers in detached mode
echo "Starting Docker containers in detached mode..."
docker-compose up -d

# Step 4: Poll the logs and wait for the access token
echo "Waiting for the access token to appear in the logs..."

while true; do
  # Fetch the latest logs and search for the access token pattern
  TOKEN=$(docker logs app 2>&1 | grep -oP 'Access Token: \K.*')

  # If the token is found, break the loop
  if [[ ! -z "$TOKEN" ]]; then
    echo "Access Token: $TOKEN"
    break
  fi

  # Wait for a second before checking again
  sleep 1
done

echo "Process complete."
