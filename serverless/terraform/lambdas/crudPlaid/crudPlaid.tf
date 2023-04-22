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
  source_file = "../lambdas/${local.lambda_crudPlaid}/index.js"
  output_path = "../lambdas/${local.lambda_crudPlaid}/lambda_function_payload.zip"
}

resource "aws_lambda_function" "test_lambda" {
  filename      = "../lambdas/${local.lambda_crudPlaid}/lambda_function_payload.zip"
  function_name = "${local.env_dev}-${local.lambda_crudPlaid}"
  role          = aws_iam_role.iam_role_lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = {
      USER_TABLE_NAME="mesh-app.users.test"
      TRANSACTION_TABLE_NAME="mesh-app.plaid.transactions.test"
    }
  }
}