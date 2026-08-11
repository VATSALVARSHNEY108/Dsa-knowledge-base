# System Design Cheat Sheet

Quick reference for design interviews: framework, scalability concepts,
capacity estimation, tradeoffs, and real-world systems.

## Core Concepts

- **System design**: architecture decisions that meet functional and
  non-functional requirements at scale.
- **Horizontal scaling**: add more machines (scale out).
- **Vertical scaling**: add more power to one machine (scale up).
- **Latency**: time for one request to complete.
- **Throughput**: requests processed per unit time.
- **Availability**: fraction of time the system serves requests.
- **Consistency**: all replicas return the same data.
- **Partition tolerance**: system works despite network failures.
- **CAP theorem**: a distributed system picks two of Consistency,
  Availability, Partition tolerance in a partition.

## The Design Interview Framework

### 1. Requirements (2-3 min)
- Clarify functional requirements (what the system must do).
- Clarify non-functional requirements (scale, latency, availability).
- Ask: DAU, reads vs writes ratio, data size, platforms.

### 2. Capacity Estimation (2-3 min)
- Estimate traffic: requests/sec from DAU.
- Estimate storage: rows/sec x data per row x retention period.
- Estimate bandwidth and cache size.

### 3. High-Level Design (5-7 min)
- Draw main components: client, load balancer, app servers,
  databases, cache, CDN, message queue.
- Show the request flow end to end.

### 4. Deep Dive (10-15 min)
- Pick 2-3 focus areas based on interviewer feedback.
- Areas to explore: data model, scaling, read/write path,
  caching strategy, consistency model.
- State the tradeoff of every decision explicitly.

### 5. Wrap Up
- Recap your choices and name what you would improve next.

```
                     ┌───────────────┐
 Client ────────────>│   CDN / LB    │───────────────┐
                     └──────┬────────┘               │
                            v                        v
                     ┌───────────────┐        ┌──────────────┐
                     │  App Servers  │───────>│   Cache      │
                     └──────┬────────┘        └──────┬───────┘
                            v                        │
                     ┌───────────────┐        ┌──────v───────┐
                     │   Databases   │<───────│  (cache-     │
                     │ (leader + rep)│  miss   │   aside)    │
                     └──────┬────────┘        └──────────────┘
                            v
                     ┌───────────────┐
                     │  Message Q    │ ──> workers / analytics
                     └───────────────┘
```

## Scalability Concepts

| Concept | What it does | Best use case |
|---------|-------------|---------------|
| Load balancer | Distributes requests across servers | Stateless API servers |
| CDN | Serves cached static content from edge | Images, videos, assets |
| Cache | Stores hot data in fast memory | Read-heavy workloads |
| Message queue | Decouples producers and consumers | Async jobs, traffic spikes |
| Sharding | Splits data by partition key | Write-heavy databases |
| Replication | Copies data to multiple nodes | High availability, reads |
| Database index | Speeds up lookups | Point queries on big tables |
| Read replicas | Serve reads from copies | Read-heavy applications |
| API gateway | Single entry, auth, rate limiting | Microservices |
| Batching/pagination | Limit work per request | Feeds, timelines |

### Horizontal vs Vertical Scaling

| | Horizontal | Vertical |
|--------------|------------|------------|
| How | Add servers | Add CPU/RAM/disk |
| Cap | Effectively unlimited | Hardware limit |
| Downtime | None (add node) | Required (replace) |
| Cost | Grows linearly | Grows super-linearly |
| Complexity | Higher (state, routing) | Lower |
| When | Stateless services | Hot single node |

## Caching

- **Cache-aside**: read cache, on miss load from DB and write back.
- **Write-through**: write cache and DB together (no stale reads, slower).
- **Write-back**: write cache only, flush to DB later (fast, risky).
- **Eviction policies**: LRU, LFU, FIFO, TTL.
- **Invalidation is hard**: use TTL plus event-driven invalidation.

## Database Scaling

- **Shard keys**: shard by user_id so related rows stay on one node.
- **Consistent hashing**: minimizes reshuffling when nodes join or leave.
- **Replication models**: single-leader, multi-leader, leaderless.
- **Read vs write path**: read replicas for reads; queue + workers for
  writes (see Twitter example).

## Capacity Estimation Table

Assume 10M DAU, each user does 10 requests/day:

