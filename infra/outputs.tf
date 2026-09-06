output "cloudfront_url" {
  description = "Wedding website URL (CloudFront)"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation on deploy)"
  value       = aws_cloudfront_distribution.site.id
}

output "site_bucket" {
  description = "S3 bucket for static site files"
  value       = aws_s3_bucket.site.bucket
}

output "media_bucket" {
  description = "S3 bucket for photos and music"
  value       = aws_s3_bucket.media.bucket
}

output "api_endpoint" {
  description = "API Gateway endpoint — use this in the Next.js RSVP form"
  value       = aws_apigatewayv2_api.rsvp.api_endpoint
}

output "rsvp_table" {
  description = "DynamoDB RSVP table name"
  value       = aws_dynamodb_table.rsvps.name
}

output "lambda_function_url" {
  description = "Direct Lambda function URL (alternative to API Gateway)"
  value       = aws_lambda_function_url.rsvp.function_url
}
