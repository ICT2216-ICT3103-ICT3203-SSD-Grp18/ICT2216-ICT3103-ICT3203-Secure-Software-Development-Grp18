pipeline {
  agent none
  stages {
    stage('Checkout SCM') {
      steps {
        git(url: 'https://github.com/ICT2216-ICT3103-ICT3203-SSD-Grp18/ICT2216-ICT3103-ICT3203-Secure-Software-Development-Grp18.git', branch: 'main', changelog: true, credentialsId: 'PAT_Jenkins_Jonathan', poll: true)
      }
    }

  }
}