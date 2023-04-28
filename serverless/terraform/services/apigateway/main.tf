# # # # # #
# INPUTS  #
# # # # # #
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "lambda_plaid_function_name" {}
variable "lambda_plaid_invoke_arn" {}

# # # # # # #
# RESOURCES #
# # # # # # #
resource "aws_api_gateway_rest_api" "this" {
  name = "${var.env}_mesh-app"
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      module.token_create.integration,
      module.token_exchange.integration,
      module.update_login.integration
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = var.env
}

# # # # # #
# OUTPUTS #
# # # # # #
output "apigw_resource_id" {
  value = aws_api_gateway_rest_api.this.id
}
