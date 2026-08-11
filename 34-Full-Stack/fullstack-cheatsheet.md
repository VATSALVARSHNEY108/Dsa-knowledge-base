---
layout: default
title: Fullstack Cheatsheet
parent: Full Stack
nav_order: 1
---

# Full-Stack Cheat Sheet

Quick reference for architecting and shipping full-stack applications:
client-server patterns, request lifecycle, deployment,

environment variables, and checklists.

> Full-stack means owning the request from click to database and back.

## Core Concepts

### Client-Server Architecture
```
Browser (Frontend)  <--HTTP/HTTPS-->  API Server (Backend)  <-->  Database
     UI/React        JSON / REST / GraphQL  Logic/Auth         SQL/NoSQL
```
- Frontend: rendering, interaction, state, routing
- Backend: validation, business logic, auth, persistence
- Database: durable storage, transactions, indexes
- A third-party service often participates (email, payments, CDN)

### Architecture Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Monolith | One deployable app | Small teams, MVPs |
| Microservices | Many small services + APIs | Large orgs, scaling |
| Serverless | Functions on demand | Event-driven, low traffic |
| MVC | Model, View, Controller | Traditional web apps |
| MVVM | Model, View, View-Model | Frontend frameworks |
| MERN | Mongo, Express, React, Node | Full JS stack |

### MERN Stack Map
| Layer | Technology | Role |
|-------|-----------|------|
| Database | MongoDB | Documents, flexible schema |
| Backend | Express + Node | REST API, auth, validation |
| Frontend | React | UI, state, routing |
| Bridge | Axios / fetch | Client -> API calls |

### MVC Flow
```
User input -> Controller -> Model (data) -> View (render) -> User
                                    ^________________________|
Event replay loop: view updates trigger new controller actions.
```

## Request Lifecycle

### Front to Back Example
1. User clicks "Submit" in the React form
2. React validates input, disables the button, optimistic update
3. `fetch('/api/orders', { method: 'POST', body: JSON.stringify(order) })`
4. Browser sends HTTP request (headers, cookies, Authorization)
5. Load balancer / reverse proxy forwards to an app instance
6. Server parses body, validates against a schema
7. Middleware checks JWT / session, enforces rate limit
8. Controller calls the service layer (business rules)
9. Repository executes a parameterized SQL INSERT inside a transaction
10. Server returns `201` + created resource as JSON
11. Client updates state, shows success, redirects

### HTTP Request Shape
```http
POST /api/orders HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>

{ "productId": 42, "quantity": 2 }
```

### Response Shape
```json
{
  "id": "ord_123",
  "status": "created",
  "total": 199.98,
  "createdAt": "2026-08-11T12:00:00Z"
}
```

## Environment Variables

### `.env` Example
```env
PORT=3000
DATABASE_URL=postgres://user:pass@db:5432/app
JWT_SECRET=change-me-in-production
REDIS_URL=redis://cache:6379
NODE_ENV=development
```

- Store secrets in environment, never in source code
- Use `process.env` (Node), `os.getenv` (Python),
  or `import.meta.env` (Vite)
- Keep `.env.example` committed, `.env` in `.gitignore`
- Frontend env vars are public: never put secrets there
- Use a vault (AWS Secrets Manager, Vault) for production

```python
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL")
    jwt_secret: str = os.getenv("JWT_SECRET")
```

```env
# Frontend (Vite) vars by convention: VITE_ prefixed
VITE_API_URL=https://api.example.com
```

## Deployment Basics

### Common Environments
| Env | Purpose | Branch |
|-----|---------|--------|
| local | Dev on laptop | feature |
| development | Shared dev system | develop |
| staging | Pre-prod testing | release |
| production | Live users | main |

### Deployment Steps
1. Build assets (Vite/webpack), run migrations
2. Push container image (Docker) or static files
3. Health-check endpoint (`/healthz`) after start
4. Zero-downtime: blue/green or rolling deployment
5. Rollback path ready; keep last good image
6. Monitor errors and latency post-deploy

### Key Platforms
- Vercel / Netlify: frontend hosting, previews per PR
- Railway / Render / Fly: backend + DB, easy deploys
- AWS / GCP / Azure: full control, IAM, autoscaling
- Docker + Nginx sidecar for reverse proxy and TLS

## Full-Stack Checklist

### Before Shipping
- [ ] HTTPS configured, HTTP redirects blocked
- [ ] Secrets not in repo; env vars set per environment
- [ ] Input validated on server (not only in UI)
- [ ] All database queries parameterized
- [ ] Authentication + authorization enforced server-side
- [ ] Rate limiting and CORS properly configured
- [ ] Error responses structured, logs include request IDs
- [ ] Frontend handles loading, empty, and error states
- [ ] Responsive layout tested on mobile and desktop
- [ ] Accessibility basics: labels, alt text, focus states
- [ ] Bundle size reasonable, assets lazy-loaded
- [ ] Database indexes for hot queries and JOINs
- [ ] Migrations versioned and run before release
- [ ] Health check endpoint exists and is monitored
- [ ] Environment sealed: staging mirrors production config

## Real-World Application

- **E-commerce store (MERN)**: MongoDB for catalog, Express API with
  JWT auth, React storefront, Redis cart, Stripe webhooks, Nginx
  reverse proxy, deployed on Railway with a Postgres product search
- **SaaS dashboard**: Next.js (SSR for SEO) + FastAPI backend, Postgres
  + Redis cache, queues for report generation, Vercel for UI, AWS RDS
- **Real-time chat**: React + Socket.IO, Node service, Mongo for
  history, Redis pub/sub for fan-out across instances

## Common Pitfalls

- Putting secrets in the frontend bundle
- Validating only in the UI, trusting client data
- No CORS config: correct requests blocked, unsafe ones pass
- Fetching with no error/loading state, blank screens on failure
- Mixing deployment environments, "it works on my machine"
- Not running migrations, schema drift in production
- Blocking UI thread waiting on synchronous API calls
- Forgetting mobile viewport or overflow issues
- No rollback plan: deploy day freeze when things break

## Interview Tips

1. Trace one full request through your stack, from click to DB
2. Explain when monolith beats microservices (and vice versa)
3. Describe CORS: what it protects and how to configure it
4. Compare client rendering vs SSR vs SSG tradeoffs
5. Explain how cookies vs localStorage vs tokens differ for auth
6. Walk through a deploy: build, migrate, health check, rollback
7. Discuss where caching fits and how you invalidate it
8. Explain hydration and why SSR apps need it
9. Show you think about security at each layer of the stack
10. Be able to sketch the difference between MERN and MVC data flow

> Ship less, observe more: full-stack mastery is connecting layers cleanly.