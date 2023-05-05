# # # # # # #
# RESOURCES #
# # # # # # #

# [/item/sync]
module "item_sync" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "sync"
}

# [/item/sync][PUT]
module "item_sync_PUT" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_sync.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/sync][CORS OPTIONS]
module "item_sync_CORS" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id        = var.api_id
  api_resource_id = module.item_sync.id
}

# [/item/sync/mock]
module "item_sync_mock" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item_sync.id
  path_part = "mock"
}

# [/item/sync/mock][PUT]
module "item_sync_mock_PUT" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_sync_mock.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_invoke_arn
}


# # # # # #
# OUTPUTS #
# # # # # #
output "item_sync_PUT" {
  value = module.item_sync_PUT
}
output "item_sync_CORS" {
  value = module.item_sync_CORS
}
output "item_sync_mock_PUT" {
  value = module.item_sync_mock_PUT
}
