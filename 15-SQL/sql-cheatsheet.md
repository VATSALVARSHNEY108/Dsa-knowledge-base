# SQL Cheat Sheet

Quick reference for writing, optimising, and understanding SQL:
query order, joins, aggregations, window functions, and indexes.

## Core Concepts

- **SQL**: structured language to query and manipulate relational data.
- **Table**: rows (records) + columns (attributes) with a schema.
- **Primary key**: uniquely identifies a row.
- **Foreign key**: references a primary key in another table.
- **NULL**: absence of a value; comparisons use `IS NULL`, not `=`.
- **CRUD**: INSERT (create), SELECT (read), UPDATE, DELETE.

## SELECT Clause Order (Writer's Order)

```sql
SELECT   columns                  -- what to return
FROM     table(s)                 -- source(s)
JOIN     other ON condition       -- link tables
WHERE    row filter               -- before grouping
GROUP BY columns                  -- form groups
HAVING   group filter             -- after grouping
ORDER BY columns [ASC|DESC]       -- sort result
LIMIT    n                        -- cap rows returned
OFFSET   m                        -- skip rows (paging)
```

### Logical Execution Order (Reader's Order)

```sql
1 FROM / JOIN            -- build initial set
2 WHERE                  -- filter rows
3 GROUP BY               -- aggregate groups
4 HAVING                 -- filter groups
5 SELECT                 -- compute output columns
6 DISTINCT               -- drop duplicates
7 ORDER BY               -- sort
8 LIMIT / OFFSET         -- slice output
```

> Because WHERE runs before SELECT, aliases defined in SELECT
> cannot be used in WHERE. HAVING can use aggregation results.

## JOIN Types

```sql
INNER JOIN  -- only matching rows both sides
LEFT  JOIN  -- all left rows; NULLs where right missing
RIGHT JOIN  -- all right rows; NULLs where left missing
FULL  JOIN  -- all rows from both sides
CROSS JOIN  -- every combination (cartesian product)
SELF  JOIN  -- join table to itself (aliases required)
```

| Join | Rows kept | Syntax |
|------|-----------|--------|
| INNER | Both match | `INNER JOIN b ON a.id = b.id` |
| LEFT OUTER | Left + matched right | `LEFT JOIN b ON a.id = b.id` |
| RIGHT OUTER | Right + matched left | `RIGHT JOIN b ON a.id = b.id` |
| FULL OUTER | Both sides | `FULL OUTER JOIN b ON ...` |
| CROSS | n x m rows | `CROSS JOIN b` |

## Aggregation and GROUP BY

```sql
SELECT genre, COUNT(*), AVG(rating)
FROM movies
GROUP BY genre
HAVING COUNT(*) > 10
ORDER BY AVG(rating) DESC;
```

| Function | Returns | Notes |
|----------|---------|-------|
| COUNT(*) | row count | includes NULLs |
| COUNT(col) | non-null count | ignores NULLs |
| SUM(col) | total | ignores NULLs |
| AVG(col) | mean | ignores NULLs |
| MIN / MAX | extremes | works on strings too |
| DISTINCT | unique values | `COUNT(DISTINCT col)` |

- Every non-aggregated column in SELECT must appear in GROUP BY.
- Use HAVING for conditions on aggregates; WHERE for raw rows.

## Window Functions

```sql
SELECT employee_id, department, salary,
       RANK()         OVER (PARTITION BY department
                            ORDER BY salary DESC) AS rnk,
       DENSE_RANK()   OVER (PARTITION BY department
                            ORDER BY salary DESC) AS drnk,
       ROW_NUMBER()   OVER (PARTITION BY department
                            ORDER BY salary DESC) AS rn,
       AVG(salary)    OVER (PARTITION BY department) AS dept_avg,
       LAG(salary, 1) OVER (ORDER BY salary) AS prev_sal
FROM employees;
```

| Function group | Examples | Purpose |
|----------------|----------|---------|
| Ranking | ROW_NUMBER, RANK, DENSE_RANK | Assign ranks (ties differ) |
| Analytic | LAG, LEAD, NTILE | Access neighbours / buckets |
| Aggregate | SUM, AVG, COUNT + OVER | Running totals, per-group |
| Distribution | PERCENT_RANK, CUME_DIST | Relative positions |

- `OVER (PARTITION BY ... ORDER BY ...)` defines the window.
- `ROW_NUMBER` unique; `RANK` skips on ties; `DENSE_RANK` does not.
- Without PARTITION BY, the whole result set is one window.

