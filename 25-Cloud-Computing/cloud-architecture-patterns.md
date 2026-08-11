---
layout: default
title: Cloud Architecture Patterns
parent: Cloud Computing
nav_order: 1
---

# Cloud Architecture Patterns

## Overview

Cloud architecture patterns are reusable solutions to common problems in designing cloud-native applications. They help build scalable, resilient, and cost-effective systems.

## Microservices Pattern

Decompose monolithic applications into small, independent services.

```
┌─────────────────────────────────────────────────┐
│              Microservices Architecture           │
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  User   │  │  Order  │  │Payment  │        │
│  │ Service │  │ Service │  │Service  │        │
│  │ (Node)  │  │ (Java)  │  │ (Python)│        │
│  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │             │            │              │
│  ┌────▼────┐  ┌────▼────┐  ┌────▼────┐        │
│  │ Users DB│  │Orders DB│  │Payments │        │
│  │(Postgres)│ │(MongoDB) │  │(Stripe) │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                  │
│  Communication: REST, gRPC, Message Queue       │
└─────────────────────────────────────────────────┘
```

### Implementation

```yaml
# User Service - Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: user-service
        image: myregistry/user-service:v1.2
        ports:
        - containerPort: 8080
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: user-db
              key: host
---
# Order Service
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
spec:
  replicas: 5
  template:
    spec:
      containers:
      - name: order-service
        image: myregistry/order-service:v2.0
        env:
        - name: USER_SERVICE_URL
          value: "http://user-service:8080"
        - name: PAYMENT_SERVICE_URL
          value: "http://payment-service:8080"
```

## API Gateway Pattern

Single entry point for all client requests, handling routing, authentication, and rate limiting.

```
┌─────────────────────────────────────────────────┐
│              API Gateway Pattern                 │
│                                                  │
│  ┌────────┐                                      │
│  │ Mobile │──┐                                  │
│  └────────┘  │    ┌─────────────┐               │
│  ┌────────┐  ├───►│ API Gateway │               │
│  │  Web   │──┤    │  (Kong/NGINX)│              │
│  └────────┘  │    └──────┬──────┘               │
│  ┌────────┐  │           │                       │
│  │ Third  │──┘    ┌──────┼──────────┐           │
│  │ Party  │       │      │          │           │
│  └────────┘       ▼      ▼          ▼           │
│              ┌──────┐ ┌──────┐ ┌──────┐        │
│              │Users │ │Orders│ │Search│        │
│              └──────┘ └──────┘ └──────┘        │
└─────────────────────────────────────────────────┘
```

### NGINX API Gateway Config

```nginx
upstream user_service {
    server user-service:8080;
}

upstream order_service {
    server order-service:8080;
}

server {
    listen 443 ssl;

    location /api/users {
        proxy_pass http://user_service;
        proxy_set_header X-Real-IP $remote_addr;
        limit_req zone=api burst=20 nodelay;
    }

    location /api/orders {
        proxy_pass http://order_service;
        proxy_set_header X-Real-IP $remote_addr;
        limit_req zone=api burst=10 nodelay;
    }

    location /api/search {
        proxy_pass http://search-service:8080;
    }
}
```

## Event-Driven Architecture

Services communicate asynchronously through events, enabling loose coupling.

```
┌─────────────────────────────────────────────────┐
│           Event-Driven Architecture              │
│                                                  │
│  ┌────────┐    ┌──────────────┐    ┌────────┐  │
│  │ Order  │───►│ Message      │───►│Payment │  │
│  │ Service│    │ Queue        │    │Service │  │
│  └────────┘    │ (Kafka/RMQ) │    └────────┘  │
│                │              │                  │
│  Event:        │ ┌──────────┐│    ┌────────┐  │
│  order.created │ │ Topics   ││───►│ Email  │  │
│                │ │          ││    │Service │  │
│                │ └──────────┘│    └────────┘  │
│                │              │                  │
│                │              │    ┌────────┐  │
│                │              │───►│Analytics│ │
│                └──────────────┘    └────────┘  │
└─────────────────────────────────────────────────┘
```

### Kafka Event Example

```python
from kafka import KafkaProducer, KafkaConsumer
import json

# Producer
producer = KafkaProducer(
    bootstrap_servers=['kafka:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Publish event
producer.send('orders', value={
    'event': 'order.created',
    'order_id': '12345',
    'user_id': 'user-1',
    'total': 99.99,
    'timestamp': '2024-01-15T10:30:00Z'
})

# Consumer
consumer = KafkaConsumer(
    'orders',
    bootstrap_servers=['kafka:9092'],
    group_id='payment-service',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

for message in consumer:
    event = message.value
    if event['event'] == 'order.created':
        process_payment(event)
```

## Circuit Breaker Pattern

Prevent cascading failures when a downstream service is unavailable.

```
┌─────────────────────────────────────────────────┐
│            Circuit Breaker States                │
│                                                  │
│  ┌──────────┐   failures   ┌──────────────┐    │
│  │  CLOSED  │─────────────►│    OPEN      │    │
│  │ (normal) │              │  (failing)   │    │
│  └────┬─────┘              └──────┬───────┘    │
│       │                           │             │
│       │ success              timeout             │
│       │                           │             │
│       │                    ┌──────▼───────┐    │
│       │◄───────────────────│ HALF-OPEN    │    │
│       │   success          │ (testing)    │    │
│       │                    └──────────────┘    │
└─────────────────────────────────────────────────┘
```

