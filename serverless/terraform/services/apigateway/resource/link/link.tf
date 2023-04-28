# inputs
variable "region" {}
variable "accountId" {}
variable "env" {}
variable "api" {}
variable "authorizer" {}

# resources

# /link 
resource "aws_api_gateway_resource" "link" {
  rest_api_id = var.api.id
  parent_id   = var.api.root_resource_id
  path_part   = "link"
}

# /link/token_create
module "token_create" {
  source     = "../token-create"
  env        = var.env
  region     = var.region
  accountId  = var.accountId
  api        = var.api
  parent     = aws_api_gateway_resource.link
  authorizer = var.authorizer
}

# outputs
output "link" {
  value = aws_api_gateway_resource.link
}

output "token_create" {
  value = module.token_create
}
