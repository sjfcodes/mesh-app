variable "region" {}
variable "accountId" {}
variable "cognito_user_pool_name" {
  default = "mesh-app"
}

module link {
  source = "./resource"
  region = var.region
  accountId = var.accountId
  api = aws_api_gateway_rest_api.this
  authorizer = aws_api_gateway_authorizer.this
}

data "aws_cognito_user_pools" "this" {
  name = var.cognito_user_pool_name
}

resource "aws_api_gateway_rest_api" "this" {
  name = "test_mesh-app"
}


resource "aws_api_gateway_authorizer" "this" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.this.id
  provider_arns = data.aws_cognito_user_pools.this.arns
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      module.link.resource.id,
      module.link.method.id,
      module.link.integration.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = "test"
}

output "apigw_resource_id" {
  value = aws_api_gateway_rest_api.this.id
}
