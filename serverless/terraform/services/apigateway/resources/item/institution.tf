# # # # # # #
# RESOURCES #
# # # # # # #

# [/item/institution]
module "item_institution" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "institution"
}

# [/item/institution][GET]
module "item_institution_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_institution.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/institution][CORS OPTIONS]
module "item_institution_CORS" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id        = var.api_id
  api_resource_id = module.item_institution.id
}

# # # # # #
# OUTPUTS #
# # # # # #

output "item_institution_GET" {
  value = module.item_institution_GET
}
output "item_institution_CORS" {
  value = module.item_institution_CORS
}