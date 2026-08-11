---
layout: default
title: Algorithms Cheatsheet
parent: Dart
nav_order: 1
---

# Dart Algorithms Cheatsheet

> Quick reference for the algorithm implementations in `Dart/Algorithms/`.
> Each entry links to the matching `.dart` file in this folder.

## Available Implementations

| Topic | File | Problem |
|---|---|---|
| Array | `Array/two_sum.dart` | Two Sum (brute force) |
| Dynamic Programming | `DynamicProgramming/fibonacci.dart` | Fibonacci (bottom-up DP) |
| Graph | `Graph/bfs.dart` | BFS on adjacency list |
| Intervals | `Intervals/merge_intervals.dart` | Merge overlapping intervals |
| Recursion | `Recursion/tower_of_hanoi.dart` | Tower of Hanoi |
| Searching | `Searching/binary_search.dart` | Binary search on sorted array |
| Sorting | `Sorting/merge_sort.dart` | Merge sort |
| String | `String/palindrome.dart` | Palindrome check (two pointers) |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

> `List.sort()` uses insertion sort for small lists and dual-pivot quicksort
> otherwise. See `Sorting/merge_sort.dart` for a stable manual implementation.

Merge sort core (see `Sorting/merge_sort.dart`):
```dart
void mergeSort(List<int> arr, int left, int right) {
  if (left >= right) return;
  int mid = left + (right - left) ~/ 2;
  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}
```

Built-in alternative:
```dart
final list = [38, 27, 43, 3, 9, 82, 10];
list.sort();                       // ascending (in place)
list.sort((a, b) => b.compareTo(a));  // descending
```

## Searching

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Linear search | O(1) | O(n) | O(n) | O(1) |
| Binary search | O(1) | O(log n) | O(log n) | O(1) |

> Requires a sorted list. Use `left + (right - left) ~/ 2` to avoid overflow.

Binary search (see `Searching/binary_search.dart`):
```dart
int binarySearch(List<int> arr, int target) {
  int left = 0, right = arr.length - 1;
  while (left <= right) {
    int mid = left + (right - left) ~/ 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
```

## Graph Algorithms

| Algorithm | Complexity | Notes |
|---|---|---|
| BFS | O(V + E) | Level-order, uses a queue |
| DFS | O(V + E) | Recursion or an explicit stack |

BFS on an adjacency list (see `Graph/bfs.dart`):
```dart
void bfs(Map<int, List<int>> graph, int start) {
  Set<int> visited = {};
  List<int> queue = [start];
  visited.add(start);
  while (queue.isNotEmpty) {
    int node = queue.removeAt(0);
    print(node);
    for (int neighbor in (graph[node] ?? [])) {
      if (!visited.contains(neighbor)) {
        visited.add(neighbor);
        queue.add(neighbor);
      }
    }
  }
}
```

> Note: `removeAt(0)` is O(n). Use `dart:collection` `Queue` for O(1) front
> removal in production code.

## Dynamic Programming

| Problem | Approach | Time | Space |
|---|---|---|---|
| Fibonacci | Bottom-up (iterative) | O(n) | O(1) |
| Knapsack | Bottom-up table | O(n * W) | O(W) |
| LCS | 2D DP table | O(n * m) | O(n * m) |

Fibonacci bottom-up (see `DynamicProgramming/fibonacci.dart`):
```dart
int fibonacci(int n) {
  if (n <= 1) return n;
  int a = 0, b = 1;
  for (int i = 2; i <= n; i++) {
    final c = a + b;
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

Palindrome check (see `String/palindrome.dart`):
```dart
bool isPalindrome(String s) {
  int left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] != s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

## Templates / Snippets

### Two pointers (see `Array/two_sum.dart`)
```dart
for (int i = 0; i < n; i++) {
  for (int j = i + 1; j < n; j++) {
    if (nums[i] + nums[j] == target) { /* found */ }
  }
}
```

### Sliding window (fixed size k)
```dart
int windowSum(List<int> arr, int k) {
  int sum = arr.take(k).fold(0, (a, b) => a + b);
  int best = sum;
  for (int i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    if (sum > best) best = sum;
  }
  return best;
}
```

### Interval merge (see `Intervals/merge_intervals.dart`)
```dart
iv.sort((a, b) => a.start.compareTo(b.start));
// then extend the last interval while the next start overlaps
```

### Recursion template (see `Recursion/tower_of_hanoi.dart`)
```dart
void solve(int n, String from, String to, String aux) {
  if (n == 0) return;
  solve(n - 1, from, aux, to);
  print('$from -> $to');
  solve(n - 1, aux, to, from);
}
```

## Real-World Use

- Sorting: leaderboards, list views, data cleaning.
- Binary search: exact lookup in sorted data, index-backed search.
- BFS: shortest path in unweighted graphs, dependency resolution.
- DP (Fibonacci): combinatorics, path counting, memoized recursion.
- Palindrome: input validation, string normalization checks.
- Merge intervals: schedule consolidation, resource scheduling.

## Pitfalls

- `~/` integer division is mandatory in Dart (plain `/` returns double).
- `removeAt(0)` on a `List` is O(n); use a `Queue` for true FIFO.
- Strings index with `s[i]` (no `s.charAt`); beware Unicode surrogate pairs.
- Dart strings are immutable; building big strings with `+=` is O(n^2).
- Recursion depth is limited; deep cases should use an explicit stack.
- `List.sort` is not guaranteed stable; use `sort((a, b) => ...)` with care.
- Ranges use `left + (right - left) ~/ 2` to avoid overflow on large arrays.
