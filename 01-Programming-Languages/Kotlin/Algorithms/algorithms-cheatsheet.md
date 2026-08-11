---
layout: default
title: Algorithms Cheatsheet
parent: Kotlin
nav_order: 1
---

# Kotlin Algorithms Cheatsheet

Quick-reference for the algorithm implementations in this folder. Each entry maps to a
file under `Algorithms/`. Snippets compile and run with Kotlin/JVM (`kotlinc` + `kotlin`).

## Available Files

| Category | File | Problem |
| --- | --- | --- |
| Array | `two_sum.kt` | Find two indices that sum to a target |
| Dynamic Programming | `fibonacci.kt` | Compute the nth Fibonacci number |
| Graph | `bfs.kt` | Breadth-first graph traversal |
| Intervals | `merge_intervals.kt` | Merge overlapping intervals |
| Recursion | `tower_of_hanoi.kt` | Move disks between pegs |
| Searching | `binary_search.kt` | Find target in a sorted array |
| Sorting | `merge_sort.kt` | Merge sort (divide and conquer) |
| String | `palindrome.kt` | Palindrome check |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

```kotlin
fun mergeSort(arr: IntArray, left: Int, right: Int) {
    if (left < right) {
        val mid = left + (right - left) / 2
        mergeSort(arr, left, mid)
        mergeSort(arr, mid + 1, right)
        merge(arr, left, mid, right)
    }
}
private fun merge(arr: IntArray, left: Int, mid: Int, right: Int) {
    val L = arr.copyOfRange(left, left + (mid - left + 1))
    val R = arr.copyOfRange(mid + 1, mid + 1 + (right - mid))
    var i = 0; var j = 0; var k = left
    while (i < L.size && j < R.size) {
        arr[k++] = if (L[i] <= R[j]) L[i++] else R[j++]
    }
    while (i < L.size) arr[k++] = L[i++]
    while (j < R.size) arr[k++] = R[j++]
}
```

> Built-in: `sorted()`, `sortedDescending()`, `sortedBy {}` (stable, O(n log n)) and the
> in-place `IntArray.sort()` / `sortBy {}`.

## Searching

| Algorithm | Time | Space | Precondition |
| --- | --- | --- | --- |
| Binary Search | O(log n) | O(1) | Sorted array |

```kotlin
fun binarySearch(arr: IntArray, target: Int): Int {
    var left = 0; var right = arr.size - 1
    while (left <= right) {
        val mid = left + (right - left) / 2
        when {
            arr[mid] == target -> return mid
            arr[mid] < target -> left = mid + 1
            else -> right = mid - 1
        }
    }
    return -1
}
```

> Built-in: `java.util.Arrays.binarySearch(arr, target)` and the extension
> `list.binarySearch(target)` (returns negative insertion index when absent).

## Graph Algorithms

| Algorithm | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS (queue) | O(V + E) | O(V) | Shortest path in unweighted graphs |
| DFS (stack/recursion) | O(V + E) | O(V) | Track `visited` to avoid cycles |

```kotlin
fun bfs(graph: Map<Int, List<Int>>, start: Int): List<Int> {
    val result = mutableListOf<Int>()
    val queue: Queue<Int> = LinkedList()
    val visited = mutableSetOf<Int>()
    queue.offer(start)
    visited.add(start)
    while (queue.isNotEmpty()) {
        val node = queue.poll()
        result.add(node)
        for (neighbor in graph[node].orEmpty()) {
            if (neighbor !in visited) {
                visited.add(neighbor)
                queue.offer(neighbor)
            }
        }
    }
    return result
}
```

> Prefer `java.util.ArrayDeque` or `LinkedList` as the BFS queue; JVM collections are
> imported via `import java.util.*`.

## Dynamic Programming

| Problem | File | Time | Space |
| --- | --- | --- | --- |
| Fibonacci (bottom-up) | `fibonacci.kt` | O(n) | O(n) |

