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
          "iam:PassRole",
          "iam:AttachRolePolicy"
        ]
        Resource = [
          "arn:aws:iam::${local.account_id}:role/iam_role_lambda"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "iam:CreatePolicy",
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions",
          "iam:DeletePolicy"
        ]
        Resource = "arn:aws:iam::118185547444:policy/lambda_logging"
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
