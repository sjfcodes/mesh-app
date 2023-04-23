# DOCS: https://developer.hashicorp.com/terraform/language
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  # Adding Backend as S3 for Remote State Storage
  backend "s3" {
    profile = "mesh-app-deployer"
    bucket  = "mesh-app-tfstate"
    key     = "dev/lambda/terraform.tfstate"
    region  = "us-east-1"
    # Enable during Step-09     
    # For State Locking
    dynamodb_table = "mesh-app-tfstate-lock"
  }
}

# Configure the AWS Provider
provider "aws" {
  region  = "us-east-1"
  profile = "mesh-app-deployer"
}

module "lambda_crud_plaid" {
  source = "./lambdas/crudPlaid"
}
