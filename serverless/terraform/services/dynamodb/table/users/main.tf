# # # # # #
# INPUTS  #
# # # # # #
variable "env" {}
variable "app_name" {}


# # # # # # #
# RESOURCES #
# # # # # # #
resource "aws_dynamodb_table" "users" {
  name           = "${var.app_name}.${var.env}.users"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
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
  value = aws_dynamodb_table.users.name
}