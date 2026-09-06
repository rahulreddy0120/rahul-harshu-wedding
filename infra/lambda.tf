# ─── Lambda: Package ─────────────────────────────────────────────────────────

data "archive_file" "rsvp_lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/rsvp_handler.py"
  output_path = "${path.module}/lambda/rsvp_handler.zip"
}

# ─── Lambda: Function ────────────────────────────────────────────────────────

resource "aws_lambda_function" "rsvp" {
  function_name    = "${local.project}-rsvp"
  filename         = data.archive_file.rsvp_lambda.output_path
  source_code_hash = data.archive_file.rsvp_lambda.output_base64sha256
  role             = aws_iam_role.lambda_rsvp.arn
  handler          = "rsvp_handler.handler"
  runtime          = "python3.12"
  timeout          = 30
  memory_size      = 256
  tags             = local.tags

  environment {
    variables = {
      RSVP_TABLE          = aws_dynamodb_table.rsvps.name
      GUEST_TABLE         = aws_dynamodb_table.guests.name
      BACKUP_BUCKET       = aws_s3_bucket.rsvp_backup.bucket
      NOTIFICATION_EMAIL  = var.notification_email
      COUPLE_EMAIL        = var.couple_email
      ADMIN_PASSWORD_HASH = var.admin_password_hash
      AUTH_SECRET         = var.auth_secret
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_basic]
}

resource "aws_lambda_function_url" "rsvp" {
  function_name      = aws_lambda_function.rsvp.function_name
  authorization_type = "NONE"
  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST"]
    allow_headers     = ["Content-Type", "Authorization"]
    max_age           = 86400
  }
}

# ─── API Gateway v2 (HTTP API) ────────────────────────────────────────────────

resource "aws_apigatewayv2_api" "rsvp" {
  name          = "${local.project}-api"
  protocol_type = "HTTP"
  tags          = local.tags

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 86400
  }
}

resource "aws_apigatewayv2_integration" "rsvp" {
  api_id                 = aws_apigatewayv2_api.rsvp.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.rsvp.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "rsvp_post" {
  api_id    = aws_apigatewayv2_api.rsvp.id
  route_key = "POST /api/rsvp"
  target    = "integrations/${aws_apigatewayv2_integration.rsvp.id}"
}

resource "aws_apigatewayv2_route" "admin_login" {
  api_id    = aws_apigatewayv2_api.rsvp.id
  route_key = "POST /api/login"
  target    = "integrations/${aws_apigatewayv2_integration.rsvp.id}"
}

resource "aws_apigatewayv2_route" "rsvp_get" {
  api_id    = aws_apigatewayv2_api.rsvp.id
  route_key = "GET /api/rsvps"
  target    = "integrations/${aws_apigatewayv2_integration.rsvp.id}"
}

resource "aws_apigatewayv2_route" "health" {
  api_id    = aws_apigatewayv2_api.rsvp.id
  route_key = "GET /api/health"
  target    = "integrations/${aws_apigatewayv2_integration.rsvp.id}"
}

resource "aws_apigatewayv2_stage" "rsvp" {
  api_id      = aws_apigatewayv2_api.rsvp.id
  name        = "$default"
  auto_deploy = true
  tags        = local.tags
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.rsvp.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.rsvp.execution_arn}/*/*"
}