```kotlin
fun fib(n: Int): Int {
    if (n <= 1) return n
    val dp = IntArray(n + 1)
    dp[0] = 0; dp[1] = 1
    for (i in 2..n) dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
}
```

> Space can be reduced to O(1) by tracking only the last two values instead of a full
> `IntArray`.

## String Algorithms

| Algorithm | Time | Space | File |
| --- | --- | --- | --- |
| Two-pointer palindrome | O(n) | O(1) | `palindrome.kt` |

```kotlin
fun isPalindrome(s: String): Boolean {
    var left = 0; var right = s.length - 1
    while (left < right) {
        if (s[left] != s[right]) return false
        left++; right--
    }
    return true
}
```

## Templates / Snippets

### Two Sum (hash map)
```kotlin
fun twoSum(nums: IntArray, target: Int): IntArray {
    val map = mutableMapOf<Int, Int>()
    for ((i, num) in nums.withIndex()) {
        val complement = target - num
        if (complement in map) return intArrayOf(map[complement]!!, i)
        map[num] = i
    }
    return intArrayOf(-1, -1)
}
```

### Merge Intervals
```kotlin
fun merge(intervals: Array<IntArray>): Array<IntArray> {
    if (intervals.isEmpty()) return emptyArray()
    intervals.sortBy { it[0] }
    val merged = mutableListOf<IntArray>()
    var current = intervals[0]
    for (i in 1 until intervals.size) {
        if (intervals[i][0] <= current[1]) {
            current[1] = maxOf(current[1], intervals[i][1])
        } else {
            merged.add(current)
            current = intervals[i]
        }
    }
    merged.add(current)
    return merged.toTypedArray()
}
```

### Tower of Hanoi (recursion)
```kotlin
fun solve(n: Int, from: Char, to: Char, aux: Char) {
    if (n == 1) {
        println("Move disk 1 from $from to $to")
        return
    }
    solve(n - 1, from, aux, to)
    println("Move disk $n from $from to $to")
    solve(n - 1, aux, to, from)
}
```

### Memoized Fibonacci (top-down)
```kotlin
val memo = mutableMapOf<Int, Long>()
fun fibMemo(n: Int): Long = when {
    n <= 1 -> n.toLong()
    n in memo -> memo[n]!!
    else -> {
        memo[n] = fibMemo(n - 1) + fibMemo(n - 2)
        memo[n]!!
    }
}
```

## Real-World Use

- **Merge sort**: stable sorting of linked lists, large files, external sorts.
- **Binary search**: database indexes, API range queries, gamelog timestamp lookups.
- **BFS**: shortest path in unweighted graphs, crawl scheduling, puzzle solving.
- **Two sum pattern**: caching, complement-based lookups, stream deduplication.
- **Merge intervals**: meeting schedules, resource-occupancy timelines, IP consolidation.
- **DP Fibonacci**: financial compounding, path counting, optimization scaffolds.
- **Palindrome**: plagiarism detection seeds, bioinformatics motif checks.

## Pitfalls

- Kotlin `IntArray` is a primitive array; `toList()` / `sorted()` produce boxed lists.
- `n in memo` on a `MutableMap` is fine, but `map[complement]!!` throws on missing key —
  check with `containsKey` first.
- `while (left <= right)` vs `<` off-by-one errors in binary search.
- `sortBy { it[0] }` is stable; `sortedWith(compareBy { it[0] })` gives explicit control.
- Recursion depth is bounded by the JVM stack; prefer iterative for very deep trees.
- `ArrayDeque` in Kotlin 1.4+ behaves like a stack (push/pop) — it is a deque, so order
  of operations must be verified against `Stack` semantics.
- `maxOf`, `minOf`, and `orEmpty()` are Kotlin stdlib; ensure imports are correct.
- Integer overflow: Fibonacci grows fast — use `Long` for n > 46.
