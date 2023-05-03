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

#####################################################
# [/item]
module "item" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = var.parent_id
  path_part = "item"
}

# [/item][GET]
module "item_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}

# [/item][CORS OPTIONS]
module "item_CORS" {
  source = "squidfunk/api-gateway-enable-cors/aws"
  version = "0.3.3"

  api_id        = var.api_id
  api_resource_id = module.item.id
}
#####################################################

#####################################################
# [/item/account]
module "item_account" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "account"
}

# [/item/account][GET]
module "item_account_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_account.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
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
#####################################################

#####################################################
# [/item/institution]
module "item_institution" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "institution"
}

# [/item/institution][GET]
module "item_institution_GET" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_institution.id
  http_method       = "GET"
  lambda_invoke_arn = var.lambda_invoke_arn
}
#####################################################

#####################################################
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
#####################################################

#####################################################
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
#####################################################

#####################################################
# [/item/tokenExchange]
module "item_tokenExchange" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "token_exchange"
}

# [/item/tokenExchange][POST]
module "item_tokenExchange_POST" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_tokenExchange.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_invoke_arn
}
#####################################################

#####################################################
# [/item/tokenExchange/mock]
module "item_tokenExchange_mock" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item_tokenExchange.id
  path_part = "mock"
}

# [/item/tokenExchange/mock][POST]
module "item_tokenExchange_mock_POST" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_tokenExchange_mock.id
  http_method       = "POST"
  lambda_invoke_arn = var.lambda_invoke_arn
}
#####################################################

#####################################################
# [/item/updateLogin]
module "item_updateLogin" {
  source = "../../templates/resource"
  api_id = var.api_id

  parent_id = module.item.id
  path_part = "update_login"
}

# [/item/updateLogin][PUT]
module "item_updateLogin_PUT" {
  source        = "../../templates/method_integration"
  api_id        = var.api_id
  authorizer_id = var.authorizer_id

  resource_id       = module.item_updateLogin.id
  http_method       = "PUT"
  lambda_invoke_arn = var.lambda_invoke_arn
}
#####################################################

# # # # # #
# OUTPUTS #
# # # # # #
output "item_GET" {
  value = module.item_GET
}
output "item_CORS" {
  value = module.item_CORS
}
output "item_account_GET" {
  value = module.item_account_GET
}
output "item_account_transaction_GET" {
  value = module.item_account_transaction_GET
}
output "item_institution_GET" {
  value = module.item_institution_GET
}
output "item_sync_PUT" {
  value = module.item_sync_PUT
}
output "item_sync_mock_PUT" {
  value = module.item_sync_mock_PUT
}
output "item_tokenExchange_POST" {
  value = module.item_tokenExchange_POST
}
output "item_tokenExchange_mock_POST" {
  value = module.item_tokenExchange_mock_POST
}
output "item_updateLogin_PUT" {
  value = module.item_updateLogin_PUT
}
