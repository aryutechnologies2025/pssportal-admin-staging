pipeline {
    agent any

    environment {
        APP_NAME = "staging_portal"
        IMAGE_NAME = "staging_portal-ui"
        PORT = "3001"
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

        stage('Build Frontend (Vite)') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$(pwd)/${SOURCE_PATH}:/app" \
                      -w /app \
                      ${NODE_IMAGE} \
                      sh -c "npm install && npm run build"

                    test -d ${SOURCE_PATH}/dist || (echo "Build failed: dist missing" && exit 1)
                '''
            }
        }

        stage('Prepare Files for Docker') {
            steps {
                sh '''
                    rm -rf assets index.html
                    cp -r ${SOURCE_PATH}/dist/assets ./assets
                    cp ${SOURCE_PATH}/dist/index.html ./index.html
                '''
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                    docker build --no-cache -t ${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker stop ${APP_NAME} || true
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
                    sleep 5
                    curl -f ${HEALTH_URL}
                '''
            }
        }
    }
}

