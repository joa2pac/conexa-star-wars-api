#!/bin/bash

# Version 2.0.0.
# AWS environment variables (required for the AWS CLI)
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_REGION=us-east-1
export EXTRA_CORS_ALLOWED_ORIGINS=*
export EXTRA_CORS_ALLOWED_HEADERS=*

# Set up AWS CLI configuration
echo "Configuring AWS CLI..."
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set default.region $AWS_DEFAULT_REGION

# Stop and remove all Docker containers, networks, and volumes associated with LocalStack
echo "Skipping Docker Compose management as LocalStack is managed externally..."

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
sleep 20 # Adjust as needed

# ===============================
# Set up DynamoDB Tables
# ===============================
# Create DynamoDB Table for Movies with UUID 'movieId' as the primary key (HASH)
echo "Creating DynamoDB table 'movies'..."
AWS_REGION=us-east-1 AWS_PAGER="" aws dynamodb create-table \
  --endpoint-url=http://localstack:4566 \
  --table-name movies \
  --attribute-definitions \
  AttributeName=movieId,AttributeType=S \
  --key-schema \
  AttributeName=movieId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 \
  --tags Key=Owner,Value=movies

# Create DynamoDB Table for Movie Details with UUID 'movieDetailId' as the primary key (HASH)
echo "Creating DynamoDB table 'movie_details'..."
AWS_REGION=us-east-1 AWS_PAGER="" aws dynamodb create-table \
  --endpoint-url=http://localstack:4566 \
  --table-name movie_details \
  --attribute-definitions \
  AttributeName=movieDetailId,AttributeType=S \
  --key-schema \
  AttributeName=movieDetailId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=10,WriteCapacityUnits=10 \
  --tags Key=Owner,Value=movie_details

# Load Data into DynamoDB (Movies)
echo "Inserting data into the 'movies' table..."
AWS_REGION=us-east-1 AWS_PAGER="" aws dynamodb batch-write-item \
  --request-items file://dynamo/movies_dynamo.json \
  --endpoint-url http://localstack:4566

# Load Data into DynamoDB (Movie Details)
echo "Inserting data into the 'movie_details' table..."
AWS_REGION=us-east-1 AWS_PAGER="" aws dynamodb batch-write-item \
  --request-items file://dynamo/movie_details_dynamo.json \
  --endpoint-url http://localstack:4566

# ===============================
# S3 Bucket Setup
# ===============================
# Create S3 Bucket for storage
echo "Creating S3 bucket 'movie-assets'..."
awslocal s3 mb s3://movie-assets --endpoint-url=http://localstack:4566

# Add CORS policy for the S3 bucket
echo "Adding CORS policy to 'movie-assets' bucket..."
awslocal s3api put-bucket-cors --bucket movie-assets --cors-configuration '{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
            "AllowedOrigins": ["http://localhost:3000"],
            "ExposeHeaders": ["ETag"],
            "MaxAgeSeconds": 3000
        }
    ]
}' --endpoint-url=http://localstack:4566

# ===============================
# Cognito Setup and User Sign Up
# ===============================

# Step 1: Create a Cognito User Pool
echo "Creating Cognito user pool..."
awslocal cognito-idp create-user-pool --pool-name p1 --user-pool-tags "_custom_id_=us-east-1_myid123" --endpoint-url http://localstack:4566

# Step 2: Create a Cognito User Pool Client
echo "Creating Cognito user pool client..."
awslocal cognito-idp create-user-pool-client --user-pool-id us-east-1_myid123 --client-name _custom_id_:myclient123 --endpoint-url http://localstack:4566

# Step 3: Update the Cognito User Pool Client for OAuth
echo "Updating Cognito user pool client with OAuth settings..."
awslocal cognito-idp update-user-pool-client \
  --user-pool-id us-east-1_myid123 \
  --client-id myclient123 \
  --allowed-o-auth-flows "code" \
  --allowed-o-auth-scopes "openid" "profile" "email" \
  --supported-identity-providers "COGNITO" \
  --callback-urls '["http://localhost:3000/api/oauth2-redirect.html"]' \
  --logout-urls '["http://localhost:3000/logout"]' \
  --endpoint-url http://localstack:4566

# Step 4: Create Cognito Groups for Roles
echo "Creating Cognito groups for 'admin' and 'users'..."
awslocal cognito-idp create-group --group-name admin --user-pool-id us-east-1_myid123 --description "Admin group" --endpoint-url http://localstack:4566
awslocal cognito-idp create-group --group-name users --user-pool-id us-east-1_myid123 --description "Users group" --endpoint-url http://localstack:4566

# Step 5: Sign up a test user with email attribute
echo "Signing up user 'testuser1' with email..."
awslocal cognito-idp sign-up --client-id myclient123 --username testuser1 --password Password12345! \
  --user-attributes Name=email,Value=testuser1@example.com \
  --endpoint-url http://localstack:4566

# Step 6: Confirm the test user's sign-up
echo "Confirming user 'testuser1' sign-up..."
awslocal cognito-idp admin-confirm-sign-up --username testuser1 --user-pool-id "us-east-1_myid123" --endpoint-url http://localstack:4566

# Step 7: Add the user to the 'users' group
echo "Adding 'testuser1' to the 'users' group..."
awslocal cognito-idp admin-add-user-to-group --user-pool-id us-east-1_myid123 --username testuser1 --group-name admin --endpoint-url http://localstack:4566

# Step 8: Initiate authentication and obtain the Access Token
echo "Initiating authentication to obtain Access Token..."

# Use the existing auth.json file (ensure this file exists and contains valid credentials)
response=$(awslocal cognito-idp admin-initiate-auth --region us-east-1 --cli-input-json file://auth.json --endpoint-url http://localstack:4566)

# Parse and return the Access Token to the user
access_token=$(echo $response | jq -r '.AuthenticationResult.AccessToken')

if [[ -z "$access_token" ]]; then
  echo "Failed to get Access Token."
else
  echo "Access Token: $access_token"
fi

echo "Setup complete."
