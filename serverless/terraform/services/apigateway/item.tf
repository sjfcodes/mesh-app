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

# [/item/tokenExchange]
module "item_tokenExchange" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.item.id
  path_part = "token_exchange"
}

# [/item/tokenExchange][POST]
module "item_tokenExchange_POST" {
  source        = "./method-integration"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.item_tokenExchange.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}

# [/item/tokenExchange/mock]
module "item_tokenExchange_mock" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.item_tokenExchange.id
  path_part = "mock"
}

# [/item/tokenExchange/mock][POST]
module "item_tokenExchange_mock_POST" {
  source        = "./method-integration"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.item_tokenExchange_mock.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}

# [/item/updateLogin]
module "item_updateLogin" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.item.id
  path_part = "update_login"
}

# [/item/updateLogin][POST]
module "item_updateLogin_PUT" {
  source        = "./method-integration"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.item_updateLogin.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}
