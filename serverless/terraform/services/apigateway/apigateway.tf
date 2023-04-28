# INPUTS
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "cognito_user_pool_name" {
  default = "mesh-app"
}

# RESOURCES

# Lambda

module "lambda" {
  source = "../lambdas/plaid"

  env = var.env
}

resource "aws_lambda_permission" "this" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-module.api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_id}:${aws_api_gateway_rest_api.this.id}/*"
}

# # # #
# API #
# # # #
resource "aws_api_gateway_rest_api" "this" {
  name = "${var.env}_mesh-app"
}

# # # # # # # # # # #
# ROUTE AUTHORIZER  #
# # # # # # # # # # #
data "aws_cognito_user_pools" "this" {
  name = var.cognito_user_pool_name
}
resource "aws_api_gateway_authorizer" "this" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  provider_arns = data.aws_cognito_user_pools.this.arns
}

# # # # # #
# ROUTES  #
# # # # # #

# [POST] /link/token_create
module "link" {
  source = "./resource/resource-method"

  region     = var.region
  account_id = var.account_id
  env        = var.env

  api_id        = aws_api_gateway_rest_api.this.id
  parent_id     = aws_api_gateway_rest_api.this.root_resource_id
  authorizer_id = aws_api_gateway_authorizer.this.id
  path_part     = "link"

  child_path_part         = "token_create"
  child_http_method       = "POST"
  child_lambda_invoke_arn = module.lambda.invoke_arn
}

# [POST] /item/token_exchange
module "item" {
  source = "./resource/resource-method"

  region     = var.region
  account_id = var.account_id
  env        = var.env

  api_id        = aws_api_gateway_rest_api.this.id
  parent_id     = aws_api_gateway_rest_api.this.root_resource_id
  authorizer_id = aws_api_gateway_authorizer.this.id
  path_part     = "item"

  child_path_part         = "token_exchange"
  child_http_method       = "POST"
  child_lambda_invoke_arn = module.lambda.invoke_arn
}

# # # # # # # #
# DEPLOYMENT  #
# # # # # # # #
resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      module.link,
      module.item
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# # # # #
# STAGE #
# # # # #
resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = var.env
}

# OUTPUTS
output "apigw_resource_id" {
  value = aws_api_gateway_rest_api.this.id
}
