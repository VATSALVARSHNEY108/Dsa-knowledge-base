# GCP Cheatsheet

Quick reference for Google Cloud Platform services, projects, and architecture.

## Core Concepts

- **Project** — Top-level container holding all GCP resources.
- **Organization** — Root hierarchy node over all projects + folders.
- **Folders** — Group projects under teams/environments.
- **Regions / Zones** — `us-central1`, `asia-south1-c`; zones within regions.
- **IAM** — Roles grant permissions via policies (who + role on what).
- **Billing** — Every project attaches to a billing account.

> Start in a sandbox project — costs scale with your usage.

## Core Service Table

| Category | Service | Purpose |
|----------|---------|---------|
| Compute | Compute Engine | Virtual machines (IaaS) |
| Compute | Google Kubernetes Engine (GKE) | Managed Kubernetes |
| Compute | Cloud Functions | Serverless (FaaS) |
| Compute | Cloud Run | Containers without k8s |
| Storage | Cloud Storage | Object storage (buckets) |
| Storage | Persistent Disk | VM block storage |
| Databases | Cloud SQL | Managed MySQL/PostgreSQL |
| Databases | Cloud Spanner | Global scale relational |
| Databases | Bigtable | High-throughput NoSQL |
| Networking | VPC | Virtual private network |
| Networking | Cloud Load Balancing | Distribute traffic |
| Data / AI | BigQuery | Serverless data warehouse |
| Data / AI | Dataflow | Stream/batch pipelines |
| AI | Vertex AI | Unified ML platform |
| Serverless | App Engine | PaaS, auto-scale apps |

## Compute Engine (IaaS)

- **Machine types** — predefined (n2, e2, c2) or custom (vCPU + RAM).
- **Images** — public, custom, or marketplace OS images.
- **Startup scripts** — run on first boot (automation).
- **Persistent disks** — regional or zonal; resizable, snapshots.
- **Preemptible / Spot VMs** — cheap but can be terminated anytime.

```text
# gcloud quick commands
gcloud compute instances create my-vm \
  --zone us-central1-a --machine-type e2-micro \
  --image-family ubuntu-2204-lts --image-project ubuntu-os-cloud

gcloud compute ssh my-vm --zone us-central1-a
gcloud compute instances delete my-vm --zone us-central1-a -q
```

## Google Kubernetes Engine (GKE)

- **Cluster** = control plane + node pools.
- **Autopilot vs Standard** — Autopilot manages nodes for you.
- **Node pools** — group of VMs of same machine type.
- **Workloads** — Deployments, Services, ConfigMaps, etc.

```bash
gcloud container clusters create my-cluster --num-nodes 3
gcloud container clusters get-credentials my-cluster
kubectl get nodes
kubectl apply -f deployment.yaml
```

## Cloud Storage (GCS)

- **Buckets** are globally named, regionally stored.
- **Storage classes** trade cost vs access frequency:
  Standard, Nearline, Coldline, Archive.
- **Versioning & lifecycle policies** automate retention/cost.

```text
gsutil mb gs://my-bucket            # create bucket
gsutil cp file.txt gs://my-bucket   # upload
gsutil ls gs://my-bucket            # list
gsutil rm gs://my-bucket/file.txt   # delete
```

## Cloud Functions / Cloud Run (Serverless)

```python
# Cloud Function (Python)
def hello_world(request):
    name = request.args.get("name", "World")
    return f"Hello {name}!"
```

- Pay only for execution time.
- **Cloud Run** scales to zero — great cost saver.

## BigQuery

```sql
-- Serverless SQL warehouse, no cluster to manage
SELECT country, COUNT(*) AS users
FROM `bigquery-public-data.samples.gsod`
WHERE station_number = 1
GROUP BY country
ORDER BY users DESC
LIMIT 10;
```

- Separate **storage** (cheap) from **compute** (query slots).
- O(1) Spanish-friendly pricing; `--location` for region.

## IAM Roles Table

| Role Type | Example | Scope |
|-----------|---------|-------|
| Predefined | `roles/storage.objectViewer` | Read objects |
| Predefined | `roles/compute.admin` | Full compute access |
| Basic | Owner / Editor / Viewer | Broad legacy roles |
| Custom | Your own role | Tailored permissions |

> Principle of least privilege: assign the smallest role needed.

## Networking Essentials

- **VPC** — isolated virtual network with subnets.
- **Firewall rules** — allow/deny by tag/network/source IP.
- **Cloud Load Balancing** — global anycast, handles spikes.
- **Cloud DNS** — managed DNS service.

## Security Best Practices

1. Everyone on IAM, never shared service accounts.
2. Enable **Organization Policies** for guardrails.
3. Audit logs (Cloud Audit Logs) enabled.
4. Encrypt data at rest (default KMS / CMEK).
5. Budget alerts at ~80% spend.

## Real-World Application Examples

- **Data warehouses** — BigQuery replaces on-prem analytics.
- **Event-driven apps** — Cloud Functions on pub/sub events.
- **Container platforms** — GKE for microservices at scale.
- **Global CDN/edge** — Cloud CDN + load balancers for low-latency.

## Common Pitfalls

1. **Ops left running** — idle VMs/GKE cost money. Shut down.
2. **Deleting the wrong project** — `--quiet` mistakes.
3. **Zone/region mismatch** — disks can't attach across zones.
4. **Over-permissioned IAM** — security risk.
5. **No budget alerts** — surprise invoice.

## Quick Command Reference

```bash
gcloud config set project my-project   # default project
gcloud compute instances list          # list VMs
gcloud services list                   # enabled APIs
gcloud billing projects link BILL_ID --billing-account=XXX
gcloud projects list                   # all projects
```

## Interview / Exam Tips

- Know the **4 categories**: Compute, Storage, Big Data/AI, Networking.
- Be able to explain **3 free tier** services (Functions,
  Cloud Run, Storage).
- Understand **BigQuery vs Cloud SQL** distinction (warehouse vs OLTP).
- Mention **Org → Folder → Project** hierarchy in design answers.

> GCP strengths: BigQuery, GKE, data + ML, and per-second billing.