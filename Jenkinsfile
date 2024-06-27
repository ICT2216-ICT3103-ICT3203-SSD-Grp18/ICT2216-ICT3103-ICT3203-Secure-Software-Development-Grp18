pipeline {
  agent any

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
    stage('List and Archive Dependencies') {
      steps {
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
    stage('Test Backend') {
      steps {
        dir('backend') {
          sh 'npm test'
        }
      }
    }
    stage('Test Frontend') {
      steps {
        dir('frontend') {
          sh 'npm test'
        }
      }
    }
  }
}
