# inputs
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "api_id" {}
variable "parent_id" {}

# resources

# /link 
resource "aws_api_gateway_resource" "link" {
  rest_api_id = var.api_id
  parent_id   = var.parent_id
  path_part   = "link"
}

# /link/token_create
module "token_create" {
  source = "../method-plaid"

  env        = var.env
  region     = var.region
  account_id = var.account_id

  api_id        = var.api_id
  parent_id     = aws_api_gateway_resource.link.id
  resource_name = "token_create"
  http_method   = "POST"
}

# outputs
output "link" {
  value = aws_api_gateway_resource.link
}
