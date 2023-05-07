# # # # # # #
# RESOURCES #
# # # # # # #

# [/item/update_login]
module "item_updateLogin" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "update_login"
}

# [/item/update_login][PUT]
module "item_updateLogin_PUT" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_updateLogin.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/update_login][CORS OPTIONS]
module "item_updateLogin_CORS" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id        = var.api_id
  api_resource_id = module.item_updateLogin.id
}

# # # # # #
# OUTPUTS #
# # # # # #

output "item_updateLogin_PUT" {
  value = module.item_updateLogin_PUT
}
output "item_updateLogin_CORS" {
  value = module.item_updateLogin_CORS
}