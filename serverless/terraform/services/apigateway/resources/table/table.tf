# # # # # #
# INPUTS  #
# # # # # #
variable "api_id" {}
variable "parent_id" {}
variable "authorizer_id" {}
variable "lambda_invoke_arn" {}

# # # # # # #
# RESOURCES #
# # # # # # #

# [/table]
module "table" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = var.parent_id
  path_part = "table"
}

# [/table][GET]
module "table_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.table.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# # # # # #
# OUTPUTS #
# # # # # #
output "table_GET" {
  value = module.table_GET
}