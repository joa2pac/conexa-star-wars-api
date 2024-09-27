# Use node:14-alpine as the base image
FROM node:14-alpine

# Install required dependencies including jq, bash, curl, python3, pip, awscli, and awscli-local
RUN apk --no-cache add bash curl python3 py3-pip jq dos2unix && pip install awscli awscli-local

# Set environment variables for AWS and LocalStack
ENV AWS_ACCESS_KEY_ID=test
ENV AWS_SECRET_ACCESS_KEY=test
ENV AWS_DEFAULT_REGION=us-east-1
ENV AWS_REGION=us-east-1
ENV EXTRA_CORS_ALLOWED_ORIGINS=*
ENV EXTRA_CORS_ALLOWED_HEADERS=*

# Set up the working directory
WORKDIR /app

# Copy all files from the current directory into /app in the container
COPY . .

# Convert line endings and ensure script has executable permissions
RUN chmod +x /app/setup-local-stack.sh

# Debugging: check if the file has correct line endings and permissions
RUN ls -la /app/setup-local-stack.sh

# Define the entrypoint to execute the setup script
ENTRYPOINT ["bash", "/app/setup-local-stack.sh"]
