# DOCS: https://developer.hashicorp.com/terraform/language
# setting env variable
variable "env" {
  default = "test"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    profile        = "mesh-app_terraform_deployer"
    bucket         = "mesh-app-tfstate"
    key            = "test/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "test_mesh-app_tfstate_lock"
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "mesh-app_terraform_deployer"
}

module "apigateway" {
  source    = "./apigateway"
  region    = var.region
  account_id = var.account_id
  env       = var.env
}

output "apigw_resource_id" {
  value = "https://${module.apigateway.apigw_resource_id}.execute-api.us-east-1.amazonaws.com"
}
