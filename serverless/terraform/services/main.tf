# DOCS: https://developer.hashicorp.com/terraform/language
# setting env variable

variable "PLAID_CLIENT_ID" {
  sensitive = true
}
variable "PLAID_ENV" {
  sensitive = true
}
variable "PLAID_SECRET_DEVELOPMENT" {
  sensitive = true
}
variable "PLAID_SECRET_SANDBOX" {
  sensitive = true
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
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "mesh-app_tfstate_lock"
  }
}

provider "aws" {
  region  = "us-east-1"
  profile = "mesh-app_terraform_deployer"
}

module "dynamodb_table_users" {
  env      = terraform.workspace
  app_name = var.app_name
  source   = "./dynamodb/table/users"
}

module "dynamodb_table_transactions" {
  env      = terraform.workspace
  app_name = var.app_name
  source   = "./dynamodb/table/transactions"
}

module "lambda_plaid" {
  env                     = terraform.workspace
  region                  = var.region
  account_id              = var.account_id
  source                  = "./lambda"
  table_transactions_name = module.dynamodb_table_transactions.table_name
  table_users_name        = module.dynamodb_table_users.table_name

  lambda_name = "plaid"

  PLAID_CLIENT_ID          = var.PLAID_CLIENT_ID
  PLAID_ENV                = var.PLAID_ENV
  PLAID_SECRET_DEVELOPMENT = var.PLAID_SECRET_DEVELOPMENT
  PLAID_SECRET_SANDBOX     = var.PLAID_SECRET_SANDBOX
}

module "lambda_ddbTable" {
  env                     = terraform.workspace
  region                  = var.region
  account_id              = var.account_id
  source                  = "./lambda"
  table_transactions_name = module.dynamodb_table_transactions.table_name
  table_users_name        = module.dynamodb_table_users.table_name

  lambda_name = "ddbTable"

  PLAID_CLIENT_ID          = ""
  PLAID_ENV                = ""
  PLAID_SECRET_DEVELOPMENT = ""
  PLAID_SECRET_SANDBOX     = ""
}

module "apigateway" {
  env        = terraform.workspace
  region     = var.region
  account_id = var.account_id
  source     = "./apigateway"

  lambda_plaid_function_name    = module.lambda_plaid.function_name
  lambda_plaid_invoke_arn       = module.lambda_plaid.invoke_arn
  lambda_ddbTable_function_name = module.lambda_ddbTable.function_name
  lambda_ddbTable_invoke_arn    = module.lambda_ddbTable.invoke_arn
}

output "apigw_resource_id" {
  value = "https://${module.apigateway.apigw_resource_id}.execute-api.us-east-1.amazonaws.com"
}
