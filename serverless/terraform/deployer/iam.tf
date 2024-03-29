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
          "iam:AttachRolePolicy",
          "iam:CreateRole",
          "iam:DetachRolePolicy",
          "iam:DeleteRole",
          "iam:GetRole",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:PassRole",
        ]
        Resource = [
          "arn:aws:iam::${local.account_id}:role/lambda_*_plaid",
          "arn:aws:iam::${local.account_id}:role/lambda_*_ddbTable",
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
          "iam:CreatePolicyVersion",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:ListPolicyVersions",
        ]
        Resource = [
          "arn:aws:iam::${local.account_id}:policy/lambda_*_plaid",
          "arn:aws:iam::${local.account_id}:policy/lambda_*_ddbTable",
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
