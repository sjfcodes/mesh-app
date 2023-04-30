# # # # # #
# INPUTS  #
# # # # # #
variable "api_id" {}
variable "parent_id" {}
variable "path_part" {}


# # # # # # #
# RESOURCES #
# # # # # # #

# [/resource]
resource "aws_api_gateway_resource" "this" {
  rest_api_id = var.api_id
  parent_id   = var.parent_id
  path_part   = var.path_part
}

# # # # # #
# OUTPUTS #
# # # # # #
output "id" {
  value = aws_api_gateway_resource.this.id
}