```python
import circuitbreaker
import requests

@circuitbreaker.circuit(
    failure_threshold=5,
    recovery_timeout=30,
    expected_exception=requests.exceptions.RequestException
)
def call_payment_service(order_id):
    response = requests.post(
        'http://payment-service:8080/pay',
        json={'order_id': order_id},
        timeout=5
    )
    response.raise_for_status()
    return response.json()

# When circuit is open, raises CircuitBreakerError
# Application can return fallback response
```

## Caching Patterns

```
┌─────────────────────────────────────────────────┐
│              Caching Strategies                  │
│                                                  │
│  Cache-Aside (Lazy Loading):                    │
│  App ──► Cache ──miss──► Database               │
│  App ◄── Cache ◄──writes── Database             │
│                                                  │
│  Write-Through:                                 │
│  App ──► Cache ──► Database (sync write)        │
│                                                  │
│  Write-Behind:                                  │
│  App ──► Cache ──async──► Database              │
│                                                  │
│  Read-Through:                                  │
│  App ──► Cache ──► Database (cache loads)       │
└─────────────────────────────────────────────────┘
```

### Redis Caching Example

```python
import redis
import json

r = redis.Redis(host='redis', port=6379, decode_responses=True)

def get_user(user_id):
    # Try cache first
    cached = r.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)

    # Cache miss - query database
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)

    # Write to cache with TTL
    r.setex(
        f"user:{user_id}",
        3600,  # 1 hour TTL
        json.dumps(user)
    )
    return user
```

## Strangler Fig Pattern

Gradually replace a monolith by routing traffic to new services.

```
┌─────────────────────────────────────────────────┐
│           Strangler Fig Pattern                  │
│                                                  │
│  Phase 1:                                       │
│  Request ──► Router ──95%──► Monolith           │
│                   ──5%───► New Service           │
│                                                  │
│  Phase 2:                                       │
│  Request ──► Router ──60%──► Monolith           │
│                   ──40%──► New Services          │
│                                                  │
│  Phase 3:                                       │
│  Request ──► Router ──0%───► Monolith           │
│                   ──100%─► New Services          │
└─────────────────────────────────────────────────┘
```

## Blue-Green Deployment

```
                ┌────────────────┐
                │ Load Balancer  │
                └────────┬───────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
      ┌─────▼─────┐          ┌──────▼──────┐
      │   Blue    │          │   Green     │
      │  (v1)     │          │   (v2)      │
      │  ACTIVE   │          │  STANDBY    │
      └───────────┘          └─────────────┘

      Deploy v2 to Green, test, then switch LB to Green.
      Rollback = switch LB back to Blue.
```

## CQRS (Command Query Responsibility Segregation)

Separate read and write models for scalability.

```
┌─────────────────────────────────────────────────┐
│                   CQRS                          │
│                                                  │
│  Write Model          Read Model                │
│  ┌──────────┐         ┌──────────┐              │
│  │ Commands │         │ Queries  │              │
│  │ (Create, │         │ (Get,    │              │
│  │  Update, │         │  List,   │              │
│  │  Delete) │         │  Search) │              │
│  └────┬─────┘         └────┬─────┘              │
│       │                    │                     │
│  ┌────▼─────┐         ┌────▼─────┐              │
│  │ Write DB │──sync──►│ Read DB  │              │
│  │(Postgres)│         │(Elastic) │              │
│  └──────────┘         └──────────┘              │
└─────────────────────────────────────────────────┘
```

## Serverless Pattern

```
┌─────────────────────────────────────────────────┐
│              Serverless Architecture              │
│                                                  │
│  ┌────────┐    ┌─────────────┐                  │
│  │ Client │───►│ API Gateway │                  │
│  └────────┘    └──────┬──────┘                  │
│                       │                          │
│              ┌────────┼────────┐                 │
│              ▼        ▼        ▼                 │
│         ┌────────┐┌────────┐┌────────┐         │
│         │ Lambda ││ Lambda ││ Lambda │         │
│         │ auth   ││ users  ││ orders │         │
│         └───┬────┘└───┬────┘└───┬────┘         │
│             │         │         │                │
│         ┌───▼──┐  ┌───▼──┐  ┌──▼───┐          │
│         │ Dynamo│  │ S3   │  │ SQS  │          │
│         │ DB   │  │      │  │      │          │
│         └──────┘  └──────┘  └──────┘          │
└─────────────────────────────────────────────────┘
```

## Pattern Selection Guide

| Scenario | Recommended Pattern |
|----------|-------------------|
| Complex monolith | Microservices + Strangler Fig |
| High read traffic | Caching + CQRS |
| Reliable service communication | Circuit Breaker |
| Real-time data processing | Event-Driven |
| Public API exposure | API Gateway |
| Frequent deployments | Blue-Green or Canary |
| Variable workloads | Serverless |
| Scalable reads/writes | CQRS |

## Best Practices

1. **Start simple**, evolve to patterns as complexity grows
2. **Design for failure** - every service call can fail
3. **Use idempotent operations** for retries
4. **Implement observability** - logs, metrics, traces
5. **Automate everything** - CI/CD, infrastructure, scaling
6. **Secure by default** - zero trust, encryption, RBAC
7. **Monitor costs** - set budgets, use cost allocation tags
