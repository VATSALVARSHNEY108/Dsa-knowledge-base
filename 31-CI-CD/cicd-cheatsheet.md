# CI/CD Cheatsheet

Quick reference for Continuous Integration and Continuous Delivery/Deployment.

## Core Concepts

- **CI (Continuous Integration)** — Every push triggers automated
  build + tests. Catch errors early, keep trunk green.
- **CD (Continuous Delivery)** — Code is always in a deployable state;
  releasing is a push-button decision.
- **CD (Continuous Deployment)** — Every passing pipeline deploys to
  production automatically.

> CI answers: "does this change still build and pass tests?"
> CD answers: "can we put it in production safely?"

## Main Pipeline Stages

```
Commit → Build → Unit Tests → Static Analysis →
Integration Tests → Package → Security Scan →
Deploy to Staging → Smoke/E2E Tests → Deploy Prod → Monitor
```

## Tooling Comparison

| Tool | Language/Scope | Key Strength |
|------|----------------|--------------|
| Jenkins | Java, any | Most flexible, plugin ecosystem |
| GitHub Actions | YAML, GitHub | Native to repos, easy setup |
| GitLab CI | YAML, GitLab | Integrated DevOps platform |
| CircleCI | YAML, cloud | Fast parallel builds |
| Azure Pipelines | YAML, Azure | Cloud-scale, multi-platform |
| Travis CI | YAML | Simple cloud CI (legacy) |
| Buildkite | Agents | Hybrid self-hosted clouds |

> Choose GitHub Actions for a GitHub repo: minimal setup, great
> caching, marketplace actions.

## Why CI/CD Matters

- **Early bug detection** — find problems on push, not at release.
- **Shorter feedback loops** — developers know within minutes.
- **Consistent builds** — reproducible, no "works on my machine".
- **Automated rollbacks** — revert bad changes fast.
- **Faster releases** — deploy daily instead of monthly.

## GitHub Actions Workflow

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
```

> Cache dependencies to speed up reruns:
> `actions/cache` or language-specific setup actions.

## GitLab CI / CD Example

```yaml
stages:
  - build
  - test
  - deploy

build_app:
  stage: build
  script:
    - docker build -t myapp .
  only:
    - main

test_app:
  stage: test
  script: pytest

deploy_prod:
  stage: deploy
  script: helm upgrade --install myapp ./chart
  only:
    - main
```

## Deployment Strategies

| Strategy | Process | Downtime | Risk |
|----------|---------|----------|------|
| Recreate | Stop old, start new | Yes | High |
| Rolling | Replace one by one | Low | Medium |
| Blue-green | Two envs, switch traffic | None | Low |
| Canary | Small %, then grow | None | Very low |

> Blue-green + canary are the go-to for zero-downtime deploys.

## CI/CD Best Practices

1. **Pipeline on every PR** — gate merges on green builds.
2. **Fast feedback** — keep the CI loop under ~10-15 min.
3. **Split stages** — unit/integration; run cheap ones first.
4. **Deterministic builds** — lock dependencies (lockfile).
5. **Secret-free runs** — use secrets, never hardcode keys.
6. **Artifact reuse** — build once, promote the artifact.
7. **Failure notifications** — Slack/email on red pipelines.
8. **Cleanup** — delete old artifacts, prune runners.

## Common Pitfalls

1. **Flaky tests** — re-run instability destroys pipeline trust.
2. **Monolithic pipeline** — slow, hard to debug. Split jobs.
3. **Secrets leaking** — pipelines logs are public channels.
4. **No caches** — every build re-downloads everything (slow).
5. **Disabled failing tests** — red to green the honest way.
6. **Deploying only from one machine** — vet the actual artifact.

## CD Examples (Everyday Real-World)

- **Web apps** — auto-deploy `main` to staging after every merge.
- **Libraries/frontends** — publish npm/registry on tag.
- **Mobile** — build + sign + upload via CI, release gate.
- **Infra** — pipeline runs `terraform plan → apply`.

## Interview / Exam Tips

- Clearly distinguish **CI vs CD** and **Delivery vs Deployment**.
- Explain a **blue-green** and a **canary** in one sentence each.
- Know why **caching** and **fast feedback** matter in practice.
- Mention **rollback** as a first-class design requirement.
- Give a concrete example pipeline end-to-end (from a tool you know).

> A good pipeline is boring: it runs, passes, deploys, and
> when it fails, the problem is right there in the logs.