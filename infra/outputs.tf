# VPC Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = aws_subnet.private[*].id
}

# EC2 Outputs
output "k8s_master_private_ip" {
  description = "K8s master private IP"
  value       = aws_instance.k8s_master.private_ip
}

output "k8s_worker_private_ips" {
  description = "K8s worker private IPs"
  value       = aws_instance.k8s_worker[*].private_ip
}

output "bastion_public_ip" {
  description = "Bastion host public IP for SSH access"
  value       = aws_instance.bastion.public_ip
}

output "jenkins_private_ip" {
  description = "Jenkins private IP"
  value       = aws_instance.jenkins.private_ip
}

# ALB Outputs
output "alb_dns_name" {
  description = "ALB DNS name - use this as your API URL"
  value       = aws_lb.main.dns_name
}

# ElastiCache Outputs
output "redis_endpoint" {
  description = "ElastiCache Redis endpoint"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "ElastiCache Redis port"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].port
}

# S3 Outputs
output "produce_images_bucket" {
  description = "S3 bucket name for produce images"
  value       = aws_s3_bucket.produce_images.bucket
}

output "frontend_bucket" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_website_url" {
  description = "Frontend S3 website URL"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

# CloudFront Outputs
output "cloudfront_domain" {
  description = "CloudFront domain for produce images"
  value       = aws_cloudfront_distribution.produce_images.domain_name
}

# ECR Outputs
output "backend_ecr_url" {
  description = "Backend ECR repository URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "worker_ecr_url" {
  description = "Notification worker ECR repository URL"
  value       = aws_ecr_repository.notification_worker.repository_url
}