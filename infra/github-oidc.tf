# ─── GitHub Actions OIDC → IAM Role ──────────────────────────────────────────
# Lets GitHub Actions assume an AWS role via OIDC federation (no static keys).

variable "github_repo" {
  description = "GitHub repo in owner/name form, allowed to assume the CI role"
  type        = string
  default     = "rahulreddy0120/rahul-harshu-wedding"
}

# Numeric IDs for GitHub's immutable-subject OIDC claim format.
# GitHub now issues sub claims like: repo:owner@<orgId>/name@<repoId>:...
# so the trust policy must match that in addition to the classic slug form.
variable "github_owner_id" {
  description = "Numeric GitHub user/org ID (gh api /users/<owner> --jq .id)"
  type        = string
  default     = "66233363"
}

variable "github_repo_id" {
  description = "Numeric GitHub repo ID (gh api /repos/<owner>/<repo> --jq .id)"
  type        = string
  default     = "1357709098"
}

# OIDC identity provider for GitHub Actions
# NOTE: data.aws_caller_identity.current is declared in s3.tf and reused here.
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  # GitHub's OIDC thumbprint (accepted; AWS validates the cert chain regardless)
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
  tags            = local.tags
}

# Trust policy: only this repo (main branch or any ref) can assume the role
data "aws_iam_policy_document" "github_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_repo}:*",                                            # classic slug format
        "repo:${split("/", var.github_repo)[0]}@${var.github_owner_id}/${split("/", var.github_repo)[1]}@${var.github_repo_id}:*", # immutable-ID format
      ]
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name               = "${local.project}-github-actions"
  assume_role_policy = data.aws_iam_policy_document.github_assume.json
  tags               = local.tags
}

# Permissions the CI needs: manage the project's infra + deploy the site.
data "aws_iam_policy_document" "github_actions" {
  # Terraform state backend
  statement {
    sid    = "TerraformState"
    effect = "Allow"
    actions = [
      "s3:GetObject", "s3:PutObject", "s3:ListBucket", "s3:DeleteObject",
    ]
    resources = [
      "arn:aws:s3:::harshini-rahul-wedding-tfstate-${data.aws_caller_identity.current.account_id}",
      "arn:aws:s3:::harshini-rahul-wedding-tfstate-${data.aws_caller_identity.current.account_id}/*",
    ]
  }

  statement {
    sid       = "TerraformLock"
    effect    = "Allow"
    actions   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"]
    resources = ["arn:aws:dynamodb:*:${data.aws_caller_identity.current.account_id}:table/harshini-rahul-wedding-tf-lock"]
  }

  # Deploy static site + read state of managed resources.
  # Broad service scope (project is single-tenant); tighten later if desired.
  statement {
    sid    = "ManageProject"
    effect = "Allow"
    actions = [
      "s3:*",
      "cloudfront:*",
      "lambda:*",
      "apigateway:*",
      "dynamodb:*",
      "iam:*",
      "ses:*",
      "logs:*",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "github_actions" {
  name   = "${local.project}-github-actions-policy"
  role   = aws_iam_role.github_actions.id
  policy = data.aws_iam_policy_document.github_actions.json
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions to assume via OIDC"
  value       = aws_iam_role.github_actions.arn
}
