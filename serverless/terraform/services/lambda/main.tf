# # # # # #
# INPUTS  #
# # # # # #
variable "env" {}
variable "region" {}
variable "account_id" {}

variable "table_transactions_name" {}
variable "table_users_name" {}
variable "path" {
  default = "../../lambdas"

}
variable "lambda_name" {}

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
  name               = "lambda_${var.env}_${var.lambda_name}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${var.path}/${var.lambda_name}"
  output_path = "${var.path}/${var.lambda_name}/${var.lambda_name}.zip"
}

resource "aws_lambda_function" "this" {
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
    aws_cloudwatch_log_group.this,
  ]
}

resource "aws_cloudwatch_log_group" "this" {
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
      "dynamodb:GetItem",
      "dynamodb:PutItem"
    ]
    resources = [
      "arn:aws:dynamodb:${var.region}:${var.account_id}:table/${var.table_transactions_name}",
      "arn:aws:dynamodb:${var.region}:${var.account_id}:table/${var.table_users_name}"
    ]
  }
}

resource "aws_iam_policy" "this" {
  name   = "lambda_${var.env}_${var.lambda_name}"
  path   = "/"
  policy = data.aws_iam_policy_document.this.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.this.arn
}

# # # # # #
# OUTPUTS #
# # # # # #
output "function_name" {
  value = aws_lambda_function.this.function_name
}
output "invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}
