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
          "apigateway:DELETE",
          "apigateway:GET",
          "apigateway:PATCH",
          "apigateway:POST",
          "apigateway:PUT",
        ],
        Resource = [
          "arn:aws:apigateway:${local.region}::/restapis",
          "arn:aws:apigateway:${local.region}::/restapis/*"
        ]
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
