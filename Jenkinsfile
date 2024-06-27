pipeline {
  agent any
  stages {
    stage('Build backend') {
      steps {
        sh 'cd backend'
        sh 'npm install'
      }
    }
    stage('Build frontend') {
      steps {
        sh 'cd frontend'
        sh 'npm install'
      }
    }
  }
}
