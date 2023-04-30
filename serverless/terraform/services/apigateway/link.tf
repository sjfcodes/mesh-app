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

# [/link/tokenCreate]
module "link_tokenCreate" {
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  parent_id = module.link.id
  path_part = "token_create"
}

# [/link/tokenCreate][POST]
module "link_tokenCreate_POST" {
  source        = "./method:integration"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  resource_id       = module.link_tokenCreate.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}
