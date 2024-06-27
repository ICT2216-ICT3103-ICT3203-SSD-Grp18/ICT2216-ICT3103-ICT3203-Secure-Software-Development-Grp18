pipeline {
  agent {
    dockerContainer {
      image 'node:20' // Use an appropriate Node.js Docker image
      args '-u root' // Run as root user to install packages
    }
  }

  parameters {
    string(defaultValue: 'Spaces-1', description: '', name: 'SpaceId', trim: true)
    string(defaultValue: 'ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18', description: '', name: 'ProjectName', trim: true)
    string(defaultValue: 'Dev', description: '', name: 'EnvironmentName', trim: true)
    string(defaultValue: 'Octopus', description: '', name: 'ServerId', trim: true)
  }

  stages {
    stage('Environment') {
      steps {
        echo "PATH = ${env.PATH}"
      }
    }
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: 'https://github.com/ICT2216-ICT3103-ICT3203-SSD-Grp18/ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18.git', credentialsId: 'PAT_Jenkins_Jonathan']]])
      }
    }
    stage('Dependencies') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
        dir('frontend') {
          sh 'npm install'
        }
        sh 'npm list --all > dependencies.txt'
        archiveArtifacts artifacts: 'dependencies.txt', fingerprint: true
        sh 'npm outdated > dependencyupdates.txt || true'
        archiveArtifacts artifacts: 'dependencyupdates.txt', fingerprint: true
      }
    }
    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'npm run build'
        }
      }
    }
    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }
    stage('Test') {
      steps {
        dir('backend') {
          sh 'npm test'
        }
        dir('frontend') {
          sh 'npm test'
        }
      }
    }
  }
}
