
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  # Adding Backend as S3 for Remote State Storage
  backend "s3" {
    profile = "deployer-creator"
    bucket  = "mesh-app-tfstate"
    key     = "dev/deployer/terraform.tfstate"
    region  = "us-east-1"
    # Enable during Step-09     
    # For State Locking
    dynamodb_table = "deployer-creator-tfstate-lock"
  }
}

# Configure the AWS Provider
provider "aws" {
  region  = "us-east-1"
  profile = "deployer-creator"
}

resource "aws_iam_policy" "test_mesh_app_deployer_dynamodb" {
  name        = "test-mesh-app-deployer-dynamodb"
  path        = "/"
  description = "mesh app deployer dynamodb parmissions"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
                "dynamodb:DescribeTable",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:DeleteItem"
        ]
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:*:*:table/mesh-app-tfstate-lock"
      },
    ]
  })
}

# resource "aws_iam_role" "test_mesh_app_deployer" {
#   name               = "test-mesh-app-deployer"
#   assume_role_policy = data.aws_iam_policy_document.dynamo_db.json
# }

# data "aws_iam_policy_document" "dynamo_db" {
#   statement {
#     actions = [
#       "dynamodb:DescribeTable",
#       "dynamodb:GetItem",
#       "dynamodb:PutItem",
#       "dynamodb:DeleteItem"
#     ]

#     resources = [
#       "arn:aws:dynamodb:*:*:table/mesh-app-tfstate-lock"
#     ]
#   }

# }
