
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    profile        = "deployer-creator"
    bucket         = "mesh-app-tfstate" 
    key            = "dev/deployer/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "deployer-creator-tfstate-lock"
  }
}

provider "aws" {
  region  = local.region
  profile = "deployer-creator"
}

resource "aws_iam_user" "tf_deployer" {
  name = "mesh-app_terraform_deployer"
  path = "/"

  tags = {
    app = "mesh-app"
  }
}
