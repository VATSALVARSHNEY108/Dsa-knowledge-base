---
layout: default
title: Algorithms Cheatsheet
parent: C++
nav_order: 1
---

# C++ Algorithms Cheatsheet

> Quick reference for the algorithm implementations in `C++/Algorithms/`.
> Each entry links to the matching `.cpp` file in this folder.

## Available Implementations

| Topic | File | Problem |
|---|---|---|
| Array | `Array/two_sum.cpp` | Two Sum (brute force) |
| Dynamic Programming | `DynamicProgramming/fibonacci.cpp` | Fibonacci (bottom-up DP) |
| Graph | `Graph/bfs.cpp` | BFS traversal |
| Intervals | `Intervals/merge_intervals.cpp` | Merge overlapping intervals |
| Recursion | `Recursion/tower_of_hanoi.cpp` | Tower of Hanoi |
| Searching | `Searching/binary_search.cpp` | Binary search on sorted array |
| Sorting | `Sorting/merge_sort.cpp` | Merge sort |
| String | `String/palindrome.cpp` | Palindrome check |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

> `std::sort` is introsort (O(n log n) worst case); `std::stable_sort` preserves
> order of equal elements. See `Sorting/merge_sort.cpp` for a manual merge sort.

Merge sort core (see `Sorting/merge_sort.cpp`):
```cpp
void merge_sort(vector<int>& arr, int left, int right)
{
    if (left < right)
    {
        int mid = left + (right - left) / 2;
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        merge(arr, left, mid, right);   // merges the two sorted halves
    }
}
```

STL one-liners:
```cpp
#include <algorithm>
sort(arr.begin(), arr.end());                     // ascending (introsort)
sort(arr.begin(), arr.end(), greater<int>());     // descending
stable_sort(arr.begin(), arr.end());              // stable O(n log n)
```

## Searching

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Linear search | O(1) | O(n) | O(n) | O(1) |
| Binary search | O(1) | O(log n) | O(log n) | O(1) |

> Requires a sorted range. Prefer `left + (right - left) / 2` to avoid overflow.

Binary search (see `Searching/binary_search.cpp`):
```cpp
int binary_search(const vector<int>& arr, int target)
{
    int left = 0, right = (int)arr.size() - 1;
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

STL alternatives: `binary_search`, `lower_bound`, `upper_bound`.

## Graph Algorithms

| Algorithm | Complexity | Notes |
|---|---|---|
| BFS | O(V + E) | Level-order, uses `std::queue` |
| DFS | O(V + E) | Recursion or `std::stack` |

BFS on an adjacency list (see `Graph/bfs.cpp`):
```cpp
void bfs(const vector<vector<int>>& graph, int start)
{
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty())
    {
        int u = q.front();
        q.pop();
        for (int v : graph[u])
            if (!visited[v])
            {
                visited[v] = true;
                q.push(v);
            }
    }
}
```

## Dynamic Programming

| Problem | Approach | Time | Space |
|---|---|---|---|
| Fibonacci | Bottom-up (iterative) | O(n) | O(1) |
| Knapsack | Bottom-up table | O(n * W) | O(W) |
| LCS | 2D DP table | O(n * m) | O(n * m) |

Fibonacci bottom-up (see `DynamicProgramming/fibonacci.cpp`):
```cpp
int fibonacci(int n)
{
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++)
    {
        int c = a + b;
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

Palindrome check (see `String/palindrome.cpp`):
```cpp
bool is_palindrome(const string& s)
{
    int left = 0, right = (int)s.size() - 1;
    while (left < right)
        if (s[left++] != s[right--])
            return false;
    return true;
}
```

## Templates / Snippets

### Two pointers (see `Array/two_sum.cpp`)
```cpp
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) { /* found */ }
```

### Sliding window (fixed size k)
```cpp
int window_sum(const vector<int>& arr, int k)
{
    int sum = accumulate(arr.begin(), arr.begin() + k, 0);
    int best = sum;
    for (int i = k; i < (int)arr.size(); i++)
    {
        sum += arr[i] - arr[i - k];
        best = max(best, sum);
    }
    return best;
}
```

### Interval merge (see `Intervals/merge_intervals.cpp`)
```cpp
sort(iv.begin(), iv.end());               // by start by default
for (auto& in : iv)
{
    if (res.empty() || in.first > res.back().second)
        res.push_back(in);
    else
        res.back().second = max(res.back().second, in.second);
}
```

### Recursion template (see `Recursion/tower_of_hanoi.cpp`)
```cpp
void solve(int n, char from, char to, char aux)
{
    if (n == 0) return;
    solve(n - 1, from, aux, to);
    cout << from << " -> " << to << "\n";
    solve(n - 1, aux, to, from);
}
```

## Real-World Use

- Sorting: ranking, deduplication, merge pipeline inputs.
- Binary search: exact lookup in sorted containers, geometric search.
- BFS: shortest path in unweighted graphs, network flooding.
- DP (Fibonacci): combinatorics, route counting, memoized recursion.
- Palindrome: validation, pattern checks, natural-language tasks.
- Merge intervals: calendar merging, resource allocation, overlapping ranges.

## Pitfalls

- `std::sort` on a range requires random-access iterators (works on vector).
- Comparing iterators from different containers is undefined behavior.
- `binary_search` on unsorted data gives garbage results - sort first.
- Mixing signed/unsigned (`arr.size()` returns `size_t`) causes wrap bugs.
- Recursion depth equals tree/hanoi height; deep cases overflow the stack.
- `using namespace std;` is convenient but pollutes the global namespace.
- Merging uses O(n) auxiliary space; don't merge in place without a temp.
