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
        DB_HOST = 'mySQLServer'
        DB_PORT = '3306'
        // These will be fetched from Jenkins credentials store
        // DB_USER and DB_PASSWORD will be populated using withCredentials
    }

    stages {
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
                    def checkoutVars = checkout([$class: 'GitSCM', branches: [[name: "*/${BRANCH_NAME}"]], userRemoteConfigs: [[url: 'https://github.com/ICT2216-ICT3103-ICT3203-SSD-Grp18/ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18.git', credentialsId: 'PAT_Jenkins']]])
                    env.GIT_COMMIT = checkoutVars.GIT_COMMIT
                }
            }
        }
        stage('Clean Dependencies') {
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
                    script {
                        // Modify the version string in the XML report to avoid parsing issues
                        sh 'sed -i \'s/Version>10.0.1/Version>9.0.4/\' $(find . -name dependency-check-report.xml)'
                    }
                    dependencyCheckPublisher(pattern: '**/dependency-check-report.xml')
                }
            }
        }
        stage('Run Unit Tests') {
            steps {
                dir('backend') {
                    withCredentials([
                        usernamePassword(credentialsId: 'db_credentials', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASSWORD'), 
                        string(credentialsId: 'db_name', variable: 'DB_NAME'), 
                        usernamePassword(credentialsId: 'smtp_credentials', usernameVariable: 'EMAIL_USER', passwordVariable: 'EMAIL_PASS'),
                        string(credentialsId: 'jwt_secret', variable: 'JWT_SECRET')
                    ]) {
                        sh 'npx jest --detectOpenHandles --forceExit __tests__'
                    }
                }
            }
        }
        stage('Archive Test Results') {
            steps {
                junit 'junit.xml'
                archiveArtifacts artifacts: 'junit.xml', fingerprint: true
            }
        }
        stage('List and Archive Dependencies') {
            steps {
                sh 'npm list --all > dependencies.txt || true'
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
                dir('frontend') {
                    sh '''
                    # Set CI to false to not treat warnings as errors
                    CI=false npm run build
                    '''
                }
                sshagent(['jenkins_ssh_agent']) {
                    sh '''
                    mkdir -p ~/.ssh
                    ssh-keyscan -H webserver >> ~/.ssh/known_hosts
                    '''

                    sh '''
                    rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms package.json jenkins@webserver:/var/www/html/
                    rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms backend/ jenkins@webserver:/var/www/html/backend/
                    rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms frontend/ jenkins@webserver:/var/www/html/frontend/
                    '''

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
                        cd /var/www/html && pm2 delete 0 && pm2 start npm --name app -- start
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
                        https://api.github.com/repos/ICT2216-ICT3103-ICT3203-SSD-Grp18/ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18/pulls
                        """
                    }
                }
            }
        }
    }
}
