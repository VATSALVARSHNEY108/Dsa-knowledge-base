---
layout: default
title: Algorithms Cheatsheet
parent: Python
nav_order: 1
---

# Python Algorithms Cheatsheet

Quick-reference for the algorithm implementations in this folder. Each entry maps to a
file under `Algorithms/`. Snippets run with Python 3.6+.

## Available Files

| Category | File | Problem |
| --- | --- | --- |
| Array | `two_sum.py` | Find two indices that sum to a target |
| Array | `maximum_subarray.py` | Kadane's maximum subarray sum |
| Dynamic Programming | `dynamic_programming.py` | Fib, stairs, coin change, knapsack, LCS, LIS |
| Graph | `graph.py` | BFS, DFS, Dijkstra, cycle detection, topo sort |
| Intervals | `merge_intervals.py` | Merge overlapping intervals |
| Recursion | `recursion.py` | Factorial, palindrome, backtracking, trees |
| Searching | `binary_search.py` | Find target in a sorted array |
| Sorting | `merge_sort.py` | Merge sort (divide and conquer) |
| String | `valid_palindrome.py` | Valid palindrome check |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

```python
def merge(arr, left, mid, right):
    n1 = mid - left + 1
    n2 = right - mid
    left_arr = arr[left:left + n1]
    right_arr = arr[mid + 1:mid + 1 + n2]
    i = j = 0
    k = left
    while i < n1 and j < n2:
        if left_arr[i] <= right_arr[j]:
            arr[k] = left_arr[i]; i += 1
        else:
            arr[k] = right_arr[j]; j += 1
        k += 1
    while i < n1:
        arr[k] = left_arr[i]; i += 1; k += 1
    while j < n2:
        arr[k] = right_arr[j]; j += 1; k += 1

def merge_sort(arr, left, right):
    if left < right:
        mid = left + (right - left) // 2
        merge_sort(arr, left, mid)
        merge_sort(arr, mid + 1, right)
        merge(arr, left, mid, right)
```

> Built-in: `list.sort()` (in-place, TimSort, stable, O(n log n)) and `sorted(iterable)`.

## Searching

| Algorithm | Time | Space | Precondition |
| --- | --- | --- | --- |
| Binary Search | O(log n) | O(1) | Sorted array |

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

> Built-in: the `bisect` module (`bisect_left`, `bisect_right`, `insort`) for binary
> search on sorted sequences.

## Graph Algorithms

| Algorithm | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS | O(V + E) | O(V) | Shortest path unweighted |
| DFS (rec/iter) | O(V + E) | O(V) | recursive uses call stack |
| Dijkstra | O((V + E) log V) | O(V) | heap-based shortest path |
| Cycle detection | O(V + E) | O(V) | DFS colors / parent |
| Topological sort | O(V + E) | O(V) | Kahn's algorithm |

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor, _ in graph.get_neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order
```

> Use `collections.deque` (O(1) popleft) for queues; `list.pop(0)` is O(n).

## Dynamic Programming

| Problem | File | Time | Space |
| --- | --- | --- | --- |
| Fibonacci (memo/tab) | `dynamic_programming.py` | O(n) | O(1) optimized |
| Climbing stairs | `dynamic_programming.py` | O(n) | O(1) |
| Coin change | `dynamic_programming.py` | O(n * k) | O(n) |
| 0/1 Knapsack | `dynamic_programming.py` | O(n * W) | O(W) optimized |
| Longest common subsequence | `dynamic_programming.py` | O(m * n) | O(m * n) |
| Longest increasing subsequence | `dynamic_programming.py` | O(n^2) / O(n log n) | O(n) |
| Kadane's max subarray | `maximum_subarray.py` | O(n) | O(1) |
| House robber | `dynamic_programming.py` | O(n) | O(1) |
| Unique paths | `dynamic_programming.py` | O(m * n) | O(n) |
| Edit distance | `dynamic_programming.py` | O(m * n) | O(m * n) |

```python
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

## String Algorithms

| Algorithm | Time | Space | File |
| --- | --- | --- | --- |
| Two-pointer palindrome | O(n) | O(1) | `valid_palindrome.py` |
| Recursive reverse/count | O(n) | O(n) | `recursion.py` |

```python
def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```

## Templates / Snippets

### Two Sum (hash map)
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

### Merge Intervals
```python
def merge(intervals):
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = []
    for start, end in intervals:
        if not merged or merged[-1][1] < start:
            merged.append([start, end])
        else:
            merged[-1][1] = max(merged[-1][1], end)
    return merged
```

### Dijkstra (heap)
```python
import heapq

def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph.get_nodes()}
    distances[start] = 0
    heap = [(0, start)]
    visited = set()
    while heap:
        dist, node = heapq.heappop(heap)
        if node in visited:
            continue
        visited.add(node)
        for neighbor, weight in graph.get_neighbors(node):
            new_dist = dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))
    return distances
```

### Backtracking (subsets)
```python
def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return result
```

### Memoization (decorator)
```python
def memoize(func):
    cache = {}
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
```

## Real-World Use

- **Merge sort**: stable sorting of linked lists, huge external datasets.
- **Binary search**: databases, interval search, numeric root finding.
- **BFS/DFS**: shortest paths, connectivity, social networks, puzzle solving.
- **Dijkstra**: GPS routing, network routing protocols, dependency resolution.
- **DP**: resource allocation (knapsack), bioinformatics (LCS/edit distance),
  finance (compounding), robotics (path counting).
- **Kadane**: stock trading profit windows, sensor anomaly detection.
- **Merge intervals**: calendar/meeting scheduling, log consolidation.
- **Palindrome**: DNA motif checks, editing-distance preprocess, filters.

## Pitfalls

- `list.pop(0)` is O(n) — use `deque.popleft()` for queues.
- `float('inf')` comparisons work, but arithmetic on inf can silently stay inf.
- Avoid default mutable args in memoized functions — use `functools.lru_cache` or `None`.
- `int // 2` truncates toward negative infinity; `(low + high) // 2` can overflow in
  other languages but is safe in Python's bigints.
- Python recursion limit (`sys.setrecursionlimit`) caps depth; convert to iteration for
  large inputs.
- Slicing copies lists: `arr[:]` is O(n) — hidden cost in recursive algorithms.
- `bisect_left` vs `bisect_right` matter for duplicate elements.
- Naive string concatenation in loops is O(n^2); join via `''.join(list)`.
