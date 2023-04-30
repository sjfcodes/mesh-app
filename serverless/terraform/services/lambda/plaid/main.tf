# # # # # #
# INPUTS  #
# # # # # #
variable "env" {}
variable "table_transactions_name" {}
variable "table_users_name" {}
variable "path" {
  default = "../../lambdas"

}
variable "lambda_name" {
  default = "plaid"
}

# # # # # # #
# RESOURCES #
# # # # # # #
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${var.env}_iam_role_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${var.path}/${var.lambda_name}"
  output_path = "${var.path}/${var.lambda_name}/${var.lambda_name}.zip"
}

resource "aws_lambda_function" "plaid" {
  filename      = "${var.path}/${var.lambda_name}/${var.lambda_name}.zip"
  function_name = "${var.env}_${var.lambda_name}"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = {
      USER_TABLE_NAME        = var.table_users_name
      TRANSACTION_TABLE_NAME = var.table_transactions_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.example,
  ]
}

resource "aws_cloudwatch_log_group" "example" {
  name              = "/aws/lambda/${var.env}_${var.lambda_name}"
  retention_in_days = 14
}

# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "dynamodb:GetItem"
    ]
    resources = [
      "arn:aws:dynamodb:us-east-1:118185547444:table/${var.table_transactions_name}",
      "arn:aws:dynamodb:us-east-1:118185547444:table/${var.table_users_name}"
    ]
  }
}

resource "aws_iam_policy" "this" {
  name        = "${var.env}_plaid_lambda"
  path        = "/"
  policy      = data.aws_iam_policy_document.this.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.this.arn
}

# # # # # #
# OUTPUTS #
# # # # # #
output "function_name" {
  value = aws_lambda_function.plaid.function_name
}
output "invoke_arn" {
  value = aws_lambda_function.plaid.invoke_arn
}