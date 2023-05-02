# # # # # #
# INPUTS  #
# # # # # #
variable "api_id" {}
variable "parent_id" {}
variable "authorizer_id" {}
variable "lambda_invoke_arn" {}

# # # # # # #
# RESOURCES #
# # # # # # #

# [/table]
module "table" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = var.parent_id
  path_part = "table"
}

# [/table][GET]
module "table_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.table.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/table/item]
module "item" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.table.id
  path_part = "item"
}

# [/table/item][GET]
module "table_item_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/table/item][PUT]
module "table_item_PUT" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# # # # # #
# OUTPUTS #
# # # # # #
output "table_GET" {
  value = module.table_GET
}
output "table_item_GET" {
  value = module.table_item_GET
}
output "table_item_PUT" {
  value = module.table_item_PUT
}