# # # # # # #
# RESOURCES #
# # # # # # #

# [/item]
module "item" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = aws_api_gateway_rest_api.this.root_resource_id
  path_part = "item"
}

# [/item/token_exchange]
module "item_token_exchange" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.item.id
  path_part = "token_exchange"
}

# [/item/token_exchange][POST]
module "item_token_exchange_post" {
  source        = "./method"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.item_token_exchange.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}

# [/item/token_exchange]
module "item_update_login" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.item.id
  path_part = "update_login"
}

# [/item/update_login][POST]
module "item_update_login_put" {
  source        = "./method"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.item_update_login.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}
