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
  source_file = "${local.path_to_lambdas}/${local.lambda_crudPlaid}/index.js"
  output_path = "${local.path_to_lambdas}/${local.lambda_crudPlaid}/${local.lambda_crudPlaid}.zip"
}

resource "aws_lambda_function" "test_lambda" {
  filename      = "${local.path_to_lambdas}/${local.lambda_crudPlaid}/${local.lambda_crudPlaid}.zip"
  function_name = "${local.env}_${local.lambda_crudPlaid}"
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
}

output "function_name" {
  value = aws_lambda_function.test_lambda.function_name
}
output "invoke_arn" {
  value = aws_lambda_function.test_lambda.invoke_arn
}
