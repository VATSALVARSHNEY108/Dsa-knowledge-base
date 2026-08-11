---
layout: default
title: Algorithms Cheatsheet
parent: Algorithms
nav_order: 1
---

# Algorithms Cheatsheet

Quick reference for the core algorithm patterns used in coding
interviews and competitive programming.

## Algorithm by Problem Type

| Problem Type | Algorithm | Complexity |
|--------------|-----------|------------|
| Search in sorted data | Binary search | O(log n) |
| Shortest path unweighted | BFS | O(V+E) |
| Explore / cycle detect | DFS | O(V+E) |
| Shortest path positive weights | Dijkstra | O((V+E) log V) |
| Shortest path negative weights | Bellman-Ford | O(V·E) |
| All pairs shortest path | Floyd-Warshall | O(V^3) |
| Minimum spanning tree | Kruskal / Prim | O(E log V) |
| Sort array | Merge / Quick / Heap | O(n log n) |
| Top K elements | Heap | O(n log k) |
| Count ways / optimize | Dynamic programming | problem specific |
| Exhaustive combos | Backtracking | exponential |
| Local best choice | Greedy | problem specific |
| Subarray properties | Sliding window | O(n) |
| Pair search sorted | Two pointers | O(n) |

## Core Pattern Templates

### Binary Search

```python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

### Two Pointers

```python
def two_sum(arr, target):  # arr sorted
    lo, hi = 0, len(arr) - 1
    while lo < hi:
        s = arr[lo] + arr[hi]
        if s == target:
            return [lo, hi]
        elif s < target:
            lo += 1
        else:
            hi -= 1
    return []
```

### Sliding Window (fixed k)

```python
def max_sum_subarray(arr, k):
    cur = sum(arr[:k])
    best = cur
    for i in range(k, len(arr)):
        cur += arr[i] - arr[i - k]
        best = max(best, cur)
    return best
```

### BFS

```python
from collections import deque

def bfs(graph, start):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)
    return seen
```

### Topological Sort (Kahn)

```python
def topo_sort(adj, indegree):
    from collections import deque
    q = deque([n for n in adj if indegree[n] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return order if len(order) == len(adj) else []
```

## Dynamic Programming Steps

1. Define `dp[i]` (what it stores).
2. Write the recurrence in terms of earlier states.
3. Set base cases.
4. Fill in a valid order (bottom-up or memoized).
5. Return the final state.

Common DP patterns: 1D linear, 2D grid, knapsack, string/interval,
tree DP, bitmask DP.

## Greedy vs DP

| Criterion | Greedy | DP |
|-----------|--------|-----|
| Local choice always optimal | Yes | No |
| Overlapping subproblems | No | Yes |
| Can backtrack a choice | No | Yes |
| Examples | Activity, coin (canonical) | Knapsack, LCS |

## Divide and Conquer

- **Split** problem in halves, **solve** recursively, **merge**.
- Examples: merge sort, quick sort, closest pair, binary search,
  counting inversions.

## Backtracking Template

```python
def backtrack(path, options):
    if goal_reached(path):
        record(path); return
    for choice in options:
        if is_valid(choice):
            path.append(choice)
            backtrack(path, remaining)
            path.pop()  # undo
```

## Sorting Decision

| Situation | Pick |
|-----------|------|
| Small n (<50) | Insertion sort |
| Nearly sorted | Insertion / Bubble |
| Stable sort needed | Merge / Timsort |
| Guaranteed O(n log n) | Merge / Heap |
| Fast average, in-place | Quick (good pivot) |
| Integers, small range | Counting sort |
| Fixed-width keys | Radix sort |

## Real-World Application Examples

- **Binary search** — phone book, debugging (git bisect).
- **BFS** — shortest steps, social degree of separation.
- **Dijkstra** — GPS navigation, network routing.
- **MST** — laying cables, clustering.
- **Topological sort** — course prerequisites, build systems.
- **DP** — route planning, resource allocation, text autocomplete.
- **Greedy** — coin change (canonical), scheduling.

## Common Pitfalls

1. **Wrong complexity** — O(n^2) on 10^5 input = TLE.
2. **Missing base cases** in recursion/DP.
3. **Integer overflow** in C++/Java sums/products.
4. **Not sorting** when algorithm requires sorted input.
5. **Forgetting visited set** in BFS/DFS (infinite loops).
6. **Greedy when DP is required** — local choice not optimal.

## Interview Checklist

```
□ State the algorithm and its time/space complexity up front
□ Draw the approach with a small example
□ Handle edge cases: empty, single element, duplicates
□ Prove correctness briefly (invariant / induction)
□ Ask about constraints to size your solution
```

> Know the PATTERN first — most problems reduce to a pattern
> you already know.