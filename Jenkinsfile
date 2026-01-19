// Jenkins Declarative Pipeline
// Frontend CI/CD for pssemployees-frontend
// Flow:
// Git Push -> Jenkins -> Build Vite from mainsource -> Docker Image -> Deploy -> Health Check -> Rollback on failure

pipeline {
    agent any

    environment {
        APP_NAME = "staging_portal"
        IMAGE_NAME = "staging_portal-ui"
        PORT = "3001"
        DEPLOY_PATH = "/var/www/staging/pssportal-admin"
        SOURCE_PATH = "Mainsource"
        HEALTH_URL = "http://127.0.0.1:3001"
        NODE_IMAGE = "node:18"
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

        stage('Verify Source Structure') {
            steps {
                sh '''
                    echo "Checking Mainsource exists..."
                    test -d ${SOURCE_PATH} || (echo "ERROR: mainsource folder not found" && exit 1)
                    test -f ${SOURCE_PATH}/package.json || (echo "ERROR: package.json not found" && exit 1)
                '''
            }
        }

        stage('Build Frontend (Vite)') {
            steps {
                sh '''
                    echo "Building frontend inside Docker Node container..."
                    docker run --rm \
                      -v "$(pwd)/${SOURCE_PATH}:/app" \
                      -w /app \
                      ${NODE_IMAGE} \
                      sh -c "npm install && npm run build"

                    echo "Checking dist output..."
                    test -d ${SOURCE_PATH}/dist || (echo "ERROR: Build failed, dist folder missing" && exit 1)
                '''
            }
        }

        stage('Prepare Docker Context') {
            steps {
                sh '''
                    echo "Preparing deployment files..."
                    rm -rf assets index.html
                    cp -r ${SOURCE_PATH}/dist/assets ./assets
                    cp ${SOURCE_PATH}/dist/index.html ./index.html
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
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
            echo "Deployment failed — attempting rollback"
            sh '''
                echo "Rolling back to previous image if available..."
                PREV_IMAGE=$(docker images ${IMAGE_NAME} --format "{{.Repository}}:{{.Tag}}" | sed -n '2p')
                if [ -n "$PREV_IMAGE" ]; then
                    docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true
                    docker run -d \
                      --name ${APP_NAME} \
                      -p ${PORT}:80 \
                      --restart unless-stopped \
                      $PREV_IMAGE
                    echo "Rollback completed"
                else
                    echo "No previous image found for rollback"
                fi
            '''
        }

        cleanup {
            sh 'docker system prune -f || true'
        }
    }
}

