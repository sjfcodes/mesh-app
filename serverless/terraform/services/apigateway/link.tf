# # # # # # #
# RESOURCES #
# # # # # # #

# [/link]
module "link" {
  # constant
  source = "./resource"
  api_id = aws_api_gateway_rest_api.this.id

  # variable
  parent_id = aws_api_gateway_rest_api.this.root_resource_id
  path_part = "link"
}

# [/link/token_create][POST]
module "token_create" {
  # constant
  source        = "./resource_method"
  api_id        = aws_api_gateway_rest_api.this.id
  authorizer_id = aws_api_gateway_authorizer.this.id

  # variable
  parent_id         = module.link.id
  path_part         = "token_create"
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}