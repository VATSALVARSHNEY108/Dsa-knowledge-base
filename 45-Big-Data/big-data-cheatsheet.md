# Big Data Cheat Sheet

Quick reference for big data: the 5 Vs, Hadoop ecosystem, batch vs stream
processing, and distributed concepts.

## Core Concepts

- **Big Data**: Datasets too large or complex for traditional tools to
  store, process, or analyze efficiently.
- **5 Vs**:
  - **Volume**: Huge amount of data (terabytes to petabytes).
  - **Velocity**: Speed of data generation and processing.
  - **Variety**: Many formats — text, JSON, images, logs, video.
  - **Veracity**: Quality, noise, and trustworthiness of data.
  - **Value**: Business insight derived from the data.
- **Distributed Computing**: Splitting work across many machines that work
  in parallel.
- **Horizontal Scaling**: Add more machines (big data standard).
- **Vertical Scaling**: Make one machine bigger (limited by hardware).

> Big data is a *systems* problem. The goal is parallelism, fault
> tolerance, and scalability across commodity hardware.

## Quick Reference Tables

### Hadoop Ecosystem Components

| Component | Layer | Role |
|-----------|-------|------|
| HDFS | Storage | Distributed file system, stores blocks |
| MapReduce | Processing | Batch processing model (map + reduce) |
| YARN | Resource Mgmt | Schedules jobs across cluster nodes |
| Hive | SQL on Hadoop | SQL interface over batch data |
| HBase | NoSQL DB | Real-time random access to sparse data |
| Spark | Processing | In-memory, faster batch + streaming |
| Kafka | Streaming | Distributed message queue, event log |
| Flume / Sqoop | Ingestion | Ingest logs / transfer RDBMS tables |
| Pig | Processing | High-level scripting (legacy) |
| ZooKeeper | Coordination | Config + leader election for clusters |

### Batch vs Stream Processing

| Dimension | Batch Processing | Stream Processing |
|-----------|------------------|-------------------|
| Latency | Minutes to hours | Seconds to milliseconds |
| Data window | All of it, at once | Continuously |
| Cost per event | Low | Higher |
| Tools | Spark, MapReduce, Hive | Kafka Streams, Flink, Spark Streaming |
| Use case | Daily reports, backfills | Fraud, real-time dashboards |
| Handling | Easier to reason about | Needs checkpointing/watermarks |

### Storage vs Compute

| Concern | HDFS / Cloud Storage | Spark / MapReduce |
|---------|----------------------|-------------------|
| Worried about | Durability, replication | CPU, memory, joins |
| Unit | Data blocks | Jobs, stages, tasks |
| Scaling | Add nodes (NameNode/DataNode)* | Add executors |

> In cloud setups (EMR, Databricks), storage and compute are decoupled:
> S3 holds data, clusters spin up only for jobs.

### Partitioning vs Parallelism

| Concept | Meaning | Used For |
|---------|---------|----------|
| Partitioning | Splits data by a key/range | Query pruning, locality |
| Parallelism | Many workers run tasks at once | Speed, throughput |
| Shuffle | Data re-sorted across nodes | Joins, group-by |
| Replication | Copies of data blocks | Fault tolerance |

## Common Patterns / Snippets

### MapReduce Mental Model

```
Input            Map                Shuffle            Reduce
records  ->  (key, value) pairs -> group by key -> aggregate per key
```

### Spark DataFrame Example (Python)

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("demo").getOrCreate()

df = spark.read.parquet("s3://bucket/raw_events/*.parquet")

result = (
    df.filter(df.event_type == "purchase")
      .groupBy("country")
      .count()
)

result.write.mode("overwrite").parquet("s3://bucket/counts/")
```

### Streaming with Kafka + Spark

```python
stream = (
    spark.readStream
        .format("kafka")
        .option("kafka.bootstrap.servers", "broker:9092")
        .option("subscribe", "events")
        .load()
)

counts = (
    stream.selectExpr("cast(value as string) as msg")
          .groupBy("msg")
          .count()
)

query = counts.writeStream.outputMode("complete").start()
```

### Partitioning Table in Hive

```sql
CREATE TABLE clicks (
    user_id INT,
    page STRING
)
PARTITIONED BY (year INT, month INT);
```

> Partitioning along frequently-used filter keys (date, region) cuts scan
> cost dramatically in both Hive and Spark.

## Best Practices

- **Choose partition keys** that match your query filters.
- **Avoid data skew** — a hot key creates straggler tasks.
- **Coalesce/repartition** output to an appropriate number of files.
- **Use columnar formats** (Parquet, ORC) with compression.
- **Set sensible replication factors** (HDFS default 3).
- **Test on a sample** before launching full-scale jobs.
- **Monitor and tune** memory, cores, and shuffle partitions.
- **Prefer Spark over MapReduce** for new batch workloads.
- **Use watermarks** in streaming to handle late data.

> A job that fits in memory is not big data. Choose streaming/batch
> approach based on latency requirements, not hype.

## Real-World Application

- **Clickstream analytics**: Kafka ingests billions of events/day, Spark
  aggregates hourly sessions, Hive tables serve BI dashboards.
- **Recommendation preprocess**: HDFS stores user-item logs; nightly
  Spark job builds training matrices for ML.
- **IoT telemetry**: Streaming pipeline detects anomalies in sensor data
  in real time; batch job computes daily summaries.
- **Log ingestion**: Flume/Sqoop move logs and RDBMS snapshots into HDFS;
  Hive queries power operational dashboards.

## Common Pitfalls

- **Small file problem**: Millions of tiny files kill HDFS and Spark.
- **Unbounded shuffles**: Joins without pre-partitioning cause skew.
- **Ignoring skew**: One hot key stalls an entire job.
- **No schema enforcement** in raw lakes — write garbage, query garbage.
- **Over-provisioning**: Running 1000 executors for a 1 GB job.
- **Blocking stream consumers** — Kafka offsets lag, data falls behind.
- **Not compressing** data — storage and network waste.
- **Copying "everything to memory"** statements from tutorials without
  understanding memory limits.