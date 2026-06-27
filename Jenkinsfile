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
                script {
                    // Injecting AWS credentials safely into the environment block
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        def ecrToken = sh(script: "aws ecr get-login-password --region ${AWS_REGION}", returnStdout: true).trim()
                        sh "echo '${ecrToken}' | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    }
                }
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
                dir('manifest-updates-workspace') {
                    withCredentials([usernamePassword(credentialsId: 'github-token-id', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                        
                        sh "git clone https://${GIT_USERNAME}:${GIT_PASSWORD}@${GITOPS_REPO} ."
                        
                        sh "sed -i 's|image: ${ECR_REGISTRY}/${BACKEND_REPO}:.*|image: ${ECR_REGISTRY}/${BACKEND_REPO}:${env.IMAGE_TAG}|g' environments/dev/backend-deployment.yaml"
                        sh "sed -i 's|image: ${ECR_REGISTRY}/${FRONTEND_REPO}:.*|image: ${ECR_REGISTRY}/${FRONTEND_REPO}:${env.IMAGE_TAG}|g' environments/dev/frontend-deployment.yaml"
                        
                        sh 'git config user.email "jenkins-automation@enterprise.com"'
                        sh 'git config user.name "Jenkins Automation Server"'
                        
                        // Smart Git Commit: Only commit if there are actual diff changes
                        sh '''
                            git add .
                            if git diff-index --quiet HEAD --; then
                                echo "No changes detected in manifests. Skipping git commit."
                            else
                                git commit -m "GitOps: Deploying image tag ${IMAGE_TAG} [skip ci]"
                                git push origin main
                            fi
                        '''
                    }
                }
            }
        }
    }
}
