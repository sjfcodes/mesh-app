resource "aws_iam_user_policy_attachment" "lambda" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.lambda.arn
}

resource "aws_iam_policy" "lambda" {
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
          "lambda:UpdateFunctionConfiguration",
          "lambda:AddPermission",
          "lambda:GetPolicy",
          "lambda:RemovePermission",
          "lambda:CreateAlias",
          "lambda:GetAlias",
          "lambda:DeleteAlias",
        ],
        Resource = [
          "arn:aws:lambda:${local.region}:${local.account_id}:function:test_crudPlaid",
          "arn:aws:lambda:${local.region}:${local.account_id}:function:test_crudPlaid:testalias",
          "arn:aws:logs:${local.region}:${local.account_id}:log-group:/aws/lambda/crudPlaid:log-stream:"
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
