# DevOps Guide

## CI/CD Pipelines - GitHub Actions and Jenkins
**Description:** Automation of continuous integration and deployment processes using GitHub Actions and Jenkins, including workflows, jobs, stages, and best practices for robust pipelines.

**Example:**
```yaml
# GitHub Actions - Complete Workflow
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1'  # Weekly on Monday 2AM

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        env:
          NODE_ENV: test
          DATABASE_URL: ${{ secrets.TEST_DB_URL }}
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Deploy to Staging
        run: |
          echo "Deploying to staging..."
          # kubectl set image deployment/app app=ghcr.io/${{ github.repository }}:${{ github.sha }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # Deployment commands here

# Jenkins Pipeline (Declarative)
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'prod'],
            description: 'Target environment'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution'
        )
    }
    
    environment {
        DOCKER_IMAGE = 'myapp'
        REGISTRY = 'registry.company.com'
        KUBECONFIG = credentials('kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git clean -fdx'
            }
        }
        
        stage('Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run build'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'dist/**/*'
                        }
                    }
                }
                
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            when {
                not { params.SKIP_TESTS }
            }
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results.xml'
                            publishCoverage adapters: [
                                istanbulCoberturaAdapter('coverage/cobertura-coverage.xml')
                            ]
                        }
                    }
                }
                
                stage('Integration Tests') {
                    steps {
                        sh 'docker-compose -f docker-compose.test.yml up -d'
                        sh 'npm run test:integration'
                    }
                    post {
                        always {
                            sh 'docker-compose -f docker-compose.test.yml down'
                        }
                    }
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    def image = docker.build("${REGISTRY}/${DOCKER_IMAGE}:${BUILD_NUMBER}")
                    docker.withRegistry("https://${REGISTRY}", 'registry-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    switch(params.ENVIRONMENT) {
                        case 'dev':
                            sh 'kubectl apply -f k8s/dev/ --namespace=dev'
                            break
                        case 'staging':
                            sh 'kubectl apply -f k8s/staging/ --namespace=staging'
                            break
                        case 'prod':
                            input message: 'Deploy to production?', ok: 'Deploy'
                            sh 'kubectl apply -f k8s/prod/ --namespace=prod'
                            break
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Deployment successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                channel: '#alerts',
                color: 'danger',
                message: "❌ Deployment failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            )
        }
    }
}

# Secret and Variable Management
# GitHub Actions - .github/workflows/secrets.yml
- name: Access secrets
  run: |
    echo "Database URL: ${{ secrets.DATABASE_URL }}"
    echo "API Key: ${{ secrets.API_KEY }}"
  env:
    NODE_ENV: ${{ vars.ENVIRONMENT }}

# Jenkins - Credentials management
withCredentials([
    string(credentialsId: 'api-key', variable: 'API_KEY'),
    usernamePassword(credentialsId: 'db-creds', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASS')
]) {
    sh 'deploy.sh'
}
```

**Comparison:** GitHub Actions vs Jenkins - GitHub Actions is native for GitHub repos with simple YAML syntax, while Jenkins is more powerful and flexible with Groovy, better for complex pipelines and on-premise setups.

## Containers - Docker and Kubernetes
**Description:** Application containerization with Docker and orchestration with Kubernetes, including optimized Dockerfiles, Docker Compose, registries, and K8s deployments with Helm.

**Example:**
```dockerfile
# Production-optimized Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy code and build
COPY . .
RUN npm run build

# Multi-stage build - minimal final image
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Security: no root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

EXPOSE 3000
CMD ["node", "dist/server.js"]

# Docker Compose for development
version: '3.8'

services:
  app:
    build: 
      context: .
      target: development
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge

# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: registry.company.com/myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: config
          mountPath: /app/config
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: app-config
      imagePullSecrets:
      - name: registry-secret

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
# Ingress
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - myapp.company.com
    secretName: myapp-tls
  rules:
  - host: myapp.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80

# Helm Chart - values.yaml
replicaCount: 3

image:
  repository: registry.company.com/myapp
  tag: latest
  pullPolicy: Always

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  host: myapp.company.com
  tls:
    enabled: true

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80

# Useful commands
# Build and versioning
docker build -t myapp:v1.2.3 .
docker tag myapp:v1.2.3 myapp:latest
docker push registry.company.com/myapp:v1.2.3

# Kubernetes
kubectl apply -f k8s/
kubectl get pods -l app=myapp
kubectl logs -f deployment/myapp
kubectl port-forward svc/myapp-service 3000:80

# Helm
helm install myapp ./chart --namespace=production
helm upgrade myapp ./chart --set image.tag=v1.2.4
helm rollback myapp 1
```

