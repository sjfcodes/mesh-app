
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  # Adding Backend as S3 for Remote State Storage
  backend "s3" {
    profile        = "deployer-creator"
    bucket         = "mesh-app-tfstate"
    key            = "dev/deployer/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "deployer-creator-tfstate-lock"
  }
}

# Configure the AWS Provider
provider "aws" {
  region  = "us-east-1"
  profile = "deployer-creator"
}

resource "aws_iam_role" "test_mesh_app_deployer" {
  name               = "test-mesh-app-deployer"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json # (not shown)
  managed_policy_arns = [
    aws_iam_policy.test_mesh_app_deployer_dynamodb.arn,
    aws_iam_policy.test_mesh_app_deployer_iam.arn,
    aws_iam_policy.test_mesh_app_deployer_lambda.arn,
    aws_iam_policy.test_mesh_app_deployer_s3.arn
  ]
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_policy" "test_mesh_app_deployer_dynamodb" {
  description = "mesh app deployer dynamodb permissions"
  name        = "test-mesh-app-deployer-dynamodb"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:us-east-1:118185547444:table/mesh-app-tfstate-lock"
      },
    ]
  })
}

resource "aws_iam_policy" "test_mesh_app_deployer_iam" {
  description = "mesh app deployer iam permissions"
  name        = "test-mesh-app-deployer-iam"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:CreateRole",
          "iam:GetRole",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:DeleteRole",
          "iam:PassRole"
        ]
        Resource = "arn:aws:iam::118185547444:role/iam_role_lambda"
      },
    ]
  })
}

resource "aws_iam_policy" "test_mesh_app_deployer_lambda" {
  description = "mesh app deployer lambda permissions"
  name        = "test-mesh-app-deployer-lambda"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "lambda:CreateFunction",
          "lambda:ListVersionsByFunction",
          "lambda:GetFunction",
          "lambda:DeleteFunction",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration"
        ],
        Resource = "arn:aws:lambda:us-east-1:118185547444:function:test-crudPlaid"
      }
    ]
  })
}

resource "aws_iam_policy" "test_mesh_app_deployer_s3" {
  description = "mesh app deployer s3 permissions"
  name        = "test-mesh-app-deployer-s3"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = "s3:ListBucket",
        Resource = "arn:aws:s3:::mesh-app-tfstate"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Resource = "arn:aws:s3:::mesh-app-tfstate/dev/*"
      }
    ]
  })
}
