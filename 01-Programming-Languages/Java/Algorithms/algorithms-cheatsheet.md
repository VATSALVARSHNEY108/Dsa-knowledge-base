---
layout: default
title: Algorithms Cheatsheet
parent: Java
nav_order: 1
---

# Java Algorithms Cheatsheet

> Quick reference for the algorithm implementations in `Java/Algorithms/`.
> Each entry links to the matching `.java` file in this folder.

## Available Implementations

| Topic | File | Problem |
|---|---|---|
| Array | `Array/TwoSum.java` | Two Sum (brute force) |
| Dynamic Programming | `DynamicProgramming/Fibonacci.java` | Fibonacci (bottom-up DP) |
| Graph | `Graph/BFS.java` | BFS traversal |
| Intervals | `Intervals/MergeIntervals.java` | Merge overlapping intervals |
| Recursion | `Recursion/TowerOfHanoi.java` | Tower of Hanoi |
| Searching | `Searching/BinarySearch.java` | Binary search on sorted array |
| Sorting | `Sorting/MergeSort.java` | Merge sort |
| String | `String/Palindrome.java` | Palindrome check (two pointers) |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

> `Arrays.sort` uses dual-pivot quicksort for primitives and TimSort for objects
> (stable). See `Sorting/MergeSort.java` for a manual stable implementation.

Merge sort core (see `Sorting/MergeSort.java`):
```java
void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
```

Built-in alternatives:
```java
Arrays.sort(arr);                        // primitives: dual-pivot quicksort
Arrays.sort(arr, Collections.reverseOrder()); // objects, descending
Collections.sort(list);                  // List of Comparable
```

## Searching

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Linear search | O(1) | O(n) | O(n) | O(1) |
| Binary search | O(1) | O(log n) | O(log n) | O(1) |

> Requires a sorted array. `Arrays.binarySearch` returns the index, or
> `-(insertion point) - 1` when not found.

Binary search (see `Searching/BinarySearch.java`):
```java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
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
| BFS | O(V + E) | Level-order, uses a `Queue` |
| DFS | O(V + E) | Recursion or an explicit `Deque` |

BFS on an adjacency map (see `Graph/BFS.java`):
```java
List<Integer> bfs(Map<Integer, List<Integer>> graph, int start) {
    List<Integer> result = new ArrayList<>();
    Queue<Integer> queue = new LinkedList<>();
    Set<Integer> visited = new HashSet<>();
    queue.offer(start);
    visited.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        result.add(node);
        for (int n : graph.getOrDefault(node, Collections.emptyList()))
            if (visited.add(n)) queue.offer(n);
    }
    return result;
}
```

## Dynamic Programming

| Problem | Approach | Time | Space |
|---|---|---|---|
| Fibonacci | Bottom-up (iterative) | O(n) | O(1) |
| Knapsack | Bottom-up table | O(n * W) | O(W) |
| LCS | 2D DP table | O(n * m) | O(n * m) |

Fibonacci bottom-up (see `DynamicProgramming/Fibonacci.java`):
```java
int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
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

Palindrome check (see `String/Palindrome.java`):
```java
boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right)
        if (s.charAt(left++) != s.charAt(right--))
            return false;
    return true;
}
```

## Templates / Snippets

### Two pointers (see `Array/TwoSum.java`)
```java
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) { /* found */ }
```

### Sliding window (fixed size k)
```java
int windowSum(int[] arr, int k) {
    int sum = 0;
    for (int i = 0; i < k; i++) sum += arr[i];
    int best = sum;
    for (int i = k; i < arr.length; i++) {
        sum += arr[i] - arr[i - k];
        best = Math.max(best, sum);
    }
    return best;
}
```

### Interval merge (see `Intervals/MergeIntervals.java`)
```java
Arrays.sort(iv, Comparator.comparingInt(a -> a[0]));
// then extend the last interval while the next start overlaps
```

### Recursion template (see `Recursion/TowerOfHanoi.java`)
```java
void solve(int n, char from, char to, char aux) {
    if (n == 0) return;
    solve(n - 1, from, aux, to);
    System.out.println(from + " -> " + to);
    solve(n - 1, aux, to, from);
}
```

## Real-World Use

- Sorting: rankings, deduplication, database-style ordering.
- Binary search: exact lookup in sorted data, version-controlled indexes.
- BFS: shortest path in unweighted graphs, dependency resolution.
- DP (Fibonacci): combinatorics, path counting, memoized recursion.
- Palindrome: input validation, string normalization checks.
- Merge intervals: schedule consolidation, resource scheduling.

## Pitfalls

- `Arrays.sort` on a `List` requires boxed types; primitives need `int[]`.
- `Arrays.binarySearch` negative return means "not found" - decode it carefully.
- Integer overflow with `(left + right) / 2`; use `left + (right - left) / 2`.
- Recursion depth equals tree/hanoi height; deep cases overflow the stack.
- `charAt` returns a UTF-16 code unit, not a full Unicode code point.
- Strings are immutable; building them with `+=` in a loop is O(n^2).
- `Arrays.sort` is not stable for primitives; use `Collections.sort` or
  `Integer[]` when stability matters.
