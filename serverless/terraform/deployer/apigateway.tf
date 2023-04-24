resource "aws_iam_user_policy_attachment" "apigateway" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.apigateway.arn
}

resource "aws_iam_policy" "apigateway" {
  description = "mesh app deployer apigateway policy"
  name        = "${local.deployer_name}_apigateway"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "apigateway:POST",
          "apigateway:PUT",
          "apigateway:GET",
          "apigateway:DELETE",
        ],
        Resource = [
          "arn:aws:apigateway:us-east-1::/restapis",
          "arn:aws:apigateway:us-east-1::/restapis/*"
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
