pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = '625966732962'
        AWS_REGION     = 'eu-north-1'
        BACKEND_REPO   = 'protostruct-backend'
        FRONTEND_REPO  = 'protostruct-frontend'
        ECR_REGISTRY   = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        AWS_CREDS      = credentials('aws-creds')
        ECS_CLUSTER    = 'protostruct-cluster'
        BACKEND_SERVICE = 'protostruct-backend-service'
        FRONTEND_SERVICE = 'protostruct-frontend-service'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('ECR Login') {
            steps {
                bat """
                    aws configure set aws_access_key_id %AWS_CREDS_USR% && ^
                    aws configure set aws_secret_access_key %AWS_CREDS_PSW% && ^
                    aws configure set region %AWS_REGION% && ^
                    aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %ECR_REGISTRY%
                """
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('backend') {
                    bat "docker build -t %BACKEND_REPO%:%IMAGE_TAG% ."
                    bat "docker tag %BACKEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%BACKEND_REPO%:%IMAGE_TAG%"
                    bat "docker tag %BACKEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%BACKEND_REPO%:latest"
                    bat "docker push %ECR_REGISTRY%/%BACKEND_REPO%:%IMAGE_TAG%"
                    bat "docker push %ECR_REGISTRY%/%BACKEND_REPO%:latest"
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend/next-app') {
                    // Note: Ensure these NEXT_PUBLIC_* variables are configured in Jenkins Environment or as credentials
                    bat """
                        docker build -t %FRONTEND_REPO%:%IMAGE_TAG% ^
                            --build-arg NEXT_PUBLIC_SUPABASE_URL=%NEXT_PUBLIC_SUPABASE_URL% ^
                            --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=%NEXT_PUBLIC_SUPABASE_ANON_KEY% ^
                            --build-arg NEXT_PUBLIC_API_URL=%NEXT_PUBLIC_API_URL% .
                    """
                    bat "docker tag %FRONTEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%FRONTEND_REPO%:%IMAGE_TAG%"
                    bat "docker tag %FRONTEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%FRONTEND_REPO%:latest"
                    bat "docker push %ECR_REGISTRY%/%FRONTEND_REPO%:%IMAGE_TAG%"
                    bat "docker push %ECR_REGISTRY%/%FRONTEND_REPO%:latest"
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                bat """
                    aws ecs update-service --cluster %ECS_CLUSTER% --service %BACKEND_SERVICE% --force-new-deployment --region %AWS_REGION% && ^
                    aws ecs update-service --cluster %ECS_CLUSTER% --service %FRONTEND_SERVICE% --force-new-deployment --region %AWS_REGION%
                """
            }
        }

        stage('Cleanup Local Images') {
            steps {
                bat "docker rmi %BACKEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%BACKEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%BACKEND_REPO%:latest || exit 0"
                bat "docker rmi %FRONTEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%FRONTEND_REPO%:%IMAGE_TAG% %ECR_REGISTRY%/%FRONTEND_REPO%:latest || exit 0"
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Images pushed to ECR (eu-north-1) with tag ${BUILD_NUMBER}"
        }
        failure {
            echo "FAILED: Check Docker build logs above. Ensure ECR repos 'protostruct-backend' and 'protostruct-frontend' exist in eu-north-1."
        }
        always {
            // Clean workspace after every build to free disk space
            cleanWs()
        }
    }
}
