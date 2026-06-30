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

```
jobs:
  build:
    name: Build Application
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        # Get my GitHub repository code and place it inside the workflow workspace.
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 22.x
          cache: 'npm'
          cache-dependency-path: 'sample-app/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./sample-app
        run: npm ci
        # Cleanly installs the pakcages from package-lock.json, 
        # ensuring a consistent and reproducible build environment.
      
      - name: Run tests
        working-directory: ./sample-app
        run: npm test
        continue-on-error: true
        # Tells github to continue the workflow even if the tests fail, 
        # allowing for further steps to be executed.
      
      - name: Build application
        working-directory: ./sample-app
        run: npm run build
      
      - name: Create deployment package
        run: |
          cd sample-app
          zip -r ../app.zip . -x "node_modules/*" ".git/*"
          cd ..
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-artifact
          path: app.zip
          retention-days: 5
```

### OIDC Authentication Test

The reason for the OIDC authentication test is to confirm that GitHub Actions can securely authenticate to AWS using an IAM role. This provides a quick and safe method, preventing long-lived access keys; the workflow uses GitHub OpenID Connect to request temporary AWS credentials. Allowing for improved security, since no permanent/ hard coded credentials are stored inside the workflow 

```
oidc-test:
    name: OIDC Test
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout Source
        uses: actions/checkout@v4
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v6.1.0
        with:
          aws-region: eu-west-2
          role-to-assume: ${{ secrets.AWS_IAM_ROLE }}
          # The secrete is within Github settings -> Secrets and variable -> Actions
          # -> then to the Repository secrets
      - name: Test AWS Credentials
        run: aws sts get-caller-identity
```

### Deploy to staging

The staging deployment job performs the following steps:

- Downloads the build artifact
  
- Authenticates to AWS using OIDC
  
- Uploads app.zip to an S3 bucket
  
- Creates a new Elastic Beanstalk application version
  
- Updates the Elastic Beanstalk environment to deploy the new version

```
deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, oidc-test]
    environment: staging
    if: github.event_name == 'push' || github.event.inputs.environment == 'staging'
      
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: build-artifact
          path: .

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_IAM_ROLE }}
          aws-region: eu-west-2
        
      - name: Check files
        run: ls -la
        # Testing and seeing if files do exsist.

      - name: Upload file to S3
        run: |
            aws s3 cp ./app.zip s3://${{ secrets.AWS_S3_BUCKET }}/app.zip

      - name: Creating Elastic Beanstalk Application Verison
        run: |
          aws elasticbeanstalk create-application-version \
          --application-name ${{ secrets.ELASTIC_BEANSTALK_APP_NAME }} \
          --version-label ${{ github.run_id }} \
          --description ${{ github.run_id }} \
          --source-bundle S3Bucket=${{secrets.AWS_S3_BUCKET}},S3Key="app.zip"

      - name: ElasticBeanStalk Update Environment
        run: |
          aws elasticbeanstalk update-environment \
          --application-name ${{ secrets.ELASTIC_BEANSTALK_APP_NAME }} \
          --environment-name ${{ secrets.ELASTIC_BEANSTALK_ENV_NAME }} \
          --version-label ${{ github.run_id }}
```


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
GitHub Repository -> Settings -> Secrets and variables -> Actions
```

### AWS CLI Commands Used



## 5. Appendix 
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
