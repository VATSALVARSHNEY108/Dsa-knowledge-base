# Cloud Computing Cheat Sheet

Quick reference for cloud computing fundamentals: service models, deployment
models, key concepts, and provider comparisons.

## Core Concepts

- **Cloud computing**: On-demand delivery of compute, storage, and network
  resources over the internet on a pay-as-you-go basis.
- **On-demand self-service**: Provision resources without human interaction
  with the provider.
- **Broad network access**: Services available over standard network
  connections from any device.
- **Resource pooling**: Compute resources are pooled and shared across
  customers (multi-tenancy).
- **Rapid elasticity**: Scale resources up or down quickly, often
  automatically, based on demand.
- **Measured service**: Usage is metered and billed granularly; you pay for
  what you use.
- **OPEX vs CAPEX**: Cloud converts capital expenditure (buying hardware) into
  operating expenditure (monthly bills).

## Regions and Availability

- **Region**: A geographic area with one or more data centers. Example:
  `us-east-1` (AWS), `eastus` (Azure), `us-central1` (GCP).
- **Availability Zone (AZ)**: One or more isolated data centers inside a
  region. Zones are connected by low-latency links.
- **Fault domain**: A physical grouping of hardware that shares a power source
  and network switch.
- **Update domain**: Hardware grouped so maintenance is rolled out in sequence.
- **Edge location**: A smaller point-of-presence that caches content closer to
  users (used by CDNs).

> Always deploy critical workloads across at least two availability zones to
> survive a single data center failure.

## Service Models

| Model | What You Manage | What Provider Manages | Example |
|-------|-----------------|----------------------|---------|
| On-Premises | Everything | Nothing | Your own data center |
| IaaS | App, data, runtime, OS | Virtualization, servers, storage, network | EC2, Azure VM, GCE |
| PaaS | App and data only | Everything below the runtime | App Engine, Elastic Beanstalk |
| SaaS | Nothing (data only) | Everything | Gmail, Salesforce, Dropbox |
| FaaS | Function code only | Everything + runtime scaling | Lambda, Cloud Functions |
| Container | App + dependencies | Host OS, infra | ECS, AKS, GKE |

- **IaaS** (Infrastructure as a Service): Raw VMs, virtual networks, storage.
  Highest control, most admin work.
- **PaaS** (Platform as a Service): Managed runtime + middleware. You just
  deploy your code.
- **SaaS** (Software as a Service): Fully managed application. You only use it.
- **FaaS** (Function as a Service): Serverless functions; scale to zero and
  pay per invocation.

## Deployment Models

| Model | Location | Multi-Tenant | Use When |
|-------|----------|--------------|----------|
| Public Cloud | Provider's data centers | Yes | Most workloads, no special compliance |
| Private Cloud | Single org's own infra | No | Strict compliance, sensitive data |
| Hybrid Cloud | Mix of public + private | Partial | Keep on-prem data, burst to cloud |
| Multi-Cloud | Multiple providers | N/A | Avoid vendor lock-in, best-of-breed |
| Community Cloud | Shared by several orgs | Yes | Organizations with common goals |

## Scaling and Delivery Characteristics

- **Vertical scaling (scale up)**: Add more CPU/RAM to an existing VM. Simple,
  but has a hard upper limit.
- **Horizontal scaling (scale out)**: Add more VM instances (or containers).
  Preferred for elastic, resilient workloads.
- **Elasticity**: Ability to dynamically match resource supply to demand.
- **Availability**: The percentage of time a system is up and serving (e.g.,
  99.99%).
- **Durability**: Assurance that stored data will not be lost (e.g., 11 nines
  for S3).
- **Latency**: Time to serve a request; reduced by choosing regions near users.
- **Scalability vs elasticity**: Scalability is the *capacity* to grow;
  elasticity is the *automatic* growth and shrink.

## Key Networking Terms

- **VPC / VNet / VPC** (AWS / Azure / GCP): Your isolated virtual network in
  the cloud.
- **CIDR**: Notation for IP ranges, e.g., `10.0.0.0/16`.
- **Subnet**: A segment of a VPC; can be public or private.
- **Load Balancer**: Distributes traffic across backend instances.
- **CDN**: Content delivery network caching static assets at edge locations.
- **DNS**: Translates names to IP addresses.

## Provider Comparison

| Feature | AWS | Azure | GCP |
|---------|-----|-------|-----|
| Compute VM | EC2 | Virtual Machine | Compute Engine |
| Serverless | Lambda | Functions | Cloud Functions |
| Object storage | S3 | Blob Storage | Cloud Storage |
| Relational DB | RDS | SQL Database | Cloud SQL |
| NoSQL | DynamoDB | Cosmos DB | Firestore |
| Kubernetes | EKS | AKS | GKE |
| Container registry | ECR | ACR | Artifact Registry |
| Big data | EMR | HDInsight | Dataproc |
| Data warehouse | Redshift | Synapse | BigQuery |
| Load balancer | ALB/ELB | Azure LB | Cloud LB |
| Identity | IAM | Entra ID (Azure AD) | Cloud IAM |
| Dominant strength | Largest catalog, most mature | Deep Microsoft/AD integration | Data analytics, Kubernetes |

## Real-World Application Examples

- **Startup launching an app**: Use IaaS for a day-one VM, move to PaaS for
  faster deploys, and adopt FaaS for event-driven features.
- **E-commerce spikes**: Auto-scaling groups + load balancers absorb Black
  Friday traffic with elasticity.
- **Media streaming**: CDN edge locations cache video, lowering latency and
  origin load.
- **Healthcare compliance**: Private or hybrid cloud keeps PHI on-prem while
  analytics burst to public cloud.
- **Video transcoding**: FaaS function triggered by an upload event transcodes
  in parallel, paying only for processing time.

## Common Pitfalls

- **Vendor lock-in**: Using proprietary service APIs everywhere makes
  migration costly.
- **Ignoring cost controls**: Orphaned VMs, unused EIPs, and no budgets rack
  up bills.
- **Single-region design**: One region outage = total downtime.
- **Wrong scale strategy**: Vertical scaling hits limits and doesn't provide
  failure isolation.
- **Not hardening the network**: Public subnets with open ports expose
  resources.
- **Forgetting cloud shared responsibility**: The provider secures the cloud;
  you secure what is *in* the cloud.

## Interview Tips

- **Know the shared responsibility model**: Provider handles physical
  security; customer handles access, data, and patches.
- **Distinguish CAPEX vs OPEX and why CFOs like OPEX**.
- **Explain elasticity with an example**: web server doing a flash sale.
- **Compare IaaS/PaaS/SaaS in one sentence each**.
- **Name the three pillars of choosing a region**: latency to users, cost,
  and compliance.
- **Be ready to map a provider service to its cloud-neutral concept** (e.g.,
  "GCP Cloud Storage is object storage like S3").