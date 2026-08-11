---
layout: default
title: Data Engineering Cheatsheet
parent: Data Engineering
nav_order: 1
---

# Data Engineering Cheat Sheet

Quick reference for data engineering: pipelines, architecture, tools,
modeling, and data quality best practices.

## Core Concepts

- **Data Engineering**: Design, build, and maintain systems that collect,
  store, and process data for analysis and machine learning.
- **ETL**: Extract, Transform, Load. Data is transformed BEFORE it enters
  the warehouse.
- **ELT**: Extract, Load, Transform. Raw data is loaded first, transformed
  inside the warehouse. Modern default.
- **Pipeline**: A chain of steps that moves data from source to destination.
- **Batch vs Streaming**: Batch processes data in scheduled chunks;
  streaming processes data in near-real-time.
- **Idempotency**: Re-running a job produces the same result. Essential for
  reliable pipelines.
- **Backfill**: Re-running a pipeline over historical data to fill gaps.

> ELT wins when the warehouse is powerful and storage is cheap (Snowflake,
> BigQuery). ETL still fits strict compliance or weak warehouse engines.

## Quick Reference Tables

### Pipeline Stages

| Stage | Actions | Common Tools |
|-------|---------|--------------|
| Ingest | Pull raw data from sources | Kafka, Fivetran, Airbyte |
| Process | Clean, transform, join | Spark, dbt, Pandas |
| Load | Write to warehouse/lake | Snowflake, Redshift, S3 |
| Orchestrate | Schedule and monitor steps | Airflow, Dagster, Prefect |
| Serve | Expose to BI/ML consumers | BI tools, feature stores |

### Data Lake vs Data Warehouse

| Dimension | Data Lake | Data Warehouse |
|-----------|-----------|----------------|
| Data type | Raw, any format | Structured, curated |
| Schema | On-read (schema-on-read) | On-write (schema-on-write) |
| Users | Data scientists, engineers | Analysts, BI users |
| Storage cost | Cheap (object storage) | Higher |
| Typical engine | S3 + Spark/Presto | Snowflake, Redshift |
| Use case | ML, exploration | Reporting, KPIs |
| Quality | Unmanaged | Governed, high quality |

### Common Tools at a Glance

| Tool | Category | Best For |
|------|----------|----------|
| Airflow | Orchestration | Scheduling DAG-based ETL |
| Spark | Processing | Distributed batch, in-memory joins |
| Kafka | Streaming | Decoupling event producers/consumers |
| dbt | Transformation | SQL transformations in the warehouse |
| Fivetran | Ingestion | Managed connectors, quick ingestion |
| Airbyte | Ingestion | Open-source connections |
| Snowflake | Warehouse | Elastic cloud analytics |

### Data Modeling Approaches

| Approach | Description | When to Use |
|----------|-------------|-------------|
| Star Schema | Fact + dimension tables | Classic BI reporting |
| Snowflake Schema | Normalized dimensions | Warehouse space savings |
| 3NF | Fully normalized | OLTP, high integrity |
| Kimball | Dimensional modeling | Data warehouse design |
| Data Vault | Hubs, links, satellites | Auditable enterprise stores |

## Common Patterns / Snippets

### ELT with dbt (SQL)

```sql
-- models/clean_orders.sql
WITH orders AS (
    SELECT * FROM {{ ref('raw_orders') }}
)
SELECT
    order_id,
    customer_id,
    total_amount * 1.15 AS total_with_tax,
    DATE(created_at) AS order_date
FROM orders
WHERE status != 'cancelled'
```

```yaml
# dbt_project.yml
name: ecommerce
version: '1.0'
profile: ecommerce
model-paths: ["models"]
models:
  ecommerce:
    staging:
      +materialized: view
    marts:
      +materialized: table
```

### Simple Python ETL Snippet

```python
def etl():
    raw = extract_from_api()        # Extract
    clean = raw[raw["amount"] > 0]  # Transform
    clean["amount"] = clean["amount"].round(2)
    load_to_warehouse(clean)        # Load
```

### Airflow DAG (YAML-style skeleton)

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    "owner": "dataeng",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    "daily_orders_pipeline",
    default_args=default_args,
    schedule="0 3 * * *",
    start_date=datetime(2026, 1, 1),
    catchup=False,
) as dag:
    extract = PythonOperator(task_id="extract", python_callable=extract)
    transform = PythonOperator(task_id="transform", python_callable=transform)
    load = PythonOperator(task_id="load", python_callable=load)

    extract >> transform >> load
```

### Data Quality Checks (SQL)

```sql
-- Expectation: no NULL primary keys
SELECT COUNT(*) AS bad_rows
FROM raw_orders
WHERE order_id IS NULL;
```

## Best Practices

- **Design for idempotency** — always re-runnable with the same result.
- **Partition tables** by date or key to keep scans cheap.
- **Use incremental loads** — only process data that changed.
- **Version the schema** (schema registry); assume sources evolve.
- **Add data quality tests** at every stage (dbt `tests/`, expectations).
- **Make pipelines observable** — alert on latency and row-count drift.
- **Keep transformations in SQL/dbt** where possible; Python when logic
  needs richer code.
- **Never hardcode secrets** — use a secrets manager / env vars.
- **Document ownership** — every table should have an owner and lineage.
- **Isolate prod from dev** environments and promote via CI.

> Row-count drift is the first symptom of a broken join or dropped source.
> Monitor it before correctness bugs reach reports.

## Real-World Application

- **E-commerce**: Kafka ingests clickstream events; Spark aggregates daily
  metrics; dbt builds `daily_revenue` and `cohort_retention` tables.
- **Fintech**: Batch-loaded transaction files; reconciliation job compares
  warehouse totals to source systems every morning.
- **SAAS analytics**: Fivetran pulls CRMs and billing APIs into Snowflake;
  dbt models join them into a single customer-360 view.
- **IoT / sensors**: Streaming pipeline stores raw readings in a lake,
  then a scheduled job builds hourly aggregates for dashboards.

## Common Pitfalls

- Grabbing the entire dataset "just in case" — pay-per-query costs explode.
- No row-level dedup — duplicates break revenue numbers.
- Transformations hidden inside BI tools instead of the pipeline.
- Missing cleanup of staging/raw tables (unbounded cost).
- Airflow DAGs with huge single tasks that skip parallelism.
- Not testing schema changes before deployment — broken joins.
- Forgetting timezone handling in day-partitioned tables.
- Building a whole lake but failing to document schemas — data swamp.