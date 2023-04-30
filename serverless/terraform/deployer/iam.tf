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
          "arn:aws:iam::${local.account_id}:role/lambda_test_plaid",
          "arn:aws:iam::${local.account_id}:role/lambda_prod_plaid",
          "arn:aws:iam::${local.account_id}:role/lambda_test_ddbTable",
          "arn:aws:iam::${local.account_id}:role/lambda_prod_ddbTable",
          # "arn:aws:iam::${local.account_id}:role/*",
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
          "arn:aws:iam::118185547444:policy/lambda_test_plaid",
          "arn:aws:iam::118185547444:policy/lambda_prod_plaid",
          "arn:aws:iam::118185547444:policy/lambda_test_ddbTable",
          "arn:aws:iam::118185547444:policy/lambda_prod_ddbTable",
          # "arn:aws:iam::118185547444:policy/*",
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
