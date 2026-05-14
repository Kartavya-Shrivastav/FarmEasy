# Key Pair for SSH access to EC2 instances
resource "aws_key_pair" "main" {
  key_name   = var.key_pair_name
  public_key = file("${path.module}/farmeasy-keypair.pub")
}

# K8s Master Node
resource "aws_instance" "k8s_master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.k8s_master_instance_type
  subnet_id              = aws_subnet.private[0].id
  vpc_security_group_ids = [aws_security_group.k8s.id]
  iam_instance_profile   = aws_iam_instance_profile.k8s_node.name
  key_name               = aws_key_pair.main.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = <<-EOF
    #!/bin/bash
    hostnamectl set-hostname farmeasy-master
    apt-get update -y
    apt-get install -y curl wget git
  EOF

  tags = { Name = "${var.project_name}-k8s-master", Role = "master" }
}

# K8s Worker Nodes
resource "aws_instance" "k8s_worker" {
  count                  = var.k8s_worker_count
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.k8s_worker_instance_type
  subnet_id              = aws_subnet.private[count.index % 2].id
  vpc_security_group_ids = [aws_security_group.k8s.id]
  iam_instance_profile   = aws_iam_instance_profile.k8s_node.name
  key_name               = aws_key_pair.main.key_name

  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = <<-EOF
    #!/bin/bash
    hostnamectl set-hostname farmeasy-worker-${count.index + 1}
    apt-get update -y
    apt-get install -y curl wget git
  EOF

  tags = { Name = "${var.project_name}-k8s-worker-${count.index + 1}", Role = "worker" }
}

# Jenkins EC2 Instance
resource "aws_instance" "jenkins" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.private[0].id
  vpc_security_group_ids = [aws_security_group.k8s.id]
  iam_instance_profile   = aws_iam_instance_profile.jenkins.name
  key_name               = aws_key_pair.main.key_name

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }

  user_data = <<-EOF
    #!/bin/bash
    hostnamectl set-hostname farmeasy-jenkins
    apt-get update -y
    apt-get install -y curl wget git
  EOF

  tags = { Name = "${var.project_name}-jenkins", Role = "jenkins" }
}

# Bastion Host (in public subnet for SSH access)
resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.k8s.id]
  key_name                    = aws_key_pair.main.key_name
  associate_public_ip_address = true

  root_block_device {
    volume_size           = 10
    volume_type           = "gp3"
    delete_on_termination = true
  }

  tags = { Name = "${var.project_name}-bastion", Role = "bastion" }
}