# GitHubActions

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
