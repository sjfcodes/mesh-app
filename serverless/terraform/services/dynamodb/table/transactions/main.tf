# # # # # #
# INPUTS  #
# # # # # #
variable "env" {}
variable "app_name" {}


# # # # # # #
# RESOURCES #
# # # # # # #
resource "aws_dynamodb_table" "transactions" {
  name           = "${var.app_name}.${var.env}.transactions"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "item_id::account_id"
  range_key      = "transaction_id"

  attribute {
    name = "item_id::account_id"
    type = "S"
  }
  attribute {
    name = "transaction_id"
    type = "S"
  }
  attribute {
    name = "created_at"
    type = "S"
  }

  global_secondary_index {
    name               = "item_id-account_id-created_at-index"
    hash_key           = "item_id::account_id"
    range_key          = "created_at"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "ALL"
    # non_key_attributes = ["UserId"]
  }

  tags = {
    Applicataion = var.app_name
    Environment  = var.env
  }
}


# # # # # #
# OUTPUTS #
# # # # # #
output "table_name" {
  value = aws_dynamodb_table.transactions.name
}
