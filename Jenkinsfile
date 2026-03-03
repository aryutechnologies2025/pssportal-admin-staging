pipeline {
agent any

environment {
CONTAINER_NAME = "staging_portal"
DEPLOY_BRANCH  = "main"
HEALTH_URL     = "http://127.0.0.1:3001"
DEPLOY_PATH    = "/usr/local/apache2/htdocs"
APP_DIR        = "Mainsource"
}

options {
timestamps()
disableConcurrentBuilds()
}

stages {

```
/* =====================
   CHECKOUT SOURCE
====================== */
stage('Checkout Source') {
  steps {
    checkout scm
    sh 'git log --oneline -1'
  }
}

/* =====================
   CLEAN OLD BUILD
====================== */
stage('Clean') {
  steps {
    dir("${APP_DIR}") {
      sh 'rm -rf node_modules dist'
    }
  }
}

/* =====================
   INSTALL DEPENDENCIES
====================== */
stage('Install Dependencies') {
  steps {
    dir("${APP_DIR}") {
      sh '''
        set -e
        npm ci --no-audit --no-fund || \
        npm install --legacy-peer-deps --no-audit --no-fund
      '''
    }
  }
}

/* =====================
   BUILD FRONTEND
====================== */
stage('Build Frontend') {
  steps {
    dir("${APP_DIR}") {
      sh 'npm run build'
    }
  }
}

/* =====================
   VERIFY BUILD
====================== */
stage('Verify Build') {
  steps {
    dir("${APP_DIR}") {
      sh '''
        test -f dist/index.html
        echo "✅ Admin Build Successful"
      '''
    }
  }
}

/* =====================
   ADD SPA REWRITE
====================== */
stage('Add SPA Rewrite Rule') {
  steps {
    sh '''
```

cat <<EOF > Mainsource/dist/.htaccess <IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L] </IfModule>
EOF
'''
}
}

```
/* =====================
   DEPLOY TO CONTAINER
====================== */
stage('Deploy') {
  steps {

    sh '''
      docker exec ${CONTAINER_NAME} \
      mkdir -p ${DEPLOY_PATH}_new
    '''

    dir("${APP_DIR}") {
      sh '''
        docker cp dist/. \
        ${CONTAINER_NAME}:${DEPLOY_PATH}_new/
      '''
    }

    sh '''
      docker exec ${CONTAINER_NAME} sh -c "
        rm -rf ${DEPLOY_PATH}_old || true
        mv ${DEPLOY_PATH} ${DEPLOY_PATH}_old
        mv ${DEPLOY_PATH}_new ${DEPLOY_PATH}
      "
    '''
  }
}

/* =====================
   HEALTH CHECK
====================== */
stage('Health Check') {
  steps {
    sh '''
      sleep 5
      curl -f ${HEALTH_URL}
    '''
  }
}
```

}

post {
success {
echo "✅ ADMIN FRONTEND DEPLOYED SUCCESSFULLY"
}
failure {
echo "❌ DEPLOY FAILED — OLD VERSION PRESERVED"
}
}
}

