---
layout: default
title: Backend Cheatsheet
parent: Backend
nav_order: 3
---

# Backend Cheat Sheet

Quick reference for API design, authentication, databases, caching, error
handling, security, and scaling.

> The backend is everything the user does not see: data, auth, and logic.

## Core Concepts

### REST API Design
- Resources are nouns: `/users`, `/products`, `/orders`
- Verbs are HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use plurals for collections, singular for an item
- Version the API: `/v1/users`
- Stateless: each request carries all needed context
- Filter, sort, paginate via query params: `?page=2&limit=20`
- Consistent response envelope for errors
- HTTP methods should be idempotent where possible

### HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET / PUT / PATCH |
| 201 | Created | Resource created (POST) |
| 202 | Accepted | Async job accepted |
| 204 | No Content | DELETE succeeded |
| 301 | Moved Permanently | Permanent redirect |
| 302 | Found | Temporary redirect |
| 304 | Not Modified | Cache still valid |
| 400 | Bad Request | Client sent invalid data |
| 401 | Unauthorized | Missing / bad credentials |
| 403 | Forbidden | Authenticated but no access |
| 404 | Not Found | Resource missing |
| 409 | Conflict | State conflict (duplicate) |
| 422 | Unprocessable | Validation fails |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Unexpected server bug |
| 502 | Bad Gateway | Upstream failed |
| 503 | Service Unavailable | Overloaded / maintenance |

### REST Methods Table

| Method | Purpose | Idempotent | Body | Typical Status |
|--------|---------|------------|------|----------------|
| GET | Read | Yes | No | 200 |
| POST | Create | No | Yes | 201 |
| PUT | Full replace | Yes | Yes | 200/204 |
| PATCH | Partial update | No | Yes | 200 |
| DELETE | Remove | Yes | Optional | 204 |

## Authentication

### JWT Structure
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature
```
- Header: algorithm + token type
- Payload: claims (`sub`, `exp`, `iat`, roles)
- Signature: HMAC or RSA over header+payload
- Store in memory or httpOnly cookie, NOT localStorage (XSS risk)
- Short expiry + refresh token rotation

### JWT vs OAuth vs Session

| Approach | Stateless | Best For | Notes |
|----------|-----------|----------|-------|
| Session cookie | No | Server-side apps | Easy to revoke |
| JWT | Yes | APIs, SPAs | Hard to revoke before expiry |
| OAuth 2.0 | Delegation | Third-party login | Grants scoped access |
| API Keys | Yes | B2B services | Static long-lived secret |

### OAuth 2.0 Grant Flow
```
User -> Authorization Server (login + consent)
     -> Authorization Code -> Backend
     -> Backend exchanges it for Access Token
     -> Access Token granted with scope + expiry
```

## Database Access

### ORM vs Raw SQL

| Concern | ORM (SQLAlchemy, Sequelize) | Raw SQL |
|---------|------------------------------|---------|
| Speed of dev | High | Lower |
| Readability | High (Python objects) | SQL-only |
| Performance | Can leak with N+1 | Full control |
| Migrations | Built-in | Manual |
| SQL skill needed | Less | More |
| Debugging | Indirect | Direct |

> Watch for N+1 queries: one query per related row instead of a JOIN.

### Connection Pooling
```
app -> pool (e.g., 5-10 idle connections) -> database
App reuses connections instead of opening per request.
```

### Indexing Quick Tips
- Index columns used in `WHERE`, `JOIN`, and `ORDER BY`
- Composite index order matters: leftmost prefix rule
- Avoid indexes on low-cardinality columns (e.g., boolean)
- Over-indexing slows writes (each index updated on insert)

## Caching Strategies

| Strategy | Pattern | Use When |
|----------|---------|----------|
| Cache Aside | Read cache, miss -> DB -> populate | General purpose |
| Read Through | Cache loads from DB on miss | Cache layer owns load |
| Write Through | Write cache + DB together | Strong consistency |
| Write Back | Write cache first, flush later | High write throughput |
| TTL | Expire after time | Time-sensitive data |

- Cache keys: version + resource + identifier, e.g., `v1:user:42`
- Invalidate on write, not only via TTL
- Store hot data: sessions, user profiles, lookups
- Cache stampede: single expensive recompute on expiry
- Redis for shared cache, in-process LRU for single-node

## Error Handling

- Fail fast at the boundary: validate input before doing work
- Return structured errors, never stack traces to clients
- Log with context: request id, user id, duration, error code
- Distinguish client errors (4xx) from server errors (5xx)
- Use retries with backoff for transient failures only
- Wrap third-party calls; map their errors to your API model
- Never swallow exceptions silently; log then decide

```python
# Structured error response
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "No user matches the given id",
    "detail": "id = 42",
    "request_id": "req_abc123"
  }
}
```

## Security

### Input Validation
- Validate on the server always, never trust the client
- Whitelist allowed values; reject unknown fields
- Parameterize all SQL queries to prevent injection
- Escape output to prevent stored/XSS attacks
- Validate types, ranges, lengths, and formats
- Use a schema library (Pydantic, Zod, marshmallow)

### Rate Limiting
- Per-user/IP/API-key token bucket or fixed window
- Return `429` + `Retry-After` header when exceeded
- DDoS protection sits in front of the app (WAF/CDN)

### Checklist
- HTTPS everywhere (TLS 1.2+), HSTS header
- Hash passwords with bcrypt/argon2; never plaintext
- Least privilege for DB/service accounts
- No secrets in code or `.env` committed to git
- Security headers: CSP, X-Content-Type-Options, X-Frame-Options
- Sanitize file uploads; validate content type and size
- Keep dependencies patched; check OpenSSF scores

## Scaling

- Stateless app servers behind a load balancer
- Add replicas horizontally; keep sessions in Redis
- Read replicas for heavy read workloads
- Denormalization + caching before premature sharding
- Shard on a stable, high-cardinality key (e.g., user_id)
- Use queues (RabbitMQ, SQS) to decouple slow work
- Autoscale on CPU, latency, or queue depth metrics
- Test with load tools: k6, Locust, JMeter

## Real-World Application

- **E-commerce**: Catalog service (read-heavy, cached), Order service
  (writes, transactional), Payment via webhooks + retries
- **Social feed**: Write path fans out to Redis lists; read path is
  fast cache reads; notifications via pub/sub
- **SaaS SaaS Billing**: Idempotent webhook handlers, rate-limited API
  keys per tenant, usage metering into a queue

## Common Pitfalls

- Returning 200 for everything; not using correct status codes
- Storing session/JWT tokens in unsafe storage on client
- N+1 query storms from ORM default lazy loading
- No connection pooling, exhausting DB connections
- Caching with no invalidation, serving stale data forever
- Leaking exceptions and stack traces in production logs/API
- Trusting client-provided `Authorization` or IDs without checks
- Infinite retry loops that amplify failures under load

## Interview Tips

1. Explain when to use POST vs PUT vs PATCH with idempotency
2. Compare JWT vs server-side sessions (trade-offs, revocation)
3. Describe exactly when you would add caching and how to invalidate
4. Explain a data flow: client request -> load balancer -> app -> DB
5. Walk through scaling a service: measure, cache, replicate, shard
6. Discuss rate limiting algorithms (token bucket vs sliding window)
7. Know how to design a REST API from a requirements list
8. Explain eventual consistency and why it appears distributed
9. Be ready to write a small async endpoint in Python (FastAPI)
10. Mention observability: logs, metrics, tracing from the start

> Good backends are boring and predictable: validation, retries, and logs.