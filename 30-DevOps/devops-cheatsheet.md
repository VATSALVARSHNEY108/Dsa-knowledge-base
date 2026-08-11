# DevOps Cheatsheet

Quick reference for principles, practices, tools, and CI/CD basics.

## Core Concepts

- **DevOps** — Culture + practices connecting development and
  operations; smaller, faster, safer releases.
- **Key pillars** — Automation, Measurement, Sharing, Collaboration
  (the CAMS model).
- **Goals** — Shorter lead time, fewer failures, faster recovery.
- **DORA metrics** measure your DevOps health (see below).

> DevOps is a culture, not a tool. Tools enable the culture.

## DevOps Principles (Quick)

1. **Automate everything** that can be (build, test, deploy, revert).
2. **Infrastructure as Code** — treat infra like app code.
3. **Deliver in small batches** — reduces risk per release.
4. **Fail fast, recover faster** — blameless postmortems.
5. **Monitor everything** — metrics, logs, traces.
6. **Continuous improvement** — retrospectives, feedback loops.

## The DevOps Loop

```
Plan → Code → Build → Test → Release → Deploy → Operate → Monitor → (repeat)
```

## DORA Metrics

| Metric | Meaning | Health Target |
|--------|---------|---------------|
| Deployment frequency | How often deploy | Daily / multiple daily |
| Lead time for change | Commit to production | < 1 day |
| Change failure rate | % of deploys that fail | < 15% |
| Time to restore | Recovery from incident | < 1 hour |

> Improving these four consistently → elite DevOps teams.

## Tools Ecosystem

| Category | Tools | Purpose |
|----------|-------|---------|
| Source control | Git, GitHub, GitLab | Version control, PRs |
| CI/CD | Jenkins, GitLab CI, GitHub Actions | Pipelines |
| Build tools | Maven, Gradle, npm, Docker | Compile/package |
| Containerization | Docker, Podman | Packaging apps |
| Orchestration | Kubernetes, Docker Swarm | Container scheduling |
| IaC | Terraform, Ansible, Pulumi | Provision infra |
| Configuration | Ansible, Chef, Puppet | Configure servers |
| Monitoring | Prometheus, Grafana, Datadog | Metrics & dashboards |
| Logging | ELK, Loki, Splunk | Centralized logs |
| Tracing | Jaeger, Zipkin | Distributed tracing |
| Secret management | Vault, AWS Secrets Manager | Store secrets safely |

## Common Devops Workflows

### 1. CI Pipeline (on every push)

```yaml
# GitHub Actions example
on: push
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt
      - run: pytest
```

### 2. CD — Deploy after green pipeline

```
Pipeline stages:
lint → build → unit tests → integration tests →
security scan → build image → push registry →
deploy staging → smoke tests → deploy production
```

### 3. Rollback strategy

- **Reversible deploys** (git revert + redeploy).
- **Feature flags** to disable risky paths.
- **Blue-green & canary** avoid all-at-once blast radius.

## Deployment Strategies

| Strategy | How It Works | When To Use |
|----------|--------------|-------------|
| Rolling | Replace instances gradually | Default simple apps |
| Blue-green | Two full environments, switch DNS | Zero-downtime needs |
| Canary | Small % then grow | Right-sizing at small risk |
| Recreate | Stop all, start all | Staging / acceptable downtime |
| Feature flags | Hide features behind toggles | Controlled rollouts |

## Infrastructure as Code (Terraform Example)

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = { Name = "web-server" }
}
```

- **Declarative** — you describe the end state.
- **Idempotent** — applying twice gives the same result.
- **State file** tracks what exists; don't edit by hand.

## Monitoring & Observability

- **The three pillars**: Metrics (numbers), Logs (events), Traces
  (requests across services).
- **Golden signals**: Latency, traffic, errors, saturation.
- **Alerting** — alert on symptoms (user-visible), not causes.
- **SLO / SLI / SLA** — target reliability you promise:
  SLA 99.9% ≈ 8.7h downtime allowed per year.

> 99.9% SLA ≈ ~8.7 hours/year downtime. 99.99% ≈ ~52 min/year.

## Real-World Application Examples

- **E-commerce** — deploy new pricing daily, auto-scale on Black Friday.
- **SaaS** — ship feature flags, monitor every release.
- **Startups** — small batch deploys keep iteration speed high.
- **Fintech** — rigorous pipelines, approval gates, canary rollout.

## Common Pitfalls

1. **No rollback plan** — you WILL need one.
2. **Green pipeline, red production** — staging drift; keep parity.
3. **Monitoring after the fact** — add dashboards before deploy.
4. **One big release** — split into small reversible batches.
5. **Secrets in code/repos** — use secret managers.
6. **Cowboy deploys** — every change goes through the pipeline.

## DevOps Interview / Exam Tips

- Explain **CI vs CD** clearly (integration vs deployment).
- Know **DORA metrics** by name and why they matter.
- Describe a **rollback** and a **canary** concretely.
- Explain **IaC** with Terraform and idempotency.
- Outline **monitoring vs observability** differences.
- Always tie answers to **reducing risk & lead time**.

> Toolbox grows, but the goal stays the same:
> ship quality software faster and safer.