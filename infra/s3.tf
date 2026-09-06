# ─── S3: Static Website ──────────────────────────────────────────────────────

resource "aws_s3_bucket" "site" {
  bucket        = "${local.project}-site-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
  tags          = local.tags
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration { status = "Enabled" }
}

# ─── S3: Media (photos + music) ──────────────────────────────────────────────

resource "aws_s3_bucket" "media" {
  bucket        = "${local.project}-media-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
  tags          = local.tags
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket                  = aws_s3_bucket.media.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# ─── S3: RSVP data backup ────────────────────────────────────────────────────

resource "aws_s3_bucket" "rsvp_backup" {
  bucket        = "${local.project}-rsvp-backup-${data.aws_caller_identity.current.account_id}"
  force_destroy = false
  tags          = local.tags
}

resource "aws_s3_bucket_public_access_block" "rsvp_backup" {
  bucket                  = aws_s3_bucket.rsvp_backup.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "rsvp_backup" {
  bucket = aws_s3_bucket.rsvp_backup.id
  versioning_configuration { status = "Enabled" }
}

# Data source
data "aws_caller_identity" "current" {}
