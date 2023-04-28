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
      module.link_tokenCreate_POST.integration,
      module.item_tokenExchange_POST.integration,
      module.item_tokenExchange_mock_POST.integration,
      module.item_updateLogin_PUT.integration
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
