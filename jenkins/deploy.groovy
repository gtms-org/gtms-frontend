def branch = '';

pipeline {
    agent { 
        docker { 
                image 'docker-registry.kabala.tech/alpine-terraform:latest' 
                args '-v /var/run/docker.sock:/var/run/docker.sock:rw,z'
            } 
        }

    environment {
        CI = 'true'
        DOCKER_REGISTRY_USERNAME = credentials('docker-registry-username')
        DOCKER_REGISTRY_PASSWORD = credentials('docker-registry-password')
        AWS_ACCESS_KEY_ID = credentials('SCALEWAY_S3_ACCESS_KEY')
        AWS_SECRET_ACCESS_KEY = credentials('SCALEWAY_S3_ACCESS_SECRET_KEY')
        FB_APP_ID = credentials('gtms-app-andrew-qa-master-fb-app-id')
        GOOGLE_CLIENT_ID = credentials('gtms-qa-master-google-client-id')
    }

    stages {
        stage ('prepare') {
            steps {
                script {
                    try {
                        branch = env.GIT_LOCAL_BRANCH
                        branch = branch ?: env.GIT_BRANCH
                        if (branch == 'detached') {
                            branch = ''
                        }
                        branch = branch ?: env.ghprbActualCommit
                    } catch (e) {
                        println "GIT BRANCH not detected"
                    }

                    sh 'git config user.name "jenkins-kabala.tech"'
                    sh 'git config user.email "jenkins@kabala.tech"'

                    if (!branch) {
                        error "GIT branch to process not found"
                    }

                    if (branch.startsWith('origin/')) {
                        branch = branch.replaceAll('origin/', '')
                    }

                    println "GIT branch to process: ${branch}"
                    manager.addShortText(branch, "white", "navy", "1px", "navy")
                    
                    sh "printenv"
                }
            }
        }
        stage ('Checkout') {
            steps {
                    checkout([
                            $class                           : 'GitSCM',
                            branches                         : [[name: "${branch}"]],
                            browser                          : [$class: 'GithubWeb', repoUrl: "https://github.com/gtms-org/gtms-frontend"],
                            doGenerateSubmoduleConfigurations: false,
                            userRemoteConfigs                : [[
                                credentialsId: 'github',
                                refspec      : '+refs/pull/*:refs/remotes/origin/pr/*',
                                url          : "git@github.com:gtms-org/gtms-frontend.git"
                            ]]
                    ])
            }
        }
        stage ('Deploy app-andrew') {
            steps {
                dir("packages/app-andrew/terraform") {
                    script {
                        docker.withRegistry('https://docker-registry.kabala.tech', 'docker-registry-credentials') {
                            sh "terraform init"
                            sh "terraform workspace select ${env.DEPLOY_ENVIRONMENT} || terraform workspace new ${env.DEPLOY_ENVIRONMENT}"
                            sh "terraform plan -out deploy.plan -var-file=${env.DEPLOY_ENVIRONMENT}.tfvars -var=\"tag=${version}\" -var=\"fb_app_id=${FB_APP_ID}\" -var=\"google_client_id=${GOOGLE_CLIENT_ID}\" -var=\"DOCKER_REGISTRY_USERNAME=${DOCKER_REGISTRY_USERNAME}\" -var=\"DOCKER_REGISTRY_PASSWORD=${DOCKER_REGISTRY_PASSWORD}\"" 
                            sh "terraform apply -auto-approve deploy.plan"
                        }
                    }
                }
            }

            post {
                success {
                    rocketSend channel: "deployments-${env.DEPLOY_ENVIRONMENT}", message: "[${BUILD_DISPLAY_NAME}] :sunny: *app-andrew* version: *${version}* Build succeeded - ${env.JOB_NAME} ${env.BUILD_NUMBER}  (<${env.BUILD_URL}|Open>)", rawMessage: true
                }
                unsuccessful {
                    rocketSend channel: "deployments-${env.DEPLOY_ENVIRONMENT}", message: "[${BUILD_DISPLAY_NAME}] :sob: *app-andrew* version: *${version}* Build failed - ${env.JOB_NAME} ${env.BUILD_NUMBER}  (<${env.BUILD_URL}|Open>)", rawMessage: true
                }
            }
        }
    }
}
