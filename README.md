# GitHubActions

## 1. Overview
The idea of this project is to deploy my sample code from VSCode into AWS Beanstalk, allowing for a smooth process overall. The technologies I have used for this are AWS IAM, GitHub Actions, OIDC Authentication, Amazon S3, and AWS Elastic Beanstalk.

The sample application is built with Node.js and deployed to AWS Elastic Beanstalk through automation via a GitHub Actions pipeline. The workflow builds the application, creates a deployment, package, uploads the package to S3, creates the Elastic Beanstalk application version and updates the environment.

My main goal is to understand the lifecycle used from development to infrastructure, demonstrating cloud deployment automation, secure authentication, built artefacts, and application release management using GitHub automation.


## 2. Technologies Used
## 3. Project Architecture
## 4. CI/CD Pipeline
## 5. Workflow Stages
## 6. Security / OIDC
## 7. GitHub Secrets
## 8. What This Project Demonstrates
## 9. AWS CLI Commands Used
## 10. Lessons Learned


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
