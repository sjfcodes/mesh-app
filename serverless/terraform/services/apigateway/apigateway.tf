# Variables
variable "myregion" {
  default = "us-east-1"
}

variable "accountId" {
  default = "118185547444"
}

variable "cognito_user_pool_name" {
  default = "mesh-app"
}

data "aws_cognito_user_pools" "this" {
  name = var.cognito_user_pool_name
}

resource "aws_api_gateway_rest_api" "this" {
  name = "test_mesh-app"
}

module "test_lambda" {
  source = "../lambdas/crudPlaid"
}

resource "aws_api_gateway_resource" "path1" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "path1"
}

resource "aws_api_gateway_authorizer" "this" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  provider_arns = data.aws_cognito_user_pools.this.arns
}

resource "aws_api_gateway_method" "path1_get" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.path1.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.this.id

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_method" "path1_post" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.path1.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.this.id

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.path1.id
  http_method             = aws_api_gateway_method.path1_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.test_lambda.invoke_arn
}

# Lambda

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.test_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.myregion}:${var.accountId}:${aws_api_gateway_rest_api.this.id}/*/${aws_api_gateway_method.path1_post.http_method}${aws_api_gateway_resource.path1.path}"
}
