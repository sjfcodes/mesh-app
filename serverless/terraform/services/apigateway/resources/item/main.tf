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

# [/item]
module "item" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = var.parent_id
  path_part = "item"
}

# [/item][GET]
module "item_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item][CORS OPTIONS]
module "item_CORS" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id        = var.api_id
  api_resource_id = module.item.id
}

# # # # # #
# OUTPUTS #
# # # # # #
output "item_GET" {
  value = module.item_GET
}
output "item_CORS" {
  value = module.item_CORS
}
