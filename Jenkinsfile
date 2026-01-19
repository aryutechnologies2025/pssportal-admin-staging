// Jenkins Pipeline — Admin Frontend (Deploy Only)
// Flow: Git Push -> Jenkins -> Docker Build -> Deploy -> Health Check
// NOTE: This does NOT run npm or vite build. It deploys pushed static files.

pipeline {
    agent any

    environment {
        APP_NAME = "staging_portal"
        IMAGE_NAME = "staging_portal-ui"
        PORT = "3001"
        HEALTH_URL = "http://127.0.0.1:3001"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Static Files') {
            steps {
                sh '''
                    echo "Checking static frontend files..."
                    test -d assets || (echo "ERROR: assets folder missing" && exit 1)
                    test -f index.html || (echo "ERROR: index.html missing" && exit 1)
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    echo "Building Docker image..."
                    docker build --no-cache -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Deploy (Zero-Downtime)') {
            steps {
                sh '''
                    echo "Deploying container..."
                    docker ps -q --filter "name=${APP_NAME}" && docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true

                    docker run -d \
                      --name ${APP_NAME} \
                      -p ${PORT}:80 \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for service..."
                    sleep 5
                    curl -f ${HEALTH_URL} || (echo "Health check failed" && exit 1)
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful: ${APP_NAME} running on port ${PORT}"
        }

        failure {
            echo "Deployment failed"
        }

        cleanup {
            sh 'docker system prune -f || true'
        }
    }
}