| Metric | Math | Result |
|--------|------|--------|
| Requests/day | 10M x 10 | 100M/day |
| Requests/sec (avg) | 100M / 86,400 | ~1,160 RPS |
| Requests/sec (peak x5) | ~1,160 x 5 | ~5,800 RPS |
| Storage (per day) | 100M x 1 KB | ~100 GB/day |
| Storage (5 years) | 100 GB x 1,825 | ~183 TB |
| Read:write ratio | 90:10 feeds | ~1,044 R/s : 116 W/s |

> Orders of magnitude: 1 sec = 10^9 ns. Network round trip ~1-2 ms,
> DB read ~5-10 ms, cache read ~1 ms, in-memory op ~100 ns. Quoting
> these numbers signals that you reason about scale.

## Tradeoff Table

| Decision | Advantage | Cost |
|----------|-----------|------|
| Cache everything | Very fast reads | Stale data, cost, invalidation |
| Full replication | High availability | Write amplification, storage |
| Eventual consistency | Low latency, always up | Reads can be stale |
| Strong consistency | Predictable reads | Slower, lower availability |
| Microservices | Independent scaling | Network calls, ops overhead |
| Monolith | Simple, fast to build | Hard to scale independently |
| SQL | ACID, joins, flexible queries | Harder to shard |
| NoSQL | Horizontal scaling, flexible | No joins, weak consistency |
| Compute vs store | Cheap servers, big storage | High latency on access |
| Queue (async) | Absorbs spikes, decouples | Delayed results, retries |

## Common Patterns / Snippets

- **Fan-out on write**: write one tweet, push copies to follow queues.
- **Fan-in on read**: pull from follow queues, merge, sort by time.
- **Type-ahead / autocomplete**: trie per prefix, cached suggestions.
- **Rate limiting**: token bucket per user/IP at the API gateway.
- **Id generation** at scale: snowflake (timestamp + node + seq).
- **Leader election**: ZooKeeper/etcd; one writer, N replicas.

```
# Token bucket pseudocode (rough outline)
bucket = tokens                                     # per user key
rate   = r; capacity = c
on request: if bucket >= 1: take token, serve
            else: reject 429, refill at rate r/s
```

## Real-World System Examples

### Twitter (read-heavy feed)
- **Problem**: 10:1 reads-to-writes, millions of tweets/day.
- **Solution**: fan-out on write to follow queues; timeline cache
  (Redis); tweet objects cached; read replicas for reads.
- **Trades**: cache invalidation and hot users (celebrity) by
  pulling on read for mega-followers.

### WhatsApp (chat, strong delivery)
- **Problem**: real-time delivery with 2 billion users.
- **Solution**: WebSocket gateway per connection; offline storage
  in multi-datacenter store (NoSQL mirrors); end-to-end encryption;
  message queue for delivery retries.
- **Trades**: eventual consistency across data centers; ack-based
  ordering with sequence numbers per chat.

### URL Shortener (write-light, read-heavy)
- **Problem**: 100M URLs, reads 100x writes.
- **Solution**: base62 encode of a unique id; write full URL to DB,
  redirect maps short code -> URL; cache hot lookups (LRU/TTL).
- **Trades**: collision handling (id-based generation), 301 redirect
  for permanent mapping, per-domain rate limiting.

## Back-of-Envelope Numbers to Memorize

| Constant | Value |
|----------|-------|
| 1 day | 86,400 sec |
| 1 month | ~2.5M sec |
| 1 year | ~31.5M sec |
| RAM read | ~100 ns |
| Disk seek | ~10 ms |
| Network packet | ~0.1-1 ms |
| 1 Gbps link | ~125 MB/s |
| DB indexed read | ~1-10 ms |

## Common Pitfalls

- Designing features instead of requirements; ask before building.
- Guessing capacity without state assumptions. Always state them.
- Ignoring the write path in read-heavy designs.
- Deep-diving without first sharing a coherent high-level design.
- Using sharding when replication + read replicas would suffice.
- Designing a distributed system when a single DB with a cache works.

## Interview Tips

1. Keep a rhythm: requirements -> estimates -> high level -> deep dive.
2. Name tradeoffs; interviewers reward explicit reasoning.
3. Prefer boring, proven tech over novelty.
4. Watch the clock; allocate time percentages up front.
5. Handle failure: mention retries, timeouts, dead-letter queues.
6. Practice the classics: URL shortener, chat, feed, rate limiter,
   pastebin, search, payment, notification, parking lot.
7. End with monitoring, observability, and next steps.