**Comparison:** Docker vs VMs - Docker is lighter and more portable using shared kernel, while VMs completely isolate the OS. Kubernetes vs Docker Compose - K8s is for production with high availability, Compose is for local development.

## IaaS and Infrastructure as Code
**Description:** Cloud infrastructure management with Terraform, CloudFormation, and Pulumi, including AWS/GCP/Azure services, remote state, reusable modules, and IaC best practices.

**Example:**
```hcl
# Terraform - Complete AWS Infrastructure
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "apps/myapp/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Variables
variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "myapp"
}

# Locals
locals {
  common_tags = {
    Environment = var.environment
    Application = var.app_name
    ManagedBy   = "terraform"
  }
  
  instance_type = var.environment == "prod" ? "t3.medium" : "t3.small"
  min_size      = var.environment == "prod" ? 2 : 1
  max_size      = var.environment == "prod" ? 10 : 3
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# VPC and Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-${var.environment}-vpc"
  })
}

resource "aws_subnet" "public" {
  count = 2
  
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-${var.environment}-public-${count.index + 1}"
    Type = "public"
  })
}

resource "aws_subnet" "private" {
  count = 2
  
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-${var.environment}-private-${count.index + 1}"
    Type = "private"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-${var.environment}-igw"
  })
}

# Load Balancer
resource "aws_lb" "main" {
  name               = "${var.app_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id
  
  enable_deletion_protection = var.environment == "prod"
  
  tags = local.common_tags
}

# Auto Scaling Group
resource "aws_launch_template" "main" {
  name_prefix   = "${var.app_name}-${var.environment}-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = local.instance_type
  
  vpc_security_group_ids = [aws_security_group.instance.id]
  
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    app_name = var.app_name
    environment = var.environment
  }))
  
  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "${var.app_name}-${var.environment}"
    })
  }
}

resource "aws_autoscaling_group" "main" {
  name                = "${var.app_name}-${var.environment}-asg"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.main.arn]
  health_check_type   = "ELB"
  
  min_size         = local.min_size
  max_size         = local.max_size
  desired_capacity = local.min_size
  
  launch_template {
    id      = aws_launch_template.main.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "${var.app_name}-${var.environment}-asg"
    propagate_at_launch = false
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier = "${var.app_name}-${var.environment}-db"
  
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = var.environment == "prod" ? "db.t3.medium" : "db.t3.micro"
  allocated_storage   = var.environment == "prod" ? 100 : 20
  storage_encrypted   = true
  
  db_name  = "myapp"
  username = "dbuser"
  password = random_password.db_password.result
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = var.environment == "prod" ? 7 : 1
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = var.environment != "prod"
  deletion_protection = var.environment == "prod"
  
  tags = local.common_tags
}

# S3 Bucket
resource "aws_s3_bucket" "app_assets" {
  bucket = "${var.app_name}-${var.environment}-assets-${random_id.bucket_suffix.hex}"
  
  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "app_assets" {
  bucket = aws_s3_bucket.app_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFormation Stack
AWSTemplateFormatVersion: '2010-09-09'
Description: 'MyApp Infrastructure Stack'

Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]
    Default: dev
  
  InstanceType:
    Type: String
    Default: t3.small
    AllowedValues: [t3.micro, t3.small, t3.medium]

Conditions:
  IsProduction: !Equals [!Ref Environment, prod]

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub '${AWS::StackName}-vpc'

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true

# Pulumi (TypeScript)
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
const environment = config.require("environment");
const appName = config.get("appName") || "myapp";

// VPC
const vpc = new aws.ec2.Vpc(`${appName}-${environment}-vpc`, {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: `${appName}-${environment}-vpc`,
        Environment: environment,
    },
});

// Auto Scaling
const autoScalingGroup = new aws.autoscaling.Group(`${appName}-${environment}-asg`, {
    vpcZoneIdentifiers: privateSubnets.map(s => s.id),
    minSize: environment === "prod" ? 2 : 1,
    maxSize: environment === "prod" ? 10 : 3,
    desiredCapacity: environment === "prod" ? 2 : 1,
    launchTemplate: {
        id: launchTemplate.id,
        version: "$Latest",
    },
});

export const vpcId = vpc.id;
export const loadBalancerDns = loadBalancer.dnsName;
```

