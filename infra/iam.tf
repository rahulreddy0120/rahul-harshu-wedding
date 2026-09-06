# ─── IAM: Lambda Execution Role ──────────────────────────────────────────────

resource "aws_iam_role" "lambda_rsvp" {
  name = "${local.project}-lambda-rsvp-role"
  tags = local.tags

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_rsvp.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_rsvp_policy" {
  name = "${local.project}-lambda-rsvp-policy"
  role = aws_iam_role.lambda_rsvp.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBRSVP"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:UpdateItem"
        ]
        Resource = [
          aws_dynamodb_table.rsvps.arn,
          "${aws_dynamodb_table.rsvps.arn}/index/*",
          aws_dynamodb_table.guests.arn,
          "${aws_dynamodb_table.guests.arn}/index/*"
        ]
      },
      {
        Sid    = "SESEmail"
        Effect = "Allow"
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ]
        Resource = "*"
      },
      {
        Sid    = "S3Backup"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.rsvp_backup.arn}/*"
      }
    ]
  })
}
