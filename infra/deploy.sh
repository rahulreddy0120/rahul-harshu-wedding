#!/bin/bash
# deploy.sh — Build Next.js static site and upload to S3 + invalidate CloudFront
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🏗  Building Next.js static site..."
export PATH="$HOME/bin:$HOME/node20/bin:$PATH"
cd "$PROJECT_DIR"
npm run build

echo "📦 Getting Terraform outputs..."
cd "$SCRIPT_DIR"
SITE_BUCKET=$(terraform output -raw site_bucket)
CF_DIST_ID=$(terraform output -raw cloudfront_distribution_id)
API_ENDPOINT=$(terraform output -raw api_endpoint)

echo "Site bucket:    $SITE_BUCKET"
echo "CloudFront ID:  $CF_DIST_ID"
echo "API endpoint:   $API_ENDPOINT"

echo "🚀 Uploading to S3..."
cd "$PROJECT_DIR"
aws s3 sync out/ "s3://$SITE_BUCKET/" \
  --profile wedding \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.json"

# HTML and JSON — shorter cache (they change on deploy)
aws s3 sync out/ "s3://$SITE_BUCKET/" \
  --profile wedding \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --include "*.html" \
  --include "*.json"

echo "♻️  Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --profile wedding \
  --distribution-id "$CF_DIST_ID" \
  --paths "/*"

echo ""
echo "✅ Deployed! Your wedding site is live at:"
terraform -chdir="$SCRIPT_DIR" output cloudfront_url
echo ""
echo "📝 API endpoint for RSVP form: $API_ENDPOINT"
