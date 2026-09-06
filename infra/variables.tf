variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS named profile for local runs. Set to \"\" in CI to use ambient (OIDC) credentials."
  type        = string
  default     = "wedding"
}

variable "domain_name" {
  description = "Custom domain for the wedding site (leave empty to use CloudFront URL)"
  type        = string
  default     = ""
}

variable "notification_email" {
  description = "Email to receive RSVP notifications"
  type        = string
  default     = "rahulreddy0120@gmail.com"
}

variable "couple_email" {
  description = "Email shown to guests in confirmation emails"
  type        = string
  default     = "rahulreddy0120@gmail.com"
}

variable "admin_password_hash" {
  description = "SHA-256 hex hash of the host admin password (never store plaintext)"
  type        = string
  sensitive   = true
}

variable "auth_secret" {
  description = "Random secret used to HMAC-sign admin session tokens"
  type        = string
  sensitive   = true
}
