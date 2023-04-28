# inputs
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "api_id" {}
variable "parent_id" {}
variable "resource_name" {}
variable "http_method" {}

variable "cognito_user_pool_name" {
  default = "mesh-app"
}

module "lambda" {
  source = "../../../lambdas/plaid"

  env = var.env
}

# resources

resource "aws_api_gateway_resource" "this" {
  rest_api_id = var.api_id
  parent_id   = var.parent_id
  path_part   = var.resource_name
}

data "aws_cognito_user_pools" "this" {
  name = var.cognito_user_pool_name
}

resource "aws_api_gateway_authorizer" "this" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = var.api_id
  provider_arns = data.aws_cognito_user_pools.this.arns
}

resource "aws_api_gateway_method" "this" {
  rest_api_id   = var.api_id
  resource_id   = aws_api_gateway_resource.this.id
  http_method   = var.http_method
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.this.id

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

# Lambda
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-module.api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/*/${aws_api_gateway_method.this.http_method}${aws_api_gateway_resource.this.path}"
}

resource "aws_api_gateway_integration" "this" {
  rest_api_id             = var.api_id
  resource_id             = aws_api_gateway_resource.this.id
  http_method             = aws_api_gateway_method.this.http_method
  integration_http_method = aws_api_gateway_method.this.http_method
  type                    = "AWS_PROXY"
  uri                     = module.lambda.invoke_arn
}

# outputs
