resource "aws_iam_policy" "cloudwatch_logs" {
  description = "mesh app deployer cloudwatchw_logs policy"
  name        = "${local.deployer_name}_cloudwatch_logs"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:DeleteLogGroup",
          "logs:DescribeLogGroups",
          "logs:ListTagsLogGroup",
          "logs:PutRetentionPolicy",
          "logs:FilterLogEvents"
        ],
        Resource = [
          "arn:aws:logs:${local.region}:${local.account_id}:log-group:/aws/lambda/*_plaid:log-stream:",
          "arn:aws:logs:${local.region}:${local.account_id}:log-group:/aws/lambda/*_ddbTable:log-stream:",
          "arn:aws:logs:${local.region}:${local.account_id}:log-group::log-stream:",
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}

resource "aws_iam_user_policy_attachment" "cloudwatch_logs" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.cloudwatch_logs.arn
}
