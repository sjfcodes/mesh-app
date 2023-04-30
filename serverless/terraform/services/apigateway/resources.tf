# # # # # # #
# RESOURCES #
# # # # # # #

module "link" {
  source = "./resources/link"

  api_id            = aws_api_gateway_rest_api.this.id
  parent_id         = aws_api_gateway_rest_api.this.root_resource_id
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}

module "item" {
  source = "./resources/item"

  api_id            = aws_api_gateway_rest_api.this.id
  parent_id         = aws_api_gateway_rest_api.this.root_resource_id
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = var.lambda_plaid_invoke_arn
}
