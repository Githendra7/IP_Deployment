pipeline {
    agent any

    environment {
        EC2_IP         = '16.16.242.152'
        EC2_USER       = 'ubuntu'
        SSH_KEY_ID     = 'ec2-ssh-key' // Name of the credential in Jenkins
        ENV_FILE_ID    = 'project-env-file' // ID of your .env file in Jenkins
        GIT_REPO_URL   = 'https://github.com/Githendra7/IP_Deployment.git'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Deploy to EC2') {
            steps {
                // This uses the '.env' file you uploaded to Jenkins
                configFileProvider([configFile(fileId: env.ENV_FILE_ID, variable: 'ENV_FILE')]) {
                    withCredentials([sshUserPrivateKey(credentialsId: env.SSH_KEY_ID, keyFileVariable: 'SSH_KEY')]) {
                        bat """
                            REM 1. Transfer the .env file to the EC2 first
                            scp -i "%SSH_KEY%" -o StrictHostKeyChecking=no "%ENV_FILE%" ${EC2_USER}@${EC2_IP}:/home/ubuntu/.env

                            REM 2. Run the deployment commands
                            ssh -i "%SSH_KEY%" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} "
                                if [ ! -d 'ip-deployment' ]; then
                                    git clone ${GIT_REPO_URL} ip-deployment
                                fi
                                cd ip-deployment && \
                                git pull origin main && \
                                cp /home/ubuntu/.env .env && \
                                cp /home/ubuntu/.env backend/.env && \
                                docker compose up -d --build
                            "
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Application deployed to EC2 at http://${EC2_IP}"
        }
        failure {
            echo "FAILED: Check Jenkins logs and EC2 connectivity."
        }
    }
}
