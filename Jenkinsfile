pipeline {
  agent any
  stages {
    stage('Environment') {
      steps {
        echo "PATH = ${env.PATH}"
      }
    }

    stage('Checkout') {
      steps {
        script {
          def checkoutVars = checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/ICT2216-ICT3103-ICT3203-SSD-Grp18/ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18.git', credentialsId: 'PAT_Jenkins_Jonathan']]])
          env.GIT_URL = checkoutVars.GIT_URL
          env.GIT_COMMIT = checkoutVars.GIT_COMMIT
          env.GIT_BRANCH = checkoutVars.GIT_BRANCH
        }

      }
    }

    stage('Dependencies') {
      steps {
        dir(path: 'backend') {
          sh 'npm install'
        }

        dir(path: 'frontend') {
          sh 'npm install'
        }

        sh 'npm list --all > dependencies.txt'
        archiveArtifacts(artifacts: 'dependencies.txt', fingerprint: true)
        sh 'npm outdated > dependencyupdates.txt || true'
        archiveArtifacts(artifacts: 'dependencyupdates.txt', fingerprint: true)
      }
    }

    stage('Build Backend') {
      steps {
        dir(path: 'backend') {
          sh 'npm run build'
        }

      }
    }

    stage('Build Frontend') {
      steps {
        dir(path: 'frontend') {
          sh 'npm run build'
        }

      }
    }

    stage('Test') {
      steps {
        dir(path: 'backend') {
          sh 'npm test'
        }

        dir(path: 'frontend') {
          sh 'npm test'
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