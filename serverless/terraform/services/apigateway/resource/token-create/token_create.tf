# inputs
variable "env" {}
variable "region" {}
variable "accountId" {}
variable "api" {}
variable "parent" {}
variable "authorizer" {}

module "lambda_plaid" {
  source = "../../../lambdas/plaid"
  env    = var.env
}

# resources

# /link/token_create
resource "aws_api_gateway_resource" "token_create" {
  rest_api_id = var.api.id
  parent_id   = var.parent.id
  path_part   = "token_create"
}

# POST: /link/token_create
resource "aws_api_gateway_method" "link_post" {
  rest_api_id   = var.api.id
  resource_id   = aws_api_gateway_resource.token_create.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.authorizer.id

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

# Lambda
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_plaid.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-module.api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.accountId}:${var.api.id}/*/${aws_api_gateway_method.link_post.http_method}${aws_api_gateway_resource.token_create.path}"
}

resource "aws_api_gateway_integration" "this" {
  rest_api_id             = var.api.id
  resource_id             = aws_api_gateway_resource.token_create.id
  http_method             = aws_api_gateway_method.link_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.lambda_plaid.invoke_arn
}

# outputs
output "resource" {
  value = aws_api_gateway_resource.token_create
}

output "method" {
  value = aws_api_gateway_method.link_post
}

output "integration" {
  value = aws_api_gateway_integration.this
}
