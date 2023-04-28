# inputs
variable "env" {}
variable "region" {}
variable "account_id" {}

# resources

module "link" {
  source = "./resource/link"

  region     = var.region
  account_id = var.account_id
  env        = var.env

  api_id    = aws_api_gateway_rest_api.this.id
  parent_id = aws_api_gateway_rest_api.this.root_resource_id
}

resource "aws_api_gateway_rest_api" "this" {
  name = "${var.env}_mesh-app"
}

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  triggers = {
    redeployment = sha1(jsonencode([
      module.link
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

# outputs
output "apigw_resource_id" {
  value = aws_api_gateway_rest_api.this.id
}
