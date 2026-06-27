pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = '050916385394'
        AWS_REGION     = 'ap-south-1'
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        
        FRONTEND_REPO  = "shoe-shopping-page-frontend"
        BACKEND_REPO   = "shoe-shopping-page-backend"
        
        // Target manifest repository for GitOps tracking
        GITOPS_REPO    = "github.com/aman-yadavvv/enterprise-gitops-manifests.git"
    }
    
    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
                script {
                    // Extract short Git Commit SHA to use as a unique immutable image tag
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    echo "Target Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('AWS ECR Authentication') {
            steps {
                // Ensure the Jenkins server has the AWS CLI installed or IAM role attached
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('backend') {
                    sh "docker build -t ${ECR_REGISTRY}/${BACKEND_REPO}:${env.IMAGE_TAG} ."
                    sh "docker push ${ECR_REGISTRY}/${BACKEND_REPO}:${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${ECR_REGISTRY}/${FRONTEND_REPO}:${env.IMAGE_TAG} ."
                    sh "docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${env.IMAGE_TAG}"
                }
            }
        }

        stage('Update GitOps Manifests') {
            steps {
                // Isolate manifest updates inside a distinct workspace folder
                dir('manifest-updates-workspace') {
                    // Pull GitHub personal access token safely from Jenkins credential store
                    withCredentials([usernamePassword(credentialsId: 'github-token-id', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        
                        sh "git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@${GITOPS_REPO} ."
                        
                        // Dynamically update placeholder tags to match our new ECR images
                        sh "sed -i 's|image: ${ECR_REGISTRY}/${BACKEND_REPO}:.*|image: ${ECR_REGISTRY}/${BACKEND_REPO}:${env.IMAGE_TAG}|g' environments/dev/backend-deployment.yaml"
                        sh "sed -i 's|image: ${ECR_REGISTRY}/${FRONTEND_REPO}:.*|image: ${ECR_REGISTRY}/${FRONTEND_REPO}:${env.IMAGE_TAG}|g' environments/dev/frontend-deployment.yaml"
                        
                        // Commit configuration changes back into the manifest repo
                        sh 'git config user.email "jenkins-automation@enterprise.com"'
                        sh 'git config user.name "Jenkins Automation Server"'
                        sh "git add ."
                        sh "git commit -m 'GitOps: Deploying image tag ${env.IMAGE_TAG} [skip ci]'"
                        sh "git push origin main"
                    }
                }
            }
        }
    }
}
