---
layout: default
title: Algorithms Cheatsheet
parent: C
nav_order: 1
---

# C Algorithms Cheatsheet

> Quick reference for the algorithm implementations in `C/Algorithms/`.
> Each entry links to the matching `.c` file in this folder.

## Available Implementations

| Topic | File | Problem |
|---|---|---|
| Array | `Array/two_sum.c` | Two Sum (brute force) |
| Dynamic Programming | `DynamicProgramming/fibonacci.c` | Fibonacci (bottom-up DP) |
| Graph | `Graph/bfs.c` | BFS on adjacency matrix |
| Intervals | `Intervals/merge_intervals.c` | Merge overlapping intervals |
| Recursion | `Recursion/tower_of_hanoi.c` | Tower of Hanoi |
| Searching | `Searching/binary_search.c` | Binary search on sorted array |
| Sorting | `Sorting/merge_sort.c` | Merge sort |
| String | `String/palindrome.c` | Palindrome check (two pointers) |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Radix | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n+k) | Yes |

> C has no built-in sort. Use `qsort()` from `<stdlib.h>` for general use, or a
> hand-rolled algorithm (see `Sorting/merge_sort.c`) for stable O(n log n).

Merge sort core (see `Sorting/merge_sort.c`):
```c
void merge_sort(int arr[], int left, int right)
{
    if (left < right)
    {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);   /* merges two sorted halves */
    }
}
```

Built-in `qsort` alternative:
```c
#include <stdlib.h>
int cmp_int(const void *a, const void *b) { return *(int *)a - *(int *)b; }
qsort(arr, n, sizeof(int), cmp_int);
```

## Searching

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Linear search | O(1) | O(n) | O(n) | O(1) |
| Binary search | O(1) | O(log n) | O(log n) | O(1) |

> Binary search requires a sorted array. Prefer `left + (right - left) / 2`
> over `(left + right) / 2` to avoid integer overflow.

Binary search (see `Searching/binary_search.c`):
```c
int binary_search(int arr[], int n, int target)
{
    int left = 0, right = n - 1;
    while (left <= right)
    {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

## Graph Algorithms

| Algorithm | Complexity | Notes |
|---|---|---|
| BFS | O(V + E) | Level-order traversal, uses a queue |
| DFS | O(V + E) | Uses recursion or an explicit stack |

> The `Graph/bfs.c` implementation uses an adjacency matrix, giving O(V^2).
> An adjacency list (see `Data-Structures/Graph/graph_adjacency_list.c`)
> runs in O(V + E) for sparse graphs.

BFS (see `Graph/bfs.c`):
```c
void bfs(int graph[MAX][MAX], int start, int n)
{
    bool *visited = calloc(n, sizeof(bool));
    int *queue = malloc(n * sizeof(int));
    int front = 0, rear = 0;
    visited[start] = true;
    queue[rear++] = start;
    while (front < rear)
    {
        int u = queue[front++];
        for (int v = 0; v < n; v++)
            if (graph[u][v] && !visited[v])
            {
                visited[v] = true;
                queue[rear++] = v;
            }
    }
    free(visited);
    free(queue);
}
```

DFS on adjacency list (see `Data-Structures/Graph/graph_adjacency_list.c`):
```c
void dfs_util(Graph *g, int v, bool visited[])
{
    visited[v] = true;
    for (AdjNode *cur = g->adj_lists[v]; cur; cur = cur->next)
        if (!visited[cur->v]) dfs_util(g, cur->v, visited);
}
```

## Dynamic Programming

| Problem | Approach | Time | Space |
|---|---|---|---|
| Fibonacci | Bottom-up (iterative) | O(n) | O(1) |
| Knapsack | Bottom-up table | O(n * W) | O(W) |
| LCS | 2D DP table | O(n * m) | O(n * m) |

Fibonacci bottom-up (see `DynamicProgramming/fibonacci.c`):
```c
int fibonacci(int n)
{
    if (n <= 1) return n;
    int a = 0, b = 1, c;
    for (int i = 2; i <= n; i++)
    {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```

## String Algorithms

| Algorithm | Time | Space |
|---|---|---|
| Palindrome (two pointers) | O(n) | O(1) |
| KMP substring search | O(n + m) | O(m) |
| Rabin-Karp rolling hash | O(n + m) avg | O(1) |

Palindrome check (see `String/palindrome.c`):
```c
bool is_palindrome(char str[])
{
    int left = 0, right = strlen(str) - 1;
    while (left < right)
        if (str[left++] != str[right--])
            return false;
    return true;
}
```

## Templates / Snippets

### Two pointers (see `Array/two_sum.c`, `String/palindrome.c`)
```c
int left = 0, right = n - 1;
while (left < right)
{
    if (condition) { /* handle match */ }
    left++;
    right--;
}
```

### Sliding window (fixed size k)
```c
int window_sum(int arr[], int n, int k)
{
    int sum = 0;
    for (int i = 0; i < k; i++) sum += arr[i];
    int best = sum;
    for (int i = k; i < n; i++)
    {
        sum += arr[i] - arr[i - k];   /* slide the window */
        if (sum > best) best = sum;
    }
    return best;
}
```

### Pair sum (see `Array/two_sum.c`)
```c
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) { /* found indices */ }
```

### Recursion template (see `Recursion/tower_of_hanoi.c`)
```c
void solve(int n, char from, char to, char aux)
{
    if (n == 0) return;
    solve(n - 1, from, aux, to);
    printf("%c -> %c\n", from, to);
    solve(n - 1, aux, to, from);
}
```

### Interval merge (see `Intervals/merge_intervals.c`)
```c
/* sort intervals by start, then walk and extend while overlapping */
```

## Real-World Use

- Sorting: stable record ordering, deduplication, database ORDER BY.
- Binary search: dictionary lookup, bisection debugging, sorted indexes.
- BFS: shortest path in unweighted graphs, peer-to-peer discovery.
- DP (Fibonacci): combinatorics and sequence problems, memoization pattern.
- Palindrome: string validation, mirror detection in text/audio data.
- Merge intervals: schedule consolidation, room booking, overlap queries.

## Pitfalls

- C strings are `char[]`; always track size or keep the `\0` terminator.
- Every `malloc`/`calloc` needs a matching `free` to avoid leaks.
- `(left + right) / 2` can overflow; use `left + (right - left) / 2`.
- BFS on an adjacency matrix is O(V^2); switch to adjacency lists for sparse graphs.
- `qsort` comparators return negative/zero/positive, not a boolean.
- Off-by-one on `while (left <= right)` versus `while (left < right)`.
- `sizeof(arr)/sizeof(arr[0])` works on arrays, not on function parameters.
