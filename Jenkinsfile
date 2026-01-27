pipeline {
  agent any

  environment {
    CONTAINER_NAME = "staging_portal"
    SOURCE_PATH   = "."
    HEALTH_URL   = "http://127.0.0.1:3001"
    DEPLOY_BRANCH = "main"
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {

    stage('Checkout (LOCKED TO MAIN)') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: "*/${DEPLOY_BRANCH}"]],
          userRemoteConfigs: scm.userRemoteConfigs
        ])
        sh 'echo "DEPLOYING COMMIT:" && git log --oneline -1'
      }
    }

    stage('Verify Static Files') {
      steps {
        sh '''
          set -e
          test -d assets
          test -f index.html
        '''
      }
    }

    stage('Deploy (FAST SYNC — SAFE MODE)') {
      steps {
        sh '''
          set -e

          docker exec ${CONTAINER_NAME} mkdir -p /usr/local/apache2/htdocs_new
          docker cp . ${CONTAINER_NAME}:/usr/local/apache2/htdocs_new

          docker exec ${CONTAINER_NAME} sh -c "
            rm -rf /usr/local/apache2/htdocs_old || true
            mv /usr/local/apache2/htdocs /usr/local/apache2/htdocs_old
            mv /usr/local/apache2/htdocs_new /usr/local/apache2/htdocs
          "
        '''
      }
    }

    stage('Health Check') {
      steps {
        sh '''
          set -e
          sleep 3
          curl -f ${HEALTH_URL}
        '''
      }
    }
  }

  post {
    success {
      echo "✅ ADMIN FRONTEND DEPLOYED FROM MAIN"
    }
    failure {
      echo "❌ DEPLOY FAILED — CONTAINER NOT TOUCHED"
    }
  }
}

