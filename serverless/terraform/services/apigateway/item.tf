# # # # # # #
# RESOURCES #
# # # # # # #

# [/item]
module "item" {
  # constant
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  # variable
  parent_id = aws_api_gateway_rest_api.this.root_resource_id
  path_part = "item"
}

# [/item/token_exchange][POST]
module "token_exchange" {
  # constant
  source        = "./resource_method"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  # variable
  parent_id         = module.item.id
  path_part         = "token_exchange"
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}

# [/item/update_login][POST]
module "update_login" {
  # constant
  source        = "./resource_method"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  # variable
  parent_id         = module.item.id
  path_part         = "update_login"
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}