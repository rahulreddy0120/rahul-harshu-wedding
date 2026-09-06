terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

# ACM certificate must be in us-east-1 for CloudFront
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = var.aws_profile
}

locals {
  project = "harshini-rahul-wedding"
  tags = {
    Project     = "HarshiniRahulWedding"
    Environment = "prod"
    ManagedBy   = "Terraform"
  }
}
