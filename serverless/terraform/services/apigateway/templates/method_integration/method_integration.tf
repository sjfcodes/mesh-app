# # # # # #
# INPUTS  #
# # # # # #
variable "api_id" {}
variable "authorizer_id" {}

variable "resource_id" {}
variable "http_method" {}
variable "lambda_invoke_arn" {}

# # # # # # #
# RESOURCES #
# # # # # # #

# [/resource][METHOD][]
resource "aws_api_gateway_method" "this" {
  rest_api_id   = var.api_id
  resource_id   = var.resource_id
  http_method   = var.http_method
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = var.authorizer_id

  request_parameters = {
    "method.request.path.proxy" = true
  }
}

# [/resource][METHOD][LAMBDA]
resource "aws_api_gateway_integration" "this" {
  rest_api_id             = var.api_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.this.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# # # # # #
# OUTPUTS #
# # # # # #
output "integration" {
  value = aws_api_gateway_integration.this
}