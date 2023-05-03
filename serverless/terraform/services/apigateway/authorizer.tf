# # # # # # #
# RESOURCES #
# # # # # # #

variable "cognito_user_pool_name" {
  default = "mesh-app"
}

data "aws_cognito_user_pools" "this" {
  name = var.cognito_user_pool_name
}

resource "aws_api_gateway_authorizer" "this" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  provider_arns = data.aws_cognito_user_pools.this.arns
}