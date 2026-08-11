# DBMS Cheat Sheet

Quick reference for database fundamentals: ACID, database types,
normalization, indexing, transactions, and concurrency control.

## Core Concepts

- **DBMS**: software to store, retrieve, and manage data.
- **Schema**: the logical structure (tables + constraints).
- **Relational model**: data in tables with keys and relationships.
- **Transaction**: a logical unit of work (one or more statements).
- **ACID**: Atomicity, Consistency, Isolation, Durability.
- **Concurrency control**: keep transactions safe when interleaved.

## ACID

| Property | Meaning | Example of failure |
|----------|---------|---------------------|
| Atomicity | All steps succeed or none | Money transfer half done |
| Consistency | DB moves valid state to valid state | Violating a FK or constraint |
| Isolation | Concurrent transactions look serial | Dirty read / lost update |
| Durability | Committed data survives crashes | Power loss after commit |

> Isolation is the property most interviews probe: they ask which
> transaction isolation level appears and which anomalies it blocks.

## Database Types

| Type | Characteristics | Example products |
|------|-----------------|------------------|
| Relational (SQL) | Tables, joins, ACID, schema | MySQL, PostgreSQL, Oracle |
| Key-Value | Simple get/put by key | Redis, DynamoDB |
| Document | JSON/BSON records | MongoDB, CouchDB |
| Wide-column | Sparse columns, huge scale | Cassandra, Bigtable |
| Graph | Nodes + edges queries | Neo4j |
| Time-series | Append-heavy timestamps | InfluxDB, Timescale |
| In-memory | Sub-ms latency | Redis, Memcached |

### SQL vs NoSQL Quick Table

| | SQL | NoSQL |
|-----------|-----|-------|
| Schema | Fixed (migrations) | Flexible |
| Consistency | Strong (ACID) | Tuneable / eventual |
| Scaling | Vertical first, then shard | Horizontal by design |
| Query | Joins, aggregates | Key lookups, limited joins |
| Best for | Complex queries, money | High volume, fast writes |

## Normalization (1NF to 3NF)

**Schema**: `orders(id, customer_name, customer_city, items)`
where `items = "apples, bananas"`.

### 1NF -- Atomicity
- No repeating groups; each cell holds a single value.

```
orders(id, customer_name, customer_city, item)
(1, "Ada", "London", "apples")
(1, "Ada", "London", "bananas")    -- repeated group removed
```

### 2NF -- No partial dependency
- Meet 1NF; every non-key column depends on the whole key.
- For a composite key `(order_id, item_id)`, no column may depend
  on only one part. Split child data into rows.

### 3NF -- No transitive dependency
- Meet 2NF; non-key columns depend only on the key.
- `customer_city` depends on `customer_name`, not on `order_id`.
  Move it to a `customers` table.

```
customers(customer_id, customer_name, customer_city)
orders(order_id, customer_id, item)
```

| Normal form | Rule added |
|-------------|------------|
| 1NF | Atomic values, no repeating groups |
| 2NF | No partial dependency (depends on whole key) |
| 3NF | No transitive dependency (no column depends on non-key) |
| BCNF | Every determinant is a candidate key |

> Normalize to reduce redundancy and update anomalies; denormalize
> deliberately for read-heavy reporting.

## Indexing

- **Primary key**: clustered index by default in most engines; row
  data is physically ordered by it.
- **Secondary index**: lookup lands in the index, then fetches the
  row (two steps unless covering).

| Index structure | How it works | Best for |
|-----------------|--------------|----------|
| B+ tree | Balanced; leaf holds keys + data pointers | Range, equality, ORDER BY |
| Hash | Key -> bucket via hash | Exact equality, point lookups |
| Bitmap | Bit per distinct value | Low-cardinality columns |
| Covering | Index contains all needed columns | Avoiding table fetch |
| Inverted | Word -> documents | Full-text search |

- B+ tree has high fan-out => shallow tree, few disk reads even for
  millions of rows.
- Indexes speed reads but slow writes; pick them deliberately.
- Leftmost-prefix rule: composite `(a, b, c)` serves `a`, `a,b`,
  and `a,b,c`, not `b` alone.

## Transactions & Isolation Levels

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;        -- or ROLLBACK on any error
```

| Isolation level | Dirty read | Non-repeatable | Phantom |
|-----------------|-----------|----------------|---------|
| Read Uncommitted | Yes | Yes | Yes |
| Read Committed | No | Yes | Yes |
| Repeatable Read | No | No | Yes |
| Serializable | No | No | No |

- **Dirty read**: see uncommitted data of another transaction.
- **Non-repeatable read**: same row changes between two reads.
- **Phantom**: new rows appear between two same-condition reads.
- Defaults: PostgreSQL Read Committed (MVCC), MySQL Repeatable Read.

> MVCC (multi-version concurrency control): readers see a stable
> snapshot and never block writers; used by PostgreSQL and MySQL InnoDB.

## Concurrency Control

| Mechanism | Idea | Weakness |
|-----------|------|----------|
| Locking (2PL) | Lock, use, unlock in two phases | Contention, deadlocks |
| Deadlock detection | Detect cycle, abort victim | Abort/retry overhead |
| Optimistic | Check version at commit | Retries under contention |
| MVCC | Snapshot reads, writers proceed | Version storage cost |
| Timestamp order | Assign timestamps, order ops | Time-skew issues |

- **Lost update**: two txns read-modify-write the same value; one
  write is lost.
- **Lock types**: shared (S) for reads, exclusive (X) for writes.
- **Two-phase locking** blocks anomalies; plus gap locks stop
  phantoms at Repeatable Read.

## Deadlock Prevention

```
T1 locks A, waits for B
T2 locks B, waits for A   -> cycle -> DB aborts one
```

- Keep lock order consistent across transactions.
- Keep transactions short and commit quickly.
- Use retry logic on the client for aborted transactions.

## Real-World Examples

- **E-commerce checkout**: one transaction wraps inventory check,
  payment, and order insert; row lock stops oversell.
- **Bank transfer**: ACID keeps debit + credit perfectly paired.
- **Social feed**: NoSQL (Cassandra) for high-write timelines.
- **Analytics**: star schemas + denormalized fact tables.
- **Search**: inverted index on top of a document store.
- **Session store**: Redis key-value for sub-ms lookups.

## Common Pitfalls

- Storing data in one huge unnormalized table -> update anomalies.
- Over-normalizing until every read needs five joins.
- Skipping indexes, then blaming the DB for slow queries.
- Long transactions holding locks across network calls.
- Forgetting isolation or running at a level too high for scale.
- Believing NoSQL fixes everything; pick per access pattern.

## Interview Tips

1. Explain ACID with a transfer example; name the failure each
   property prevents.
2. Walk from 1NF to 3NF showing the same schema transform.
3. Relate isolation levels to realistic anomalies, not definitions.
4. For performance: index, EXPLAIN plan, and leftmost-prefix rule.
5. SQL vs NoSQL: match storage engine to access pattern.
6. Know defaults: MySQL InnoDB Repeatable Read; PostgreSQL Read
   Committed; both use MVCC.