terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  # Adding Backend as S3 for Remote State Storage
  backend "s3" {
    bucket = "mesh-app-tfstate"
    key    = "dev/lambda/terraform.tfstate"
    region = "us-east-1"
    # Enable during Step-09     
    # For State Locking
    dynamodb_table = "mesh-app-tfstate-lock"
    profile = "mesh-app-deployer"
  }
}
