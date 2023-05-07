# # # # # # #
# RESOURCES #
# # # # # # #

# [/item/tokenExchange]
module "item_tokenExchange" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "token_exchange"
}

# [/item/tokenExchange][POST]
module "item_tokenExchange_POST" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_tokenExchange.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/tokenExchange/mock]
module "item_tokenExchange_mock" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item_tokenExchange.id
  path_part = "mock"
}

# [/item/tokenExchange/mock][POST]
module "item_tokenExchange_mock_POST" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_tokenExchange_mock.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# # # # # #
# OUTPUTS #
# # # # # #

output "item_tokenExchange_POST" {
  value = module.item_tokenExchange_POST
}
output "item_tokenExchange_mock_POST" {
  value = module.item_tokenExchange_mock_POST
}