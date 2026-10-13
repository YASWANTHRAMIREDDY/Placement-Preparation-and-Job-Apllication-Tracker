# AWS Production Cloud Architecture Guide

This document details how the **Placement Preparation & Job Application Tracker** is architected for production scale on Amazon Web Services (AWS).

---

## 1. Cloud Architecture Topology

```
                  Internet / DNS (Amazon Route 53)
                                  │
                                  ▼
                     AWS WAF (Web App Firewall)
                                  │
                                  ▼
                 Application Load Balancer (ALB)
                   (HTTPS :443 with ACM SSL)
                     │                      │
       Path: /api/*  │                      │ Default: /*
                     ▼                      ▼
           Target Group: Backend   Target Group: Frontend
                     │                      │
                     ▼                      ▼
            Amazon ECS Fargate     Amazon ECS Fargate /
           (FastAPI REST Service)  (Nginx Static + React)
                     │
                     ├──────────────────┬─────────────────┐
                     ▼                  ▼                 ▼
             Amazon RDS MySQL     AWS Secrets Mgr   Amazon CloudWatch
           (Multi-AZ, Encrypted)  (JWT & DB Secrets)  (Logs & Metrics)
```

---

## 2. Core AWS Components

| Service | Role | Configuration Details |
| :--- | :--- | :--- |
| **Amazon Route 53** | Domain & DNS Routing | Alias records pointing to ALB with latency-based or geolocation routing. |
| **AWS Certificate Manager (ACM)** | TLS/SSL Certificates | Auto-renewing public SSL certificate for secure HTTPS termination. |
| **Application Load Balancer (ALB)** | Layer-7 Ingress | Routes `/api/*` to the FastAPI backend and `/*` to the React/Nginx frontend. |
| **Amazon ECS (Fargate)** | Serverless Containers | Runs the Dockerized FastAPI and React apps without managing EC2 instances. |
| **Amazon RDS (MySQL 8.0)** | Managed Relational DB | Multi-AZ deployment, automated daily snapshots, encrypted with AWS KMS. |
| **AWS Secrets Manager** | Secrets Injection | Stores database credentials and JWT `SECRET_KEY` injected at container boot. |
| **Amazon CloudWatch** | Observability | Ingests container `stdout`/`stderr` logs, sets alarms on 5xx errors and CPU usage. |

---

## 3. Alternative 1: Single-Instance Deployment via AWS EC2
For academic projects, prototypes, or minimal monthly budget ($5-$15/month):
1. Provision an **AWS EC2 `t3.small`** or `t3.medium` instance running **Ubuntu 22.04 LTS**.
2. Allocate an **Elastic IP** and configure Security Groups:
   - Inbound: Port 22 (SSH - restricted to your IP), Port 80 (HTTP), Port 443 (HTTPS), Port 3000 (React), Port 8000 (FastAPI).
3. Clone the repository and execute:
   ```bash
   chmod +x deploy/deploy-ec2.sh
   ./deploy/deploy-ec2.sh
   ```

---

## 4. Alternative 2: Serverless ECS Fargate Deployment
For scalable enterprise deployments:
1. Push Docker images to **Amazon ECR (Elastic Container Registry)**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker tag placement_backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/placement-backend:latest
   docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/placement-backend:latest
   ```
2. Register the task definition from `deploy/aws-ecs-task-def.json`:
   ```bash
   aws ecs register-task-definition --cli-input-json file://deploy/aws-ecs-task-def.json
   ```
3. Create an ECS Service associated with your Application Load Balancer target group.
