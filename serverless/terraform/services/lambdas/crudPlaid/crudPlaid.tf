variable "lambda_function_name" {
  default = "crudPlaid"
}

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

resource "aws_iam_role" "iam_role_lambda" {
  name               = "iam_role_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${local.path_to_lambdas}/${var.lambda_function_name}"
  output_path = "${local.path_to_lambdas}/${var.lambda_function_name}/${var.lambda_function_name}.zip"
}

resource "aws_lambda_function" "test_lambda" {
  filename      = "${local.path_to_lambdas}/${var.lambda_function_name}/${var.lambda_function_name}.zip"
  function_name = "${local.env}_${var.lambda_function_name}"
  role          = aws_iam_role.iam_role_lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = {
      USER_TABLE_NAME        = "mesh-app.users.${local.env}"
      TRANSACTION_TABLE_NAME = "mesh-app.plaid.transactions.${local.env}"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.example,
  ]
}

resource "aws_cloudwatch_log_group" "example" {
  name              = "/aws/lambda/${local.env}_${var.lambda_function_name}"
  retention_in_days = 14
}

# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_role_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

output "function_name" {
  value = aws_lambda_function.test_lambda.function_name
}
output "invoke_arn" {
  value = aws_lambda_function.test_lambda.invoke_arn
}
