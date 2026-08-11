---
layout: default
title: Algorithms Cheatsheet
parent: Swift
nav_order: 1
---

# Swift Algorithms Cheatsheet

Quick-reference for common algorithms implemented in Swift. Companion code
lives in `Swift/Algorithms/` under `Array/`, `Sorting/`, `Searching/`,
`Graph/`, `DynamicProgramming/`, `Recursion/`, `Intervals/`, and `String/`.

> Swift has strong built-in collection support (`sorted`, `firstIndex`,
> `contains`, `reduce`, dictionaries). Prefer stdlib methods for clarity;
> write explicit loops or custom implementations when you must show the
> algorithm or need specific performance.

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --------- | ---- | ------- | ----- | ----- | ------ |
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |

Available in repo: `Sorting/merge_sort.swift`. Swift's stdlib `sorted()`
uses introsort (unstable) and `sort()` mutates in place.

```swift
let xs = [38, 27, 43, 3, 9, 82, 10]
xs.sorted()                     // new array, ascending
xs.sorted(by: >)                // descending
xs.sorted { $0.name < $1.name } // key-based
var mutable = xs; mutable.sort() // in place
```

### Merge Sort

```swift
func mergeSort(_ arr: [Int]) -> [Int] {
    guard arr.count > 1 else { return arr }
    let mid = arr.count / 2
    return merge(mergeSort(Array(arr[..<mid])),
                 mergeSort(Array(arr[mid...])))
}

func merge(_ left: [Int], _ right: [Int]) -> [Int] {
    var (i, j) = (0, 0)
    var out: [Int] = []
    out.reserveCapacity(left.count + right.count)
    while i < left.count && j < right.count {
        if left[i] <= right[j] { out.append(left[i]); i += 1 }
        else { out.append(right[j]); j += 1 }
    }
    out += left[i...]
    out += right[j...]
    return out
}
```

> Slices (`arr[..<mid]`) are views, not copies — wrap in `Array(...)` if
> you need an owned value.

## Searching

Available in repo: `Searching/binary_search.swift`.

| Search | Complexity | Swift built-in |
| ------ | ---------- | -------------- |
| Linear | O(n) | `firstIndex(of:)` |
| Binary (sorted) | O(log n) | `binarySearch` (custom) |

### Binary Search (iterative)

```swift
func binarySearch(_ arr: [Int], _ target: Int) -> Int {
    var lo = 0
    var hi = arr.count - 1
    while lo <= hi {
        let mid = lo + (hi - lo) / 2
        if arr[mid] == target { return mid }
        else if arr[mid] < target { lo = mid + 1 }
        else { hi = mid - 1 }
    }
    return -1
}
```

> There is no stdlib `binarySearch` on `Array`; write it yourself or use
> `firstIndex(where:)` for a linear fallback.

## Graph Algorithms

Available in repo: `Graph/bfs.swift`.

| Algorithm | Complexity | Use |
| --------- | ---------- | --- |
| BFS | O(V + E) | Shortest path (unweighted), level order |
| DFS | O(V + E) | Connectivity, cycles, topological order |
| Dijkstra | O((V + E) log V) | Shortest path (non-negative weights) |
| Topological sort | O(V + E) | DAG ordering |

### BFS

```swift
func bfs(graph: [[Int]], start: Int) -> [Int] {
    var visited = [Bool](repeating: false, count: graph.count)
    var queue = [start]
    var result: [Int] = []
    visited[start] = true
    var head = 0
    while head < queue.count {
        let node = queue[head]
        head += 1
        result.append(node)
        for nb in graph[node] where !visited[nb] {
            visited[nb] = true
            queue.append(nb)
        }
    }
    return result
}
```

> `Array.removeFirst()` is O(n); the `head` index trick keeps BFS O(V + E).

## Dynamic Programming

Available in repo: `DynamicProgramming/fibonacci.swift`.

| Pattern | Example | Complexity |
| ------- | ------- | ---------- |
| Memoization (top-down) | Fibonacci | O(n) time, O(n) space |
| Tabulation (bottom-up) | Fibonacci | O(n) time, O(1) space |

### Fibonacci (memoized)

```swift
var memo: [Int: Int] = [:]

func fib(_ n: Int) -> Int {
    if n < 2 { return n }
    if let cached = memo[n] { return cached }
    let value = fib(n - 1) + fib(n - 2)
    memo[n] = value
    return value
}
```

### Fibonacci (iterative)

```swift
func fib(_ n: Int) -> Int {
    var a = 0
    var b = 1
    guard n > 0 else { return a }
    for _ in 0..<(n - 1) { (a, b) = (b, a + b) }
    return b
}
```

## String Algorithms

Available in repo: `String/palindrome.swift`.

| Technique | Complexity | Swift built-in |
| --------- | ---------- | ------------- |
| Palindrome check | O(n) | `s == String(s.reversed())` |
| Anagram check | O(n) | sorted chars / dictionary counts |
| Substring search | O(n * m) | `contains`, `range(of:)` |

### Palindrome

```swift
func isPalindrome(_ s: String) -> Bool {
    let chars = Array(s)
    var i = 0
    var j = chars.count - 1
    while i < j {
        if chars[i] != chars[j] { return false }
        i += 1
        j -= 1
    }
    return true
}
```

> `String` indices are not integers — convert to `Array(s)` for index
> arithmetic, or use `s.index(s.startIndex, offsetBy: i)`.

## Templates / Snippets

Reusable building blocks.

```swift
// Two-sum style: value -> index map
func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
    var seen: [Int: Int] = [:]
    for (i, num) in nums.enumerated() {
        if let j = seen[target - num] { return [j, i] }
        seen[num] = i
    }
    return []
}
```

```swift
// Frequency counter
var freq: [Int: Int] = [:]
for x in arr { freq[x, default: 0] += 1 }
```

```swift
// Sliding window: max sum of a fixed-size window
func maxSumWindow(_ arr: [Int], _ k: Int) -> Int {
    guard arr.count >= k else { return 0 }
    var window = arr[..<k].reduce(0, +)
    var maxSum = window
    for i in k..<arr.count {
        window += arr[i] - arr[i - k]
        maxSum = max(maxSum, window)
    }
    return maxSum
}
```

> Tower of Hanoi is in `Recursion/tower_of_hanoi.swift`.

## Real-World Use

- **Merge sort**: stable sorting for linked lists and external sorts;
  Foundation's `sorted()` covers most needs.
- **BFS**: unweighted shortest path — route planning, social graphs,
  word-ladder puzzles.
- **Binary search**: sorted-data lookups, nearest-value queries,
  time-series range queries.
- **Memoized DP**: counting/path problems, knapsack variants, sequence
  generation.

## Pitfalls

- `sorted()` returns a new array; `sort()` mutates. Forgetting the
  result of `sorted()` silently does nothing.
- `(lo + hi) / 2` can overflow for huge indices; prefer `lo + (hi - lo) / 2`.
- `removeFirst()` on arrays is O(n); use an index pointer or `Queue`
  (Foundation) for queue workloads.
- `String` is not `RandomAccessCollection`-indexed by integer; use
  `Array(s)` or string index math.
- `reversed()` returns a `ReversedCollection`, not an array; wrap with
  `String(...)` when comparing to a string.
- Optional semantics: `dict[key]` returns `nil` for missing keys; use
  `dict[key, default: 0]` or `??` carefully.
