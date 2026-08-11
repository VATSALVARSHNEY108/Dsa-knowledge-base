---
layout: default
title: Kubernetes Cheatsheet
parent: Kubernetes
nav_order: 2
---

# Kubernetes Cheat Sheet

Quick reference for architecture, kubectl, workloads, services,
configmaps/secrets, networking, and common errors.

## Core Concepts

- **Cluster**: Set of machines running containers (nodes).
- **Pod**: Smallest deployable unit; one or more containers.
- **Node**: Worker machine (VM or physical) running pods.
- **kubelet**: Agent on each node managing pods.
- **Control Plane**: The brain; runs API, scheduler, controllers.
- **etcd**: Distributed key-value store holding cluster state.

## Architecture

### Control Plane vs Nodes

| Component      | Plane     | Purpose                         |
|----------------|-----------|---------------------------------|
| API Server     | Control   | Front door; all requests       |
| etcd           | Control   | Cluster state storage          |
| Scheduler      | Control   | Places pods on nodes           |
| Controller Mgr | Control   | Runs controllers (desired state)|
| kubelet        | Node      | Manages pods on the node       |
| kube-proxy     | Node      | Service networking / iptables  |
| Container Runtime| Node    | Runs containers (containerd)   |

```
┌─────────────────────────────────────────────┐
│ Control Plane                               │
│  API Server <-> etcd <-> Scheduler          │
│                <- Controller Manager        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────┐  ┌──────────────────┐
│ Node 1                  │  │ Node 2           │
│ kubelet + kube-proxy    │  │ kubelet + proxy  │
│ Pod, Pod, Pod           │  │ Pod, Pod         │
└─────────────────────────┘  └──────────────────┘
```

## kubectl Commands

| Command                      | Purpose                        |
|------------------------------|--------------------------------|
| `kubectl get pods`           | List pods in namespace         |
| `kubectl get nodes`          | List cluster nodes             |
| `kubectl get all`            | List common resources          |
| `kubectl apply -f file.yaml` | Create/update from manifest    |
| `kubectl delete -f file.yaml`| Delete resources               |
| `kubectl describe pod p`     | Detailed status of a pod       |
| `kubectl logs pod`           | Container logs                 |
| `kubectl logs -f pod`        | Follow logs                    |
| `kubectl exec -it pod -- sh` | Shell inside container         |
| `kubectl port-forward pod 8080:80` | Forward local port      |
| `kubectl get events`         | Recent cluster events          |

### Quick Snippets

```bash
kubectl get pods -n kube-system
kubectl get pods -o wide
kubectl apply -f deploy.yaml
kubectl rollout status deploy/web
kubectl rollout restart deploy/web
kubectl scale deploy/web --replicas=5
kubectl delete pod web-abc123          # recreate by controller
kubectl get secret -n prod
kubectl edit deploy/web
```

> `kubectl apply` is declarative; `kubectl create/run` is imperative.

## Workloads

| Workload     | Use Case                            | Scaling           |
|--------------|-------------------------------------|-------------------|
| Deployment   | Stateless apps                      | ReplicaSet        |
| StatefulSet  | Stable identity, persistent data    | Ordered           |
| DaemonSet    | One pod per node (logging, agent)   | Node-driven       |
| Job          | Run-to-completion tasks             | Fixed count       |
| CronJob      | Scheduled jobs (backups, cleanups)  | Time-based        |

### Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:1.27
          ports:
            - containerPort: 80
```

> StatefulSets give pods stable DNS (`web-0`, `web-1`, ...) and PVCs.

## Services

| Type       | Access                       | Use Case              |
|------------|------------------------------|-----------------------|
| ClusterIP  | Internal only (default)      | In-cluster comms      |
| NodePort   | nodeIP:port                  | Simple external       |
| LoadBalancer| Cloud LB (AWS/GCP)         | Production external   |
| ExternalName| Maps to external DNS        | Legacy integrations   |

```yaml
apiVersion: v1
kind: Service
metadata:
  name: web-svc
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
```

> Service selects pods by labels; stable VIP backed by endpoints.

## ConfigMaps & Secrets

| Resource   | Purpose               | Storage        |
|------------|-----------------------|----------------|
| ConfigMap  | Non-sensitive config  | Plaintext      |
| Secret     | Sensitive data        | Base64 encoded |

```bash
kubectl create configmap app-config --from-file=app.conf
kubectl create secret generic db-pass --from-literal=PASSWORD=hunter2
kubectl get secret db-pass -o yaml
```

> Secrets are base64, not encrypted at rest by default. Use KMS +
> external secret managers (Vault, SOPS) for real security.

## Networking

- **Pod IPs**: Ephemeral; change on restart.
- **Service IP**: Stable VIP load-balancing to matching pods.
- **Ingress**: HTTP/HTTPS routing to services (nginx-ingress, Traefik).
- **NetworkPolicy**: Firewall rules between pods (e.g., Calico).

```text
Ingress -> Service -> Endpoints/Pods
```

## Config & Contexts

```bash
kubectl config view
kubectl config get-contexts
kubectl config use-context prod
kubectl config set-context myctx --namespace=prod
```

## Common Errors

| Error                            | Cause & Fix                     |
|----------------------------------|---------------------------------|
| `ImagePullBackOff`               | Bad image tag/registry auth     |
| `CrashLoopBackOff`               | Container exits; check logs     |
| `Pending` pod                    | No resources / node taint       |
| `CreateContainerConfigError`     | Missing env/secret/configmap    |
| `kubectl: connection refused`    | Wrong context / API down        |
| `ErrImagePull`                   | Registry unreachable or 401     |
| `Terminating` stuck              | Finalizer / unmounted volume    |

```bash
kubectl describe pod <pod>        # first step for any error
kubectl get events --sort-by=.lastTimestamp
```

## Real-World Applications

- Deploy microservices with rolling updates (`maxUnavailable`, `maxSurge`).
- HPA auto-scales Deployments based on CPU/memory/custom metrics.
- DaemonSet runs node exporters + log agents on every node.
- StatefulSet for databases (PostgreSQL operators, Kafka, etcd).
- GitOps: ArgoCD applies manifests from git on change.

## Common Pitfalls

- Editing live YAML instead of source-controlled manifests.
- Not setting resource requests/limits -> noisy neighbors.
- Using `latest` image tags (no reproducible versions).
- Secrets stored in plain ConfigMaps.
- Manually killing pods instead of using Deployments.

## Interview Tips

1. Explain pod vs deployment vs service clearly with an analogy.
2. Describe the control plane components and what each does.
3. Walk through how a Service selects pods via labels.
4. Know when to pick StatefulSet over Deployment.
5. Diagnose a CrashLoopBackOff from logs and describe.