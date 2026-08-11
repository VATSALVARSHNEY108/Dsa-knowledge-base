# AWS Cheat Sheet

Quick reference for core AWS services grouped by category, pricing models, the
Well-Architected Framework, and common patterns.

## Core Concepts

- **Region**: Geographic cluster of data centers (e.g., `us-east-1`).
- **Availability Zone (AZ)**: Isolated data center(s) within a region; use 2+
  for resilience.
- **Edge location**: CDN/CloudFront cache point close to users.
- **Shared responsibility**: AWS secures *of* the cloud; you secure *in* the
  cloud (data, access, patches).
- **Pay-as-you-go**: Bills based on compute hours, storage, and data egress.

## Compute

| Service | Type | Best For |
|---------|------|----------|
| EC2 | Virtual machines | Full control, steady workloads |
| Lambda | Serverless functions | Event-driven, bursty, scale-to-zero apps |
| ECS / EKS | Containers (ECS native, EKS Kubernetes) | Containerized apps |
| Fargate | Serverless containers | Containers without managing instances |
| Elastic Beanstalk | PaaS | Deploy apps quickly, fewer infra choices |
| Lightsail | Simple VPS | Small projects, predictable pricing |
| Batch | Managed batch jobs | Queue-based compute workloads |
| Auto Scaling | Scales EC2 groups | Elastic capacity based on metrics |

## Storage

| Service | Type | Best For |
|---------|------|----------|
| S3 | Object storage | Unlimited files, static assets, backups |
| S3 Glacier | Archive storage | Cold archival, cheap long-term |
| EBS | Block storage for EC2 | VM attached volumes, databases |
| EFS | Shared NFS filesystem | Shared file storage across EC2 |
| FSx | Managed file systems | Windows FS, Lustre HPC |
| Storage Gateway | Hybrid bridge | On-prem to cloud storage bridging |

- **S3 durability**: 99.999999999% (11 nines); multiple AZ replication default.
- **S3 storage classes**: Standard, IA, One Zone-IA, Glacier, Glacier Deep
  Archive — trade cost vs retrieval time.
- **EBS volume types**: gp3 general, io2 provisioned IOPS, st1 throughput.

## Databases

| Service | Type | Best For |
|---------|------|----------|
| RDS | Managed relational (Postgres, MySQL, etc.) | Standard SQL apps |
| Aurora | MySQL/Postgres-compatible engine | High performance + durability |
| DynamoDB | NoSQL, key-value | Serverless, high scale, low latency |
| ElastiCache | In-memory cache (Redis/Memcached) | Read-heavy caches, sessions, queues |
| Redshift | Data warehouse | Analytics over large datasets |
| Neptune | Graph database | Social graphs, fraud detection |
| DocumentDB | MongoDB-compatible | MongoDB workloads |
| Timestream | Time-series | IoT, telemetry data |

## Networking

| Service | Purpose |
|---------|---------|
| VPC | Isolated virtual network |
| Subnet | Network segment (public/private) |
| Internet Gateway | Inbound/outbound from the internet |
| NAT Gateway | Outbound internet from private subnets |
| Security Groups | Stateful instance-level firewall |
| NACL | Stateless subnet-level firewall |
| Route 53 | DNS + domain management |
| CloudFront | CDN cache at edge locations |
| ELB / ALB / NLB | Load balancing (app / app+gRPC / TCP) |
| Transit Gateway | Connect multiple VPCs/on-prem |
| Global Accelerator | Optimized routing for global traffic |

## Identity and Access (IAM)