**Comparison:** Terraform vs CloudFormation vs Pulumi - Terraform is multi-cloud with declarative HCL, CloudFormation is AWS-specific with YAML/JSON, while Pulumi uses real programming languages for greater flexibility.

## Environments and Deployment Strategies
**Description:** Management of multiple environments (dev, staging, prod) with deployment strategies like Blue/Green, Canary releases, Feature Flags, and techniques to minimize downtime and risk.

**Example:**
```yaml
# Environment Configuration Management
# config/environments/dev.yaml
environment: development
database:
  host: dev-db.company.com
  name: myapp_dev
  pool_size: 5
redis:
  host: dev-redis.company.com
  ttl: 300
features:
  new_ui: true
  payment_v2: false
logging:
  level: debug
  output: console

# config/environments/prod.yaml  
environment: production
database:
  host: prod-db.company.com
  name: myapp_prod
  pool_size: 20
redis:
  host: prod-redis.company.com
  ttl: 3600
features:
  new_ui: false
  payment_v2: true
logging:
  level: info
  output: file
monitoring:
  enabled: true
  endpoint: https://metrics.company.com

# Feature Flags Implementation
class FeatureFlag {
  static isEnabled(flag, userId = null, environment = process.env.NODE_ENV) {
    const config = {
      development: {
        new_ui: true,
        payment_v2: true,
        experimental_feature: true
      },
      staging: {
        new_ui: true,
        payment_v2: true,
        experimental_feature: false
      },
      production: {
        new_ui: false,  // Gradual rollout
        payment_v2: true,
        experimental_feature: false
      }
    };
    
    // Percentage-based rollout for production
    if (environment === 'production' && flag === 'new_ui') {
      if (!userId) return false;
      const hash = require('crypto').createHash('md5').update(userId).digest('hex');
      const percentage = parseInt(hash.substring(0, 2), 16) % 100;
      return percentage < 10; // 10% of users
    }
    
    return config[environment]?.[flag] || false;
  }
}

// Usage in application
app.get('/dashboard', (req, res) => {
  if (FeatureFlag.isEnabled('new_ui', req.user.id)) {
    res.render('dashboard-v2');
  } else {
    res.render('dashboard-v1');
  }
});

# Blue/Green Deployment with Kubernetes
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: myapp-rollout
spec:
  replicas: 5
  strategy:
    blueGreen:
      activeService: myapp-active
      previewService: myapp-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 30
      prePromotionAnalysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: myapp-preview
      postPromotionAnalysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: myapp-active
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 3000

# Canary Deployment
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: myapp-canary
spec:
  replicas: 10
  strategy:
    canary:
      steps:
      - setWeight: 10    # 10% traffic to new version
      - pause: {duration: 2m}
      - setWeight: 20    # 20% traffic
      - pause: {duration: 5m}
      - setWeight: 50    # 50% traffic
      - pause: {duration: 10m}
      - setWeight: 100   # Full traffic
      canaryService: myapp-canary
      stableService: myapp-stable
      analysis:
        templates:
        - templateName: http-success-rate
        - templateName: error-rate
        startingStep: 2
        args:
        - name: service-name
          value: myapp-canary

# Environment Promotion Pipeline
# GitHub Actions
name: Environment Promotion
on:
  push:
    branches: [main]

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development
    steps:
      - name: Deploy to Dev
        run: |
          helm upgrade myapp ./chart \
            --namespace=dev \
            --values=values-dev.yaml \
            --set image.tag=${{ github.sha }}

  integration-tests:
    needs: deploy-dev
    runs-on: ubuntu-latest
    steps:
      - name: Run Integration Tests
        run: |
          npm run test:integration
        env:
          BASE_URL: https://dev.myapp.com

  deploy-staging:
    needs: integration-tests
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to Staging
        run: |
          helm upgrade myapp ./chart \
            --namespace=staging \
            --values=values-staging.yaml \
            --set image.tag=${{ github.sha }}

  performance-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - name: Run Performance Tests
        run: |
          k6 run performance-tests.js
        env:
          BASE_URL: https://staging.myapp.com

  deploy-prod:
    needs: performance-tests
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production (Canary)
        run: |
          kubectl argo rollouts set image myapp-canary \
            myapp=${{ env.IMAGE_TAG }}
          
          # Monitor canary deployment
          kubectl argo rollouts promote myapp-canary
          kubectl argo rollouts get rollout myapp-canary --watch

# Database Migration Strategy
# migrations/migrate.js
const environments = {
  dev: {
    auto: true,    // Auto-apply migrations
    backup: false
  },
  staging: {
    auto: true,
    backup: true   // Backup before migrations
  },
  prod: {
    auto: false,   // Manual approval required
    backup: true,
    rollback_plan: true
  }
};

async function runMigrations(env) {
  const config = environments[env];
  
  if (config.backup) {
    await createDatabaseBackup();
  }
  
  if (config.auto) {
    await applyMigrations();
  } else {
    console.log('Manual approval required for production migrations');
    await waitForApproval();
    await applyMigrations();
  }
}

# Zero-Downtime Deployment Checklist
# 1. Health checks configured
# 2. Graceful shutdown handling  
# 3. Database migrations backward compatible
# 4. Feature flags for new features
# 5. Monitoring and alerting ready
# 6. Rollback plan prepared
# 7. Load balancer ready
# 8. No breaking API changes

# Monitoring and Alerting
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-rules
data:
  rules.yml: |
    groups:
    - name: application
      rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: DeploymentFailed
        expr: kube_deployment_status_replicas_available != kube_deployment_spec_replicas
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Deployment has unavailable replicas"
```

