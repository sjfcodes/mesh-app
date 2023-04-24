resource "aws_iam_user_policy_attachment" "attach_lambda" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.mad_lambda.arn
}

resource "aws_iam_policy" "mad_lambda" {
  description = "mesh app deployer lambda policy"
  name        = "${local.deployer_name}_lambda"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "lambda:CreateFunction",
          "lambda:ListVersionsByFunction",
          "lambda:GetFunction",
          "lambda:DeleteFunction",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration"
        ],
        Resource = "arn:aws:lambda:${local.region}:${local.account_id}:function:test_crudPlaid"
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
