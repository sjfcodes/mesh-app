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
          "lambda:AddPermission",
          "lambda:CreateAlias",
          "lambda:CreateFunction",
          "lambda:DeleteAlias",
          "lambda:DeleteFunction",
          "lambda:GetAlias",
          "lambda:GetFunction",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:GetPolicy",
          "lambda:ListVersionsByFunction",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:RemovePermission",
        ],
        Resource = [
          "arn:aws:lambda:${local.region}:${local.account_id}:function:test_plaid",
          "arn:aws:lambda:${local.region}:${local.account_id}:function:prod_plaid",
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