## Subqueries

```sql
-- scalar: one value
SELECT name FROM products
WHERE price = (SELECT MAX(price) FROM products);

-- correlated: references outer query
SELECT e.name FROM employees e
WHERE e.salary > (SELECT AVG(salary) FROM employees
                  WHERE department_id = e.department_id);

-- IN / EXISTS for membership
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o
              WHERE o.customer_id = c.id);

-- CTE improves readability and reuse
WITH dept_avg AS (
    SELECT department_id, AVG(salary) AS avg_sal
    FROM employees GROUP BY department_id
)
SELECT d.name, a.avg_sal
FROM departments d JOIN dept_avg a ON d.id = a.department_id;
```

## Indexes

```sql
CREATE INDEX idx_user_email ON users(email);
CREATE UNIQUE INDEX idx_user_uid ON users(user_uuid);
CREATE INDEX idx_composite ON orders(status, created_at);
DROP INDEX idx_user_email;
```

| Index type | Better for | Tradeoff |
|------------|-----------|----------|
| B-tree (default) | equality + range, ORDER BY | extra write cost |
| Unique | uniqueness enforcement | must be unique |
| Composite | multi-column filters | column order matters |
| Covering | queries only needing columns | more storage |
| Hash | equality lookups | no range scans |
| Full-text | text search | not for generic queries |

## Aggregate vs Window Quick Table

| | Aggregate | Window |
|-----------|-----------|--------|
| Shrinks rows? | Yes, groups collapse | No, all rows stay |
| Where | GROUP BY + HAVING | SELECT with OVER |
| Example | AVG(salary) per dept | running AVG per row |

## Query Optimization Tips

1. Always EXPLAIN the query; fix the worst-scoring plan first.
2. Index the columns used in WHERE, JOIN, and ORDER BY.
3. Avoid `SELECT *`; request only needed columns.
4. Avoid functions on column in WHERE (breaks index use).
5. Use covering indexes for hot read queries.
6. Rewrite `NOT IN (subquery)` as NOT EXISTS when needed.
7. Keep LIKE patterns anchored: `'abc%'` uses index, `'%abc'` not.
8. Limit early; page with keyset `WHERE id > last_id ORDER BY id`.
9. Update in batches to avoid long locks and bloat.
10. Prevent implicit casts: compare same types, not strings to ints.

## DML Quick Reference

```sql
INSERT INTO users(name) VALUES ('Ada');
UPDATE users SET name = 'Grace' WHERE id = 1;
DELETE FROM users WHERE id = 1;      -- careful without WHERE

-- upsert (PostgreSQL)
INSERT INTO users(id, name) VALUES (1, 'Ada')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
```

## Practice Queries

```sql
-- second-highest salary per department
SELECT department_id, MAX(salary)
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees
                GROUP BY department_id)
GROUP BY department_id;

-- department with max average salary
SELECT department_id, AVG(salary) AS avg_sal
FROM employees
GROUP BY department_id
ORDER BY avg_sal DESC
LIMIT 1;

-- users who ordered more than once in a month
SELECT customer_id, DATE_TRUNC('month', created_at) AS month,
       COUNT(*) AS orders
FROM orders
GROUP BY customer_id, DATE_TRUNC('month', created_at)
HAVING COUNT(*) > 1;

-- running total of sales
SELECT order_date,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;

-- top 3 orders per customer (greatest-n-per-group)
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
      PARTITION BY customer_id ORDER BY amount DESC) AS rn
  FROM orders
) t WHERE rn <= 3;
```

## Common Pitfalls

- Missing semicolons and wrong quoted types ('5' vs 5).
- Using `=` on NULL; always use `IS NULL` / `IS NOT NULL`.
- Forgetting GROUP BY columns or putting row filters in HAVING.
- Implicit type coercion causing index scans.
- Counting with `COUNT(col)` and forgetting NULLs are skipped.
- Joining without ON (accidental cartesian product).

## Interview Tips

1. Walk through clause order aloud; it signals mastery.
2. Know RANK vs DENSE_RANK vs ROW_NUMBER on ties.
3. Use CTEs to break complex queries into readable steps.
4. Mention partition keys and index stats when discussing
   performance.
5. Practice greatest-n-per-group: it appears in every round.
6. Know how your engine (MySQL/PostgreSQL) differs: LIMIT vs
   TOP vs FETCH FIRST, DATE_TRUNC, and auto-increment syntax.