- **IAM user**: Long-lived identity for a person or service.
- **IAM role**: Short-lived credentials assumed by services or users.
- **IAM policy**: JSON document granting permissions (allow/deny on resources).
- **Groups**: Bundle users to share policy attachments.
- **Least privilege**: Grant only the permissions a role needs.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::my-bucket",
        "arn:aws:s3:::my-bucket/*"
      ]
    }
  ]
}
```

- **Cognito**: Managed user sign-up/sign-in and federation.
- **KMS**: Managed encryption keys for services and your data.
- **Secrets Manager / SSM Parameter Store**: Store secrets safely.

## Application and Integration

| Service | Purpose |
|---------|---------|
| SQS | Managed message queue (decouple components) |
| SNS | Pub/sub notifications (SMS, email, HTTP, Lambda) |
| API Gateway | Create/manage REST and WebSocket APIs |
| Step Functions | Orchestrate serverless workflows |
| EventBridge | Event bus for app integration |
| AppSync | GraphQL backend service |
| SES | Email sending service |

## Developer and Ops

| Service | Purpose |
|---------|---------|
| CloudWatch | Metrics, logs, alarms, dashboards |
| CloudTrail | Audit log of API calls in the account |
| CodeCommit / CodeBuild / CodeDeploy / CodePipeline | CI/CD suite |
| ECR | Container image registry |
| Systems Manager | Patch, run commands, parameter store |
| CloudFormation | Infrastructure as Code (JSON/YAML) |
| X-Ray | Distributed tracing |
| Trusted Advisor | Cost and security recommendations |

## Pricing Models

| Model | Example | Best For |
|-------|---------|----------|
| On-Demand | EC2 per-hour | Unpredictable/uninterruptible workloads |
| Reserved | 1-3 yr EC2 contracts | Steady predictable workloads |
| Savings Plans | Commit $/hr across compute | Mixed steady workloads |
| Spot Instances | 90% off, interruptible | Batch, stateless, fault-tolerant jobs |
| Per-GB / per-request | S3, Lambda, DynamoDB | Serverless and storage |
| Free Tier | 12 months of basics | Learning and small tests |
| Consolidated Billing | One bill for accounts | Multi-account orgs |

> Spot + Reserved is the classic cost optimization: reserve steady baseline,
> use spot for the elastic burst.

## Well-Architected Pillars

| Pillar | Question It Answers | Quick Example |
|--------|---------------------|---------------|
| Operational Excellence | Run and monitor systems | Automate deployments, observe logs |
| Security | Protect data and systems | IAM least privilege, encryption |
| Reliability | Recover from failure | Multi-AZ, backups, health checks |
| Performance Efficiency | Use resources efficiently | Right-size, serverless where apt |
| Cost Optimization | Pay only for what you use | Spot, reserved, lifecycle policies |
| Sustainability | Minimize environmental impact | Right-size, delete junk resources |

## Common Patterns

- **Web app**: Route 53 -> CloudFront -> ALB -> EC2 (multi-AZ) -> RDS with a
  read replica.
- **Serverless API**: API Gateway -> Lambda -> DynamoDB, S3 for static assets.
- **Async processing**: S3 event -> SQS -> Lambda workers -> DynamoDB.
- **Data pipeline**: S3 -> Glue/EMR -> Redshift -> QuickSight.
- **Media pipeline**: Upload to S3 -> Lambda (transcode) -> CloudFront delivery.
- **3-tier**: Web (public subnets) -> App (private) -> DB (private, isolated).

## Real-World Application Examples

- **E-commerce checkout**: ALB + multi-AZ EC2 + RDS Aurora + ElastiCache for
  cart, DynamoDB for inventory counters.
- **Mobile app backend**: API Gateway + Lambda + DynamoDB; Cognito for auth.
- **Analytics platform**: Redshift warehouse fed by S3, scheduled ETL with
  Glue.
- **Global CDN**: CloudFront + S3 origin, geo-routing with Route 53.
- **IoT ingestion**: IoT Core -> Kinesis -> Lambda -> DynamoDB / Timestream.

## Common Pitfalls

- **IAM too broad**: `Action: "*"` on all resources screams for misuse.
- **Security groups misconfigured**: Public 0.0.0.0/0 on SSH/RDP.
- **No multi-AZ**: One AZ goes down, app goes down.
- **Egress costs ignored**: Data transfer *out* of AWS is not free.
- **Left running spot/large instances**: Forgot to stop; bill explodes.
- **Keys in code/source control**: Access keys committed to git.
- **Wrong S3 class**: Storing rarely-read logs in Standard.
- **No versioning/lifecycle**: S3 bucket accidentally emptied with no restore.

## Interview Tips

- **Explain the shared responsibility model** clearly.
- **Know S3 consistency model**: strong read-after-write since Dec 2020.
- **EC2 vs Lambda when?** Steady workloads -> EC2; event-driven -> Lambda.
- **SQL vs NoSQL**: RDS/Aurora for transactions; DynamoDB for scale.
- **Security groups = stateful; NACLs = stateless** — know the difference.
- **Name the 6 Well-Architected pillars and one example for each.**
- **Be ready to design a highly available 3-tier architecture.**
- **6 core services to understand**: S3, EC2, Lambda, VPC, IAM, RDS/DynamoDB.