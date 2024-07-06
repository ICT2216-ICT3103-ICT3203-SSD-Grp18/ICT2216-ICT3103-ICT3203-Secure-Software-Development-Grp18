pipeline {
    agent {
        label 'jenkins_node_agent'
    }

    parameters {
        string(defaultValue: 'Spaces-1', description: '', name: 'SpaceId', trim: true)
        string(defaultValue: 'ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18', description: '', name: 'ProjectName', trim: true)
        string(defaultValue: 'Dev', description: '', name: 'EnvironmentName', trim: true)
        string(defaultValue: 'Octopus', description: '', name: 'ServerId', trim: true)
    }

    environment {
        BRANCH_NAME = "${env.BRANCH_NAME}"
    }

    stages {
        stage('Setup') {
            steps {
                sh '''
                apt update -y
                apt upgrade -y
                apt full-upgrade -y
                apt autoremove -y
                apt install -y nodejs
                apt install -y npm
                '''
            }
        }
        stage('Environment') {
            steps {
                script {
                    BRANCH_NAME = env.GIT_BRANCH ?: 'main'
                    echo "PATH = ${env.PATH}"
                    echo "BRANCH_NAME = ${BRANCH_NAME}"
                }
            }
        }
        stage('Checkout') {
            steps {
                script {
                    def checkoutVars = checkout([$class: 'GitSCM', branches: [[name: "*/${BRANCH_NAME}"]], userRemoteConfigs: [[url: 'https://github.com/ICT2216-ICT3103-ICT3203-SSD-Grp18/Ticketing_Huat_Test.git', credentialsId: 'PAT_Jenkins']]])
                    env.GIT_COMMIT = checkoutVars.GIT_COMMIT
                }
            }
        }
        stage('clean Dependencies') {
            steps {
                sh 'rm -rf node_modules package-lock.json'
            }
        }
        stage('Install Dependencies') {
            parallel {
                stage('Install Root Dependencies') {
                    steps {
                        sh 'npm install'
                    }
                }
                stage('Install Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Install Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                dependencyCheck(additionalArguments: '--format XML --format HTML', odcInstallation: 'OWASP-Dependency-Check', nvdCredentialsId: 'nvd-api-key')
            }
            post {
                always {
                    dependencyCheckPublisher(pattern: '**/dependency-check-report.xml')
                }
            }
        }
        stage('List and Archive Dependencies') {
            steps {
                sh 'npm list --all > dependencies.txt'
                archiveArtifacts artifacts: 'dependencies.txt', fingerprint: true
                sh 'npm outdated > dependencyupdates.txt || true'
                archiveArtifacts artifacts: 'dependencyupdates.txt', fingerprint: true
            }
        }
        stage('Deploy to Web Server') {
            when {
                branch 'main'
            }
            steps {
                sshagent(['jenkins_ssh_agent']) {
                    // Ensure rsync is installed
                    sh '''
                    if ! command -v rsync &> /dev/null
                    then
                        apt-get update && apt-get install -y rsync
                    fi
                    '''
        
                    // Add web server to known_hosts
                    sh '''
                    ssh-keyscan -H webserver >> ~/.ssh/known_hosts
                    '''
        
                    // Deploy package.json and directories
                    sh '''
                    rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms package.json jenkins@webserver:/var/www/html/
                    rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms backend/ jenkins@webserver:/var/www/html/backend/
                    rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms frontend/ jenkins@webserver:/var/www/html/frontend/
                    '''
        
                    // Install dependencies and start the application using pm2 on the web server
                    sh '''
                    ssh jenkins@webserver "
                    if [ -d /var/www/html ]; then
                        cd /var/www/html && npm install
                    fi
                    if [ -d /var/www/html/backend ]; then
                        cd /var/www/html/backend && npm install
                    fi
                    if [ -d /var/www/html/frontend ]; then
                        cd /var/www/html/frontend && npm install
                    fi
                    if [ -d /var/www/html ]; then
                        cd /var/www/html && npx pm2 start npm --name app -- start
                    fi
                    "
                    '''
                }
            }
        }
    }
    post {
        success {
            script {
                if (BRANCH_NAME != 'main') {
                    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                        sh """
                        curl -H "Authorization: token $GITHUB_TOKEN" -X POST \
                        -d '{"title":"Merge ${BRANCH_NAME}","head":"${BRANCH_NAME}","base":"main"}' \
                        https://api.github.com/repos/ICT2216-ICT3103-ICT3203-SSD-Grp18/Ticketing_Huat_Test/pulls
                        """
                    }
                }
            }
        }
    }
}
