# GitHubActions

## 1. Overview
The idea of this project is to deploy my sample code from VSCode into AWS Beanstalk, allowing for a smooth process overall. The technologies I have used for this are AWS IAM, GitHub Actions, OIDC Authentication, Amazon S3, and AWS Elastic Beanstalk.

The sample application is built with Node.js and deployed to AWS Elastic Beanstalk through automation via a GitHub Actions pipeline. The workflow builds the application, creates a deployment, package, uploads the package to S3, creates the Elastic Beanstalk application version and updates the environment.

My main goal is to understand the lifecycle used from development to infrastructure, demonstrating cloud deployment automation, secure authentication, built artefacts, and application release management using GitHub automation.


## 2. Project Architecture
## 3. CI/CD Pipeline
## 4. Workflow Stages & Services

### Built App

The build job performs the following steps:

- Checks out the repository code

- Sets up Node.js

- Installs dependencies using npm ci

- Runs the test command

- Builds the application

- Creates a deployment package called app.zip
 
- Uploads the package as a GitHub Actions artefact

Separating each job from the others, making it easier to understand the process being done within the GitHub Actions.

### OIDC Authentication Test

The reason for the OIDC authentication test is to confirm that GitHub Actions can securely authenticate to AWS using an IAM role. This provides a quick and safe method, preventing long-lived access keys; the workflow uses GitHub OpenID Connect to request temporary AWS credentials. Allowing for improved security, since no permanent/ hard coded credentials are stored inside the workflow 

### Deploy to staging

The staging deployment job performs the following steps:

- Downloads the build artifact
  
- Authenticates to AWS using OIDC
  
- Uploads app.zip to an S3 bucket
  
- Creates a new Elastic Beanstalk application version
  
- Updates the Elastic Beanstalk environment to deploy the new version


### Why I used an S3 Bucket

The reason why I have used the S3 bucket is so that I can store my sample app within the S3 Bucket, making it easily accessible for GitHub Actions to push my app into Elastic Beanstalk. Also, this provides swift actions within the AWS environment, allowing everything to run smoothly and autonomously. 

The deployment process

App.zip uploaded to S3 -> Beanstalk version created from S3 -> Elastic Beanstalk environment updated to use that version

### Why Elastic Beanstalk is used

### Security / OIDC

### GitHub Secrets
Example secrets:
```
AWS_IAM_ROLE
AWS_S3_BUCKET
ELASTIC_BEANSTALK_APP_NAME
ELASTIC_BEANSTALK_ENV_NAME
```
These values are stored in:
```
GitHub Repository → Settings → Secrets and variables → Actions
```

## 5. AWS CLI Commands Used
## 6. Lessons Learned


```
name: Deploy to AWS Beanstalk

on:
  push:
    branches: [main]
    paths:
      - 'sample-app/**'
      - '.github/workflows/deploy-AWS-app-service.yml'
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to AWS Beanstalk'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```
