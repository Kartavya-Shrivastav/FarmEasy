# S3 Bucket for produce images
resource "aws_s3_bucket" "produce_images" {
  bucket        = "${var.project_name}-produce-images-${var.account_id}"
  force_destroy = true

  tags = { Name = "${var.project_name}-produce-images" }
}

# Block all public access
resource "aws_s3_bucket_public_access_block" "produce_images" {
  bucket = aws_s3_bucket.produce_images.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning
resource "aws_s3_bucket_versioning" "produce_images" {
  bucket = aws_s3_bucket.produce_images.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CORS configuration for frontend uploads
resource "aws_s3_bucket_cors_configuration" "produce_images" {
  bucket = aws_s3_bucket.produce_images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3 Bucket for frontend static files
resource "aws_s3_bucket" "frontend" {
  bucket        = "${var.project_name}-frontend-${var.account_id}"
  force_destroy = true

  tags = { Name = "${var.project_name}-frontend" }
}

# Allow public read for frontend bucket
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Frontend bucket policy - allow public read
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  depends_on = [aws_s3_bucket_public_access_block.frontend]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })
}

# Frontend bucket website configuration
resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

# CloudFront distribution for produce images
resource "aws_cloudfront_distribution" "produce_images" {
  origin {
    domain_name              = aws_s3_bucket.produce_images.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.produce_images.bucket}"
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.produce_images.bucket}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = { Name = "${var.project_name}-cdn" }
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "${var.project_name}-oac"
  description                       = "OAC for FarmEasy S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Allow CloudFront to read from S3
resource "aws_s3_bucket_policy" "produce_images" {
  bucket     = aws_s3_bucket.produce_images.id
  depends_on = [aws_s3_bucket_public_access_block.produce_images]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontAccess"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.produce_images.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.produce_images.arn
          }
        }
      }
    ]
  })
}