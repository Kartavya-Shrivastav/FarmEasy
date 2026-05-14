pipeline {
  agent any

  environment {
    AWS_REGION       = 'ap-south-1'
    ECR_REGISTRY     = '982389017776.dkr.ecr.ap-south-1.amazonaws.com'
    BACKEND_IMAGE    = "${ECR_REGISTRY}/farmeasy/backend:latest"
    WORKER_IMAGE     = "${ECR_REGISTRY}/farmeasy/notification-worker:latest"
    KUBECONFIG       = '/var/lib/jenkins/.kube/config'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        sh "docker build -t ${BACKEND_IMAGE} -f docker/Dockerfile.backend ."
        sh "docker build -t ${WORKER_IMAGE} -f docker/Dockerfile.worker ."
      }
    }

    stage('Push to ECR') {
      steps {
        withCredentials([aws(credentialsId: 'aws-credentials')]) {
          sh """
            aws ecr get-login-password --region ${AWS_REGION} | \
            docker login --username AWS --password-stdin ${ECR_REGISTRY}
            docker push ${BACKEND_IMAGE}
            docker push ${WORKER_IMAGE}
          """
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh """
          kubectl set image deployment/farmeasy-backend \
            backend=${BACKEND_IMAGE} -n farmeasy
          kubectl set image deployment/notification-worker \
            worker=${WORKER_IMAGE} -n farmeasy
          kubectl rollout status deployment/farmeasy-backend \
            -n farmeasy --timeout=120s
        """
      }
      post {
        failure {
          sh 'kubectl rollout undo deployment/farmeasy-backend -n farmeasy'
          sh 'kubectl rollout undo deployment/notification-worker -n farmeasy'
        }
      }
    }
  }

  post {
    always {
      sh "docker rmi ${BACKEND_IMAGE} || true"
      sh "docker rmi ${WORKER_IMAGE} || true"
    }
  }
}