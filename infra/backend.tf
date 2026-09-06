terraform {
  backend "s3" {
    bucket         = "harshini-rahul-wedding-tfstate-254673213368"
    key            = "wedding/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "harshini-rahul-wedding-tf-lock"
    encrypt        = true
  }
}
