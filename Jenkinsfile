pipeline {
  agent any
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
          def checkoutVars = checkout([$class: 'GitSCM', branches: [[name: "*/${BRANCH_NAME}"]], userRemoteConfigs: [[url: 'https://github.com/ICT2216-ICT3103-ICT3203-SSD-Grp18/ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18.git', credentialsId: 'PAT_Jenkins_Jonathan']]])
          env.GIT_COMMIT = checkoutVars.GIT_COMMIT
        }

      }
    }

    stage('Install Root Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Install Backend Dependencies') {
      parallel {
        stage('Install Backend Dependencies') {
          steps {
            dir(path: 'backend') {
              sh 'npm install'
            }

          }
        }

        stage('') {
          steps {
            dir(path: 'frontend') {
              sh 'npm install'
            }

          }
        }

      }
    }

    stage('Dependency Check') {
      post {
        always {
          dependencyCheckPublisher(pattern: '**/dependency-check-report.xml')
        }

      }
      steps {
        dependencyCheck(additionalArguments: '--format XML --format HTML', odcInstallation: 'OWASP-Dependency-Check', nvdCredentialsId: 'nvd-api-key')
      }
    }

    stage('List and Archive Dependencies') {
      steps {
        sh 'npm list --all > dependencies.txt'
        archiveArtifacts(artifacts: 'dependencies.txt', fingerprint: true)
        sh 'npm outdated > dependencyupdates.txt || true'
        archiveArtifacts(artifacts: 'dependencyupdates.txt', fingerprint: true)
      }
    }

    stage('Deploy to Web Server') {
      when {
        branch 'main'
      }
      steps {
        sshagent(credentials: ['jenkins-ssh-key']) {
          sh '''
          rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms ./ jenkins@webserver:/var/www/html/
          '''
          sh '''
          rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms ./backend/ jenkins@webserver:/var/www/html/backend/
          '''
          sh '''
          rsync -av --exclude="node_modules" --exclude="package-lock.json" --no-times --no-perms ./frontend/ jenkins@webserver:/var/www/html/frontend/
          '''
          sh '''
          ssh jenkins@webserver << EOF
          cd /var/www/html && npm install
          cd /var/www/html/backend && npm install
          cd /var/www/html/frontend && npm install
          EOF
          '''
        }

      }
    }

  }
  environment {
    BRANCH_NAME = "${env.BRANCH_NAME}"
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
  parameters {
    string(defaultValue: 'Spaces-1', description: '', name: 'SpaceId', trim: true)
    string(defaultValue: 'ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18', description: '', name: 'ProjectName', trim: true)
    string(defaultValue: 'Dev', description: '', name: 'EnvironmentName', trim: true)
    string(defaultValue: 'Octopus', description: '', name: 'ServerId', trim: true)
  }
}