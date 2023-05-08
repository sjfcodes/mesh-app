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

# [/link]
module "link" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = var.parent_id
  path_part = "link"
}

# [/link/token_create]
module "link_tokenCreate" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.link.id
  path_part = "token_create"
}

# [/link/token_create][POST]
module "link_tokenCreate_POST" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.link_tokenCreate.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/update_login][CORS OPTIONS]
module "link_tokenCreate_CORS" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id        = var.api_id
  api_resource_id = module.link_tokenCreate.id
}

# # # # # #
# OUTPUTS #
# # # # # #
output "link_tokenCreate_POST" {
  value = module.link_tokenCreate_POST
}
output "link_tokenCreate_CORS" {
  value = module.link_tokenCreate_CORS
}