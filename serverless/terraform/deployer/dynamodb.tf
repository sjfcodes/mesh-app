resource "aws_iam_user_policy_attachment" "dynamodb" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.dynamodb.arn
}

resource "aws_iam_policy" "dynamodb" {
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
        Resource = [
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/test_mesh-app_tfstate_lock",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/prod_mesh-app_tfstate_lock",
        ]
      },
      {
        # Table
        Effect = "Allow"
        Action = [
          "dynamodb:CreateTable",
          "dynamodb:DeleteTable",
          "dynamodb:DescribeContinuousBackups",
          "dynamodb:DescribeTable",
          "dynamodb:DescribeTimeToLive",
          "dynamodb:TagResource",
          "dynamodb:ListTagsOfResource",
        ]
        Resource = [
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.test.users",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.prod.users",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.test.transactions",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.prod.transactions",
        ]
      },
      {
        # Table Items
        Effect = "Allow"
        Action = [
          "dynamodb:DeleteItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.test.users",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.prod.users",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.test.transactions",
          "arn:aws:dynamodb:${local.region}:${local.account_id}:table/mesh-app.prod.transactions",
        ]
      },
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
