# ─── SES: Email Identity ──────────────────────────────────────────────────────
# Verifies the notification email so SES can send from it.
# NOTE: AWS will send a verification email to rahulreddy0120@gmail.com — click the link.

resource "aws_ses_email_identity" "notification" {
  email = var.notification_email
}

resource "aws_ses_email_identity" "couple" {
  count = var.couple_email != var.notification_email ? 1 : 0
  email = var.couple_email
}
