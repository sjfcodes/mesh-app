resource "aws_iam_user_policy_attachment" "attach_s3" {
  user       = aws_iam_user.tf_deployer.name
  policy_arn = aws_iam_policy.mad_s3.arn
}

resource "aws_iam_policy" "mad_s3" {
  description = "mesh app deployer s3 policy"
  name        = "${local.deployer_name}_s3"
  path        = "/"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow",
        Action   = "s3:ListBucket",
        Resource = "arn:aws:s3:::mesh-app-tfstate"
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Resource = "arn:aws:s3:::mesh-app-tfstate/dev/*"
      }
    ]
  })

  tags = {
    app_name = local.app_name
  }
}
