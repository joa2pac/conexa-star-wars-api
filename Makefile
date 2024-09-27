# Define the Docker Compose file
DOCKER_COMPOSE_FILE=docker-compose.yml

# The setup script
SETUP_SCRIPT=./setup-local-env.sh

# Run the setup-local-env script
start-localstack:
	@echo "Starting LocalStack and setting up AWS resources..."
	$(SETUP_SCRIPT)

# Stop and remove Docker containers, images, and volumes
stop-all-docker:
	@echo "Stopping and removing all Docker containers, images, and volumes..."
	docker stop $$(docker ps -aq) || true
	docker rm $$(docker ps -aq) || true
	docker rmi $$(docker images -q) || true
	docker volume rm $$(docker volume ls -q) || true
	@echo "All Docker containers, images, and volumes have been cleaned up."

# Rebuild Docker images
rebuild-docker:
	@echo "Rebuilding Docker images without cache..."
	docker-compose build --no-cache

# Fetch a new access token
get-new-token:
	@echo "Fetching a new access token from the logs..."
	@./get-new-token.sh

# Full reset: Stop, clean, rebuild, and get new token
reset-localstack:
	@echo "Resetting the LocalStack environment..."
	make stop-all-docker
	make rebuild-docker
	make start-localstack
	@echo "LocalStack environment reset complete. If you need a new token, use 'make get-new-token'."

.PHONY: start-localstack stop-all-docker rebuild-docker get-new-token reset-localstack
