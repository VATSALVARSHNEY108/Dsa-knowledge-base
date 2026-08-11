---
layout: default
title: Azure Cheatsheet
parent: Azure
nav_order: 2
---

# Azure Cheat Sheet

Quick reference for core Azure services, resource groups, identity,
pricing, and common patterns.

## Core Concepts

- **Subscription**: A billing container; you can have many per organization.
- **Resource Group (RG)**: A logical container that holds related Azure
  resources. Every resource belongs to exactly one RG.
- **Region**: Azure data center location (e.g., `eastus`, `westeurope`).
- **Availability Set**: Logical grouping with fault/update domains for VMs.
- **Availability Zone**: Physically separate data centers inside a region.
- **Management groups**: Organize subscriptions for policies/RBAC at scale.
- **Azure Resource Manager (ARM)**: The deployment and management layer for
  all Azure services.

> Name resources with a standard tag set so cost and ownership reporting
> works from day one.

## Compute

| Service | Type | Best For |
|---------|------|----------|
| Virtual Machines | IaaS VMs | Full control, legacy apps, steady load |
| VM Scale Sets | Autoscaling VMs | Bursty, elastic VM fleets |
| App Service | PaaS web apps | Host web apps/APIs without infra |
| Functions | Serverless FaaS | Event-driven, scale-to-zero logic |
| Container Instances | Serverless containers | Quick containers on demand |
| AKS | Managed Kubernetes | Containerized microservices |
| Container Apps | Serverless containers | K8s-style apps, KEDA, Dapr |
| Batch | Managed batch | Parallel, queue-based compute jobs |

## Storage

| Service | Type | Best For |
|---------|------|----------|
| Blob Storage | Object storage | Files, images, backups, static sites |
| Azure Files | SMB/NFS file shares | Shared Windows/Linux file storage |
| Managed Disks | VM block storage | Persistent VM disks (SSD/HDD tiers) |
| Data Lake Storage | Huge-scale storage | Big data analytics workloads |
| Queue Storage | Message queue | Simple decoupling between components |
| Backup / Site Recovery | DR and backup | RPO/RTO compliance |

- **Blob access tiers**: Hot, Cool, Cold, Archive; choose by access frequency.
- **Redundancy**: LRS (local), ZRS (zone), GRS (geo), RA-GRS (read access).
- **Storage accounts**: Contain blobs, files, queues, and tables.

## Databases

| Service | Type | Best For |
|---------|------|----------|
| Azure SQL Database | Managed relational | SQL Server workloads, PaaS |
| SQL Managed Instance | Managed SQL | Lift-and-shift SQL Server |
| MySQL / PostgreSQL | Managed OSS | MySQL/Postgres apps |
| Cosmos DB | Multi-model NoSQL | Globally distributed, multi-region |
| Azure Cache for Redis | In-memory cache | Session, caching, pub/sub |
| Table Storage | Key-value NoSQL | Simple, cheap structured data |

> Cosmos DB offers 5 consistency models and turnkey global distribution —
> the go-to for multi-region, low-latency apps.

## Networking

- **Virtual Network (VNet)**: Private network with subnets.
- **Network Security Group (NSG)**: Firewall rules for inbound/outbound.
- **Azure Load Balancer**: Layer-4 traffic distribution inside a region.
- **Application Gateway**: Layer-7 routing, SSL offload, WAF.
- **Azure DNS**: DNS hosting and resolution.
- **Azure Front Door**: Global HTTP load balancer + CDN + WAF.

## Identity and Access (Entra ID / Azure AD)

| Concept | Purpose |
|---------|---------|
| Entra ID (AAD) | Identity provider for org users |
| Managed identities | App identity without storing secrets |
| RBAC roles | Owner, Contributor, Reader + custom |
| Service principals | App identity for automation |
| Conditional Access | Policy-based access control |

```bash
# az cli quick reference
az login                                  # Sign in
az account set --subscription "My Sub"    # Choose subscription
az group create -n rg-demo -l eastus     # Create resource group
az vm create -n myvm -g rg-demo --image UbuntuLTS
az vm list --output table                 # List VMs
az group delete -n rg-demo --yes          # Delete RG and resources
```

## Serverless Example (Azure Functions)

```python
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    name = req.params.get("name", "World")
    return func.HttpResponse(f"Hello {name}!")
```

- Trigger types: HTTP, Timer, Blob, Queue, Event Grid, Cosmos DB.
- Pay-per-execution (consumption plan) or always-on (premium).

## ARM / Bicep Basics

```bicep
// Deploy a storage account with Bicep
param storageName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageName
  location: resourceGroup().location
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
}
```

- **Bicep** is the recommended, readable alternative to JSON ARM templates.
- **Terraform** also works with Azure via the AzureRM provider.

## Monitoring

- **Azure Monitor**: Central metrics, logs, alerts.
- **Application Insights**: APM for apps (traces, exceptions, performance).
- **Log Analytics**: Query logs with KQL (Kusto Query Language).
- **Azure DevOps**: CI/CD, boards, repos, artifacts.

## Pricing & Budgeting

- **Pay-as-you-go** — per-second/per-hour usage billing.
- **Reservations** — 1-3 year commitment for up to ~70% savings.
- **Free tier** — many services include monthly free quotas.
- **Cost Management + Billing** — budgets + alerts on spend.

> Put budget alerts at ~80% and ~100% to avoid surprise invoices.

## Real-World Application Examples

- **E-commerce**: App Service + Azure SQL + Redis cache + Front Door.
- **Microservices**: AKS + Container Apps + Service Bus + Cosmos DB.
- **Data analytics**: Data Lake + Data Factory + Synapse + Power BI.
- **Serverless APIs**: Functions + Cosmos DB + Event Grid + API Management.

## Common Pitfalls

1. **Cross-region VNet peering** is not transitive — plan connectivity.
2. **Cost surprises** — idle VMs and underutilized load balancers bill you.
3. **Wrong redundancy** — LRS survives only within a single data center.
4. **Security group misconfig** — default-deny, open only what's needed.
5. **Single region** for critical apps — use availability zones/regions.

## Interview / Exam Tips

- Know the difference between **App Service vs Functions vs AKS**.
- Explain **resource group** structure and inheritance for costs.
- Compare **Azure SQL vs Cosmos DB** (relational vs NoSQL).
- Describe **managed identity vs service principal** for auth.
- Mention **RBAC** and **least privilege** in any security answer.

> Azure strength: deep enterprise/Windows integration, Entra ID,
> and a huge service catalog under one billing model.