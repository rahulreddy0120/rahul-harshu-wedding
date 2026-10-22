#!/bin/bash
# deploy-wedding.sh — Upload the wedding-ONLY RSVP page to its dedicated
# S3 bucket + invalidate its separate CloudFront distribution.
#
# This is independent of the main site. The source page lives at
# public/wedding-rsvp/index.html and is uploaded as the bucket-root index.html
# so it is served at the distribution root ("/").
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
AWS_PROFILE="${AWS_PROFILE:-wedding}"

SRC_PAGE="$PROJECT_DIR/public/wedding-rsvp/index.html"
if [ ! -f "$SRC_PAGE" ]; then
  echo "❌ Source page not found: $SRC_PAGE"
  exit 1
fi

echo "📦 Getting Terraform outputs..."
cd "$SCRIPT_DIR"
WEDDING_BUCKET=$(terraform output -raw wedding_site_bucket)
WEDDING_CF_ID=$(terraform output -raw wedding_cloudfront_distribution_id)

echo "Wedding bucket:    $WEDDING_BUCKET"
echo "Wedding CF ID:     $WEDDING_CF_ID"

echo "🚀 Uploading wedding-only page to S3 (as root index.html)..."
aws s3 cp "$SRC_PAGE" "s3://$WEDDING_BUCKET/index.html" \
  --profile "$AWS_PROFILE" \
  --content-type "text/html" \
  --cache-control "public, max-age=0, must-revalidate"

echo "♻️  Invalidating wedding CloudFront cache..."
aws cloudfront create-invalidation \
  --profile "$AWS_PROFILE" \
  --distribution-id "$WEDDING_CF_ID" \
  --paths "/*"

echo ""
echo "✅ Wedding-only RSVP page deployed at:"
terraform -chdir="$SCRIPT_DIR" output wedding_cloudfront_url
