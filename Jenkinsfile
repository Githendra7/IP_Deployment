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
                        powershell '''
                            # 1. Fix SSH Key Permissions (REQUIRED on Windows)
                            $sid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value
                            icacls "$env:SSH_KEY" /inheritance:r
                            icacls "$env:SSH_KEY" /grant:r "*$($sid):R"

                            # 2. Transfer the .env file to the EC2 first
                            scp -i "$env:SSH_KEY" -o StrictHostKeyChecking=no "$env:ENV_FILE" "$($env:EC2_USER)@$($env:EC2_IP):/home/ubuntu/.env"

                            # 3. Run the deployment commands
                            # Increased logging and added 'backend' to capture the 500 error traceback
                            ssh -i "$env:SSH_KEY" -o StrictHostKeyChecking=no "$($env:EC2_USER)@$($env:EC2_IP)" "if [ ! -d 'ip-deployment' ]; then git clone $($env:GIT_REPO_URL) ip-deployment; fi; cd ip-deployment && git pull origin main && cp /home/ubuntu/.env .env && cp /home/ubuntu/.env backend/.env && docker compose up -d --build --force-recreate && echo '--- Container Status ---' && docker compose ps && echo '--- Backend Logs ---' && docker compose logs backend --tail 100 && echo '--- Nginx Logs ---' && docker compose logs nginx --tail 20"
                        '''
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
