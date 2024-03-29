# # # # # #
# INPUTS  #
# # # # # #
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "lambda_plaid_function_name" {}
variable "lambda_plaid_invoke_arn" {}
variable "lambda_ddbTable_function_name" {}
variable "lambda_ddbTable_invoke_arn" {}

# # # # # # #
# RESOURCES #
# # # # # # #
resource "aws_api_gateway_rest_api" "this" {
  name = "${var.env}_mesh-app"
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    # NOTE: The configuration below will satisfy ordering considerations,
    #       but not pick up all future REST API changes. More advanced patterns
    #       are possible, such as using the filesha1() function against the
    #       Terraform configuration file(s) or removing the .id references to
    #       calculate a hash against whole resources. Be aware that using whole
    #       resources will show a difference after the initial implementation.
    #       It will stabilize to only change when resources change afterwards.
    redeployment = sha1(jsonencode([
      module.item.item_GET,
      module.item.item_CORS,
      # module.item.item_account_GET,
      module.item.item_account_balance_GET,
      module.item.item_account_balance_CORS,
      module.item.item_account_transaction_GET,
      module.item.item_account_transaction_CORS,
      module.item.item_institution_GET,
      module.item.item_institution_CORS,
      module.item.item_sync_PUT,
      module.item.item_sync_CORS,
      module.item.item_sync_mock_PUT,
      module.item.item_tokenExchange_POST,
      module.item.item_tokenExchange_CORS,
      module.item.item_tokenExchange_mock_POST,
      module.item.item_updateLogin_PUT,
      module.item.item_updateLogin_CORS,
      module.link.link_tokenCreate_POST,
      module.link.link_tokenCreate_CORS,
      module.ddbTable.table_GET,
      module.ddbTable.table_item_GET,
      module.ddbTable.table_item_PUT,
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

resource "aws_api_gateway_method_settings" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  stage_name  = aws_api_gateway_stage.this.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

# # # # # #
# OUTPUTS #
# # # # # #
output "apigw_resource_id" {
  value = aws_api_gateway_rest_api.this.id
}
