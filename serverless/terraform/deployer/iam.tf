resource "aws_iam_user_policy_attachment" "iam" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.iam.arn
}

resource "aws_iam_policy" "iam" {
  description = "mesh app deployer iam policy"
  name        = "${local.deployer_name}_iam"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:CreateRole",
          "iam:GetRole",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:DeleteRole",
          "iam:PassRole"
        ]
        Resource = "arn:aws:iam::${local.account_id}:role/iam_role_lambda"
      },
    ]
  })

  tags = {
    app_name = local.app_name
  }
}