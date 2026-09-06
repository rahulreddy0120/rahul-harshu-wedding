# ─── DynamoDB: RSVP Table ────────────────────────────────────────────────────

resource "aws_dynamodb_table" "rsvps" {
  name         = "${local.project}-rsvps"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "rsvpId"
  range_key    = "submittedAt"
  tags         = local.tags

  attribute {
    name = "rsvpId"
    type = "S"
  }

  attribute {
    name = "submittedAt"
    type = "S"
  }

  attribute {
    name = "email"
    type = "S"
  }

  # GSI to look up by email
  global_secondary_index {
    name            = "email-index"
    hash_key        = "email"
    range_key       = "submittedAt"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  ttl {
    attribute_name = "ttl"
    enabled        = false
  }
}

# ─── DynamoDB: Guest List Table ───────────────────────────────────────────────
# Pre-load guest names/invite codes for personalised invitations

resource "aws_dynamodb_table" "guests" {
  name         = "${local.project}-guests"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "inviteCode"
  tags         = local.tags

  attribute {
    name = "inviteCode"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }
}
