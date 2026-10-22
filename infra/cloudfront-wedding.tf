# ═══════════════════════════════════════════════════════════════════════════
#  Wedding-only RSVP — separate, isolated CloudFront distribution
# ═══════════════════════════════════════════════════════════════════════════
#  Goal: host the wedding-ONLY RSVP page on its own domain/URL so that
#  trimming or mistyping the path can NEVER fall back to the main all-events
#  RSVP site. It uses a dedicated S3 bucket whose ONLY page is the wedding
#  RSVP form, and its 404/403 fallback serves that same page.
#
#  It reuses the SAME backend: /api/* is proxied to the SAME API Gateway →
#  SAME Lambda → SAME DynamoDB table. So these RSVPs land in the same table
#  and the admin portal's "Wedding" count stays correct.
#
#  Everything here is additive; no existing resource is modified.
# ═══════════════════════════════════════════════════════════════════════════

# ─── S3 bucket: wedding-only site (single page) ──────────────────────────────

resource "aws_s3_bucket" "wedding" {
  bucket        = "${local.project}-wedding-site-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
  tags          = local.tags
}

resource "aws_s3_bucket_public_access_block" "wedding" {
  bucket                  = aws_s3_bucket.wedding.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "wedding" {
  bucket = aws_s3_bucket.wedding.id
  versioning_configuration { status = "Enabled" }
}

# ─── Origin Access Control ───────────────────────────────────────────────────

resource "aws_cloudfront_origin_access_control" "wedding" {
  name                              = "${local.project}-wedding-oac"
  description                       = "OAC for wedding-only RSVP S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ─── Bucket policy: allow this distribution's OAC to read ────────────────────

resource "aws_s3_bucket_policy" "wedding" {
  bucket = aws_s3_bucket.wedding.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.wedding.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.wedding.arn
        }
      }
    }]
  })
}

# ─── CloudFront distribution: wedding-only ───────────────────────────────────

resource "aws_cloudfront_distribution" "wedding" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "Harshini & Rahul — Wedding-only RSVP"
  price_class         = "PriceClass_100"
  tags                = local.tags

  # Origin 1: wedding-only static page (S3)
  origin {
    domain_name              = aws_s3_bucket.wedding.bucket_regional_domain_name
    origin_id                = "S3-wedding"
    origin_access_control_id = aws_cloudfront_origin_access_control.wedding.id
  }

  # Origin 2: SAME API Gateway as the main site (shared Lambda + DynamoDB)
  origin {
    domain_name = replace(aws_apigatewayv2_api.rsvp.api_endpoint, "https://", "")
    origin_id   = "APIGW-rsvp"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Default: serve the wedding-only page
  default_cache_behavior {
    target_origin_id       = "S3-wedding"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = aws_cloudfront_cache_policy.static.id
    compress               = true
  }

  # /api/* → SAME API Gateway (reuse shared backend)
  ordered_cache_behavior {
    path_pattern             = "/api/*"
    target_origin_id         = "APIGW-rsvp"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader
    compress                 = true
  }

  # Fallback: any unknown path serves the wedding page itself (NOT the main
  # site — this bucket has no main site). This is the whole point: trimming or
  # mistyping the URL keeps the guest on the wedding RSVP page.
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  depends_on = [aws_apigatewayv2_api.rsvp]
}