**Comparison:** Blue/Green vs Canary vs Rolling - Blue/Green switches all traffic instantly with fast rollback, Canary deploys gradually monitoring metrics, while Rolling updates instances progressively without downtime but without granular traffic control.

## Monitoring and Observability
**Description:** Implementation of comprehensive monitoring systems with metrics, logs, traces and alerting using Grafana, Prometheus, New Relic, DataDog, ELK Stack and APM tools for complete observability.

**Example:**
```yaml
# Prometheus Configuration
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'myapp'
    static_configs:
      - targets: ['myapp:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true

# Alert Rules
# alert_rules.yml
groups:
  - name: application_alerts
    rules:
      - alert: HighCPUUsage
        expr: cpu_usage_percent > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80% for more than 5 minutes"

      - alert: HighMemoryUsage
        expr: memory_usage_percent > 85
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage detected"

      - alert: ApplicationDown
        expr: up{job="myapp"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Application is down"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"

# Grafana Dashboard as Code
# dashboard.json
{
  "dashboard": {
    "id": null,
    "title": "Application Monitoring",
    "tags": ["application", "monitoring"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{handler}}"
          }
        ],
        "yAxes": [
          {
            "label": "Requests/sec"
          }
        ]
      },
      {
        "id": 2,
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          },
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "50th percentile"
          }
        ]
      },
      {
        "id": 3,
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m]) * 100"
          }
        ],
        "thresholds": "1,5",
        "colorBackground": true
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "10s"
  }
}

# Complete Docker Compose Stack
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager:/etc/alertmanager
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    networks:
      - monitoring

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - logging

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - logging

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    container_name: logstash
    ports:
      - "5000:5000"
      - "9600:9600"
    volumes:
      - ./logstash/config:/usr/share/logstash/config
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch
    networks:
      - logging

volumes:
  prometheus_data:
  grafana_data:
  elasticsearch_data:

networks:
  monitoring:
    driver: bridge
  logging:
    driver: bridge

# Application Metrics Implementation (Node.js)
const express = require('express');
const client = require('prom-client');
const app = express();

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'myapp'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register]
});

// Middleware to collect metrics
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .inc();
    
    httpRequestDuration
      .labels(req.method, req.route?.path || req.url)
      .observe(duration);
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

# Kubernetes Monitoring Setup
apiVersion: v1
kind: ServiceMonitor
metadata:
  name: myapp-monitor
  labels:
    app: myapp
spec:
  selector:
    matchLabels:
      app: myapp
  endpoints:
  - port: web
    interval: 30s
    path: /metrics

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
data:
  kubernetes-overview.json: |
    {
      "dashboard": {
        "title": "Kubernetes Overview",
        "panels": [
          {
            "title": "Pod CPU Usage",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(container_cpu_usage_seconds_total[5m]) * 100"
              }
            ]
          }
        ]
      }
    }

# Alertmanager Configuration
# alertmanager.yml
global:
  smtp_smarthost: 'mail.company.com:587'
  smtp_from: 'alerts@company.com'
  smtp_auth_username: 'alerts@company.com'
  smtp_auth_password: 'password'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
  routes:
  - match:
      severity: critical
    receiver: 'critical-alerts'
  - match:
      severity: warning
    receiver: 'warning-alerts'

receivers:
- name: 'web.hook'
  webhook_configs:
  - url: 'http://127.0.0.1:5001/'

- name: 'critical-alerts'
  email_configs:
  - to: 'oncall@company.com'
    subject: 'CRITICAL: {{ .GroupLabels.alertname }}'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      {{ end }}
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
    channel: '#alerts'
    title: 'CRITICAL Alert'
    text: '{{ .CommonAnnotations.summary }}'

- name: 'warning-alerts'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
    channel: '#monitoring'
    title: 'Warning Alert'
    text: '{{ .CommonAnnotations.summary }}'

# New Relic Configuration
# newrelic.js (Node.js)
exports.config = {
  app_name: ['MyApp Production'],
  license_key: 'YOUR_LICENSE_KEY',
  logging: {
    level: 'info'
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization'
    ]
  }
};

// Custom New Relic metrics
const newrelic = require('newrelic');

// Custom metric
newrelic.recordMetric('Custom/UserRegistrations', 1);

// Custom event
newrelic.recordCustomEvent('UserAction', {
  userId: 12345,
  action: 'purchase',
  amount: 99.99
});

# Logstash Pipeline
# logstash/pipeline/logstash.conf
input {
  beats {
    port => 5044
  }
  
  tcp {
    port => 5000
    codec => json_lines
  }
  
  http {
    port => 8080
  }
}

filter {
  if [fields][log_type] == "application" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    if [level] == "ERROR" {
      mutate {
        add_tag => [ "error" ]
      }
    }
  }
  
  # Parse JSON logs
  if [message] =~ /^\{.*\}$/ {
    json {
      source => "message"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
  
  # Send critical errors to Slack
  if "error" in [tags] and [level] == "ERROR" {
    http {
      url => "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
      http_method => "post"
      format => "json"
      mapping => {
        "text" => "Error in application: %{message}"
        "channel" => "#alerts"
      }
    }
  }
}

# Application Logging Best Practices
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'myapp',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: 'http://elasticsearch:9200' },
      index: 'app-logs'
    })
  ]
});

// Structured logging
logger.info('User action', {
  userId: 12345,
  action: 'login',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
});

# Performance Monitoring Queries
# Useful Grafana queries

# Request rate
rate(http_requests_total[5m])

# Error rate percentage
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) * 100

# Response time percentiles
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# CPU usage
rate(container_cpu_usage_seconds_total[5m]) * 100

# Memory usage
container_memory_usage_bytes / container_spec_memory_limit_bytes * 100

# Disk usage
(node_filesystem_size_bytes - node_filesystem_free_bytes) / node_filesystem_size_bytes * 100
```

