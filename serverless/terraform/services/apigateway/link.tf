# # # # # # #
# RESOURCES #
# # # # # # #

# [/link]
module "link" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = aws_api_gateway_rest_api.this.root_resource_id
  path_part = "link"
}

# [/link/token_create]
module "link_token_create" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.link.id
  path_part = "token_create"
}

# [/link/token_create][POST]
module "link_token_create_post" {
  source        = "./method"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.link_token_create.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}
