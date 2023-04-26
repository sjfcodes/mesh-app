variable "region" {}
variable "accountId" {}
variable "env" {}
variable "api" {}
variable "authorizer" {}

module "lambda_plaid" {
  source = "../../lambdas/plaid"
  env    = var.env
}

resource "aws_api_gateway_resource" "link" {
  rest_api_id = var.api.id
  parent_id   = var.api.root_resource_id
  path_part   = "link"
}

resource "aws_api_gateway_method" "link_post" {
  rest_api_id   = var.api.id
  resource_id   = aws_api_gateway_resource.link.id
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
  source_arn = "arn:aws:execute-api:${var.region}:${var.accountId}:${var.api.id}/*/${aws_api_gateway_method.link_post.http_method}${aws_api_gateway_resource.link.path}"
}

resource "aws_api_gateway_integration" "this" {
  rest_api_id             = var.api.id
  resource_id             = aws_api_gateway_resource.link.id
  http_method             = aws_api_gateway_method.link_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = module.lambda_plaid.invoke_arn
}

output "resource" {
  value = aws_api_gateway_resource.link
}

output "method" {
  value = aws_api_gateway_method.link_post
}

output "integration" {
  value = aws_api_gateway_integration.this
}