**Comparison:** Prometheus vs New Relic vs DataDog - Prometheus is open-source with pull-based metrics, New Relic/DataDog are SaaS with complete APM and easier setup, while ELK Stack is ideal for centralized logs and text analysis.

## DevOps Tools and Automation
**Description:** Essential tool suite for DevOps automation including Ansible, Vault, Consul, service discovery, configuration management and infrastructure orchestration.

**Example:**
```yaml
# Complete Ansible Playbook
# site.yml
---
- name: Deploy Application Infrastructure
  hosts: all
  become: yes
  vars:
    app_name: myapp
    app_version: "{{ ansible_date_time.epoch }}"
    
  roles:
    - common
    - docker
    - monitoring
    - application

# roles/common/tasks/main.yml
---
- name: Update system packages
  apt:
    update_cache: yes
    upgrade: dist

- name: Install required packages
  apt:
    name:
      - curl
      - wget
      - git
      - htop
      - vim
      - unzip
    state: present

- name: Create application user
  user:
    name: "{{ app_name }}"
    system: yes
    shell: /bin/bash
    home: "/opt/{{ app_name }}"

- name: Setup firewall
  ufw:
    rule: allow
    port: "{{ item }}"
  loop:
    - "22"      # SSH
    - "80"      # HTTP
    - "443"     # HTTPS
    - "3000"    # Application

# roles/docker/tasks/main.yml
---
- name: Install Docker
  apt:
    name: docker.io
    state: present

- name: Start Docker service
  systemd:
    name: docker
    state: started
    enabled: yes

- name: Add user to docker group
  user:
    name: "{{ app_name }}"
    groups: docker
    append: yes

- name: Install Docker Compose
  get_url:
    url: "https://github.com/docker/compose/releases/latest/download/docker-compose-Linux-x86_64"
    dest: /usr/local/bin/docker-compose
    mode: '0755'

# roles/application/tasks/main.yml
---
- name: Create application directory
  file:
    path: "/opt/{{ app_name }}"
    state: directory
    owner: "{{ app_name }}"
    group: "{{ app_name }}"

- name: Copy docker-compose file
  template:
    src: docker-compose.yml.j2
    dest: "/opt/{{ app_name }}/docker-compose.yml"
    owner: "{{ app_name }}"
    group: "{{ app_name }}"
  notify: restart application

- name: Copy environment file
  template:
    src: .env.j2
    dest: "/opt/{{ app_name }}/.env"
    owner: "{{ app_name }}"
    group: "{{ app_name }}"
    mode: '0600'

- name: Start application
  docker_compose:
    project_src: "/opt/{{ app_name }}"
    state: present
  become_user: "{{ app_name }}"

# HashiCorp Vault Configuration
# vault.hcl
storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address = "0.0.0.0:8200"
  tls_disable = 1
}

ui = true
disable_mlock = true

# Vault policies
# policies/app-policy.hcl
path "secret/data/myapp/*" {
  capabilities = ["read", "list"]
}

path "secret/metadata/myapp/*" {
  capabilities = ["read", "list"]
}

path "database/creds/myapp-role" {
  capabilities = ["read"]
}

# Vault secrets engine setup
vault auth enable userpass
vault policy write app-policy policies/app-policy.hcl
vault write auth/userpass/users/myapp password=secure123 policies=app-policy

# Store secrets
vault kv put secret/myapp/database \
  host=db.company.com \
  username=myapp_user \
  password=supersecure123

vault kv put secret/myapp/api \
  key=abc123def456 \
  url=https://api.company.com

# Application integration with Vault (Node.js)
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: 'http://vault:8200',
  token: process.env.VAULT_TOKEN
});

async function getSecrets() {
  try {
    const result = await vault.read('secret/data/myapp/database');
    return result.data.data;
  } catch (error) {
    console.error('Error fetching secrets:', error);
    throw error;
  }
}

// Use secrets in application
getSecrets().then(secrets => {
  const dbConfig = {
    host: secrets.host,
    user: secrets.username,
    password: secrets.password
  };
  
  // Initialize database connection
  connectToDatabase(dbConfig);
});

# Consul Configuration
# consul.json
{
  "datacenter": "dc1",
  "data_dir": "/consul/data",
  "log_level": "INFO",
  "server": true,
  "bootstrap_expect": 3,
  "bind_addr": "{{ GetInterfaceIP \"eth0\" }}",
  "client_addr": "0.0.0.0",
  "retry_join": ["consul-1", "consul-2", "consul-3"],
  "ui": true,
  "connect": {
    "enabled": true
  },
  "ports": {
    "grpc": 8502
  }
}

# Service registration
{
  "service": {
    "name": "myapp",
    "tags": ["api", "v1"],
    "port": 3000,
    "check": {
      "http": "http://localhost:3000/health",
      "interval": "10s",
      "timeout": "5s"
    }
  }
}

# Service discovery in application (Node.js)
const consul = require('consul')({
  host: 'consul',
  port: 8500
});

async function discoverService(serviceName) {
  try {
    const services = await consul.health.service({
      service: serviceName,
      passing: true
    });
    
    return services.map(service => ({
      host: service.Service.Address,
      port: service.Service.Port
    }));
  } catch (error) {
    console.error('Service discovery error:', error);
    throw error;
  }
}

// Use service discovery
discoverService('database').then(instances => {
  const dbInstance = instances[Math.floor(Math.random() * instances.length)];
  connectToDatabase(`${dbInstance.host}:${dbInstance.port}`);
});

# Terraform with Consul backend
terraform {
  backend "consul" {
    address = "consul.company.com:8500"
    scheme  = "https"
    path    = "terraform/myapp"
  }
}

# Configuration Management with Consul KV
consul kv put config/myapp/database/host "db.company.com"
consul kv put config/myapp/database/port "5432"
consul kv put config/myapp/api/timeout "30s"
consul kv put config/myapp/cache/ttl "3600"

# Watch for configuration changes
const watcher = consul.watch({
  method: consul.kv.get,
  key: 'config/myapp'
});

watcher.on('change', (data, res) => {
  console.log('Configuration changed:', data);
  // Reload application configuration
  reloadConfig(data);
});

# Docker Swarm Configuration
version: '3.8'

services:
  app:
    image: myapp:latest
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        max_attempts: 3
      placement:
        constraints:
          - node.role == worker
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    ports:
      - "3000:3000"
    networks:
      - app-network
    secrets:
      - db_password
      - api_key
    configs:
      - source: app_config
        target: /app/config.json

  reverse-proxy:
    image: traefik:latest
    command:
      - --api.insecure=true
      - --providers.docker.swarmMode=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
    ports:
      - "80:80"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    deploy:
      placement:
        constraints:
          - node.role == manager

networks:
  app-network:
    driver: overlay
    encrypted: true

secrets:
  db_password:
    external: true
  api_key:
    external: true

configs:
  app_config:
    external: true

# GitOps with ArgoCD
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myapp
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/company/myapp-k8s
    targetRevision: HEAD
    path: manifests
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - Validate=false
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true

# Backup and Disaster Recovery
# backup.yml (Ansible)
---
- name: Backup databases and configs
  hosts: database
  tasks:
    - name: Create backup directory
      file:
        path: "/backup/{{ ansible_date_time.date }}"
        state: directory

    - name: Backup PostgreSQL
      postgresql_db:
        name: "{{ item }}"
        state: dump
        target: "/backup/{{ ansible_date_time.date }}/{{ item }}.sql"
      loop:
        - myapp_prod
        - myapp_staging

    - name: Backup to S3
      aws_s3:
        bucket: company-backups
        object: "database/{{ ansible_date_time.date }}/{{ item }}"
        src: "/backup/{{ ansible_date_time.date }}/{{ item }}.sql"
        mode: put
      loop:
        - myapp_prod.sql
        - myapp_staging.sql

# Chaos Engineering with Chaos Monkey
# chaos-monkey.yml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: chaos-monkey
spec:
  schedule: "0 */6 * * *"  # Every 6 hours
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: chaos-monkey
            image: quay.io/linki/chaoskube:v0.21.0
            args:
            - --interval=10m
            - --dry-run=false
            - --metrics-addr=0.0.0.0:8080
            - --log-level=info
            - --annotation-selector=chaos.alpha.kubernetes.io/enabled=true
          restartPolicy: OnFailure
```

**Comparison:** Ansible vs Terraform vs Pulumi - Ansible is imperative for configuration and orchestration, Terraform is declarative for infrastructure, Pulumi combines infrastructure with programmatic code. Vault vs Consul - Vault focuses on secrets management, Consul on service discovery and distributed configuration.
