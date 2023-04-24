resource "aws_iam_user_policy_attachment" "attach_dynamodb" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.mad_dynamodb.arn
}

resource "aws_iam_policy" "mad_dynamodb" {
  description = "mesh app deployer dynamodb policy"
  name        = "${local.deployer_name}_dynamodb"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app-tfstate-lock"
      },
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
