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

module "dynamodb_table_users" {
  env      = var.env
  app_name = var.app_name
  source   = "./dynamodb/table/users"
}

module "dynamodb_table_transactions" {
  env      = var.env
  app_name = var.app_name
  source   = "./dynamodb/table/transactions"
}

module "lambda_plaid" {
  env    = var.env
  source = "./lambda/plaid"
  table_transactions_name = module.dynamodb_table_transactions.table_name
  table_users_name = module.dynamodb_table_users.table_name
}

module "apigateway" {
  env        = var.env
  region     = var.region
  account_id = var.account_id
  source     = "./apigateway"

  lambda_plaid_function_name = module.lambda_plaid.function_name
  lambda_plaid_invoke_arn    = module.lambda_plaid.invoke_arn
}

output "apigw_resource_id" {
  value = "https://${module.apigateway.apigw_resource_id}.execute-api.us-east-1.amazonaws.com"
}
