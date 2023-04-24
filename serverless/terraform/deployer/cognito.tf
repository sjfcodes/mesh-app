resource "aws_iam_user_policy_attachment" "cognito" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.cognito.arn
}

resource "aws_iam_policy" "cognito" {
  description = "mesh app deployer cognito policy"
  name        = "${local.deployer_name}_cognito"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "cognito-idp:ListUserPools"
        ],
        Resource = "*"
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
