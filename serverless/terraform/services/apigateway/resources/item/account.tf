# # # # # # #
# RESOURCES #
# # # # # # #

# [/item/account]
module "item_account" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "account"
}

# # [/item/account][GET]
# module "item_account_GET" {
#   source        = "../../templates/method_integration"
#   api_id        = var.api_id
#   authorizer_id = var.authorizer_id

#   resource_id       = module.item_account.id
#   http_method       = "GET"
#   lambda_invoke_arn = var.lambda_invoke_arn
# }

# [/item/account/balance]
module "item_account_balance" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item_account.id
  path_part = "balance"
}

# [/item/account/balance][GET]
module "item_account_balance_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_account_balance.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/account/balance][CORS OPTIONS]
module "item_account_balance_CORS" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = var.api_id
  api_resource_id = module.item_account_balance.id
}

# [/item/account/transaction]
module "item_account_transaction" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item_account.id
  path_part = "transaction"
}

# [/item/account/transaction][GET]
module "item_account_transaction_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_account_transaction.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item/account/transaction][CORS OPTIONS]
module "item_account_transaction_CORS" {
  source  = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id          = var.api_id
  api_resource_id = module.item_account_transaction.id
}

# # # # # #
# OUTPUTS #
# # # # # #
# output "item_account_GET" {
#   value = module.item_account_GET
# }
output "item_account_balance_GET" {
  value = module.item_account_balance_GET
}
output "item_account_balance_CORS" {
  value = module.item_account_balance_CORS
}
output "item_account_transaction_GET" {
  value = module.item_account_transaction_GET
}
output "item_account_transaction_CORS" {
  value = module.item_account_transaction_CORS
}
