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

# [/link/tokenCreate]
module "link_tokenCreate" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.link.id
  path_part = "token_create"
}

# [/link/tokenCreate][POST]
module "link_tokenCreate_POST" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.link_tokenCreate.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# # # # # #
# OUTPUTS #
# # # # # #
output "link_tokenCreate_POST" {
  value = module.link_tokenCreate_POST
}