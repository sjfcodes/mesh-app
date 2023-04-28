# inputs
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "api_id" {}
variable "parent_id" {}
variable "path_part" {}
variable "child_path_part" {}
variable "child_http_method" {}

# resources

# /<resource>
resource "aws_api_gateway_resource" "this" {
  rest_api_id = var.api_id
  parent_id   = var.parent_id
  path_part   = var.path_part
}

# /<resource>/<resource-method>
module "this" {
  source = "../method-plaid"

  env        = var.env
  region     = var.region
  account_id = var.account_id

  api_id      = var.api_id
  parent_id   = aws_api_gateway_resource.this.id
  path_part   = var.child_path_part
  http_method = var.child_http_method
}

# outputs
output "this" {
  value = aws_api_gateway_resource.this
}
