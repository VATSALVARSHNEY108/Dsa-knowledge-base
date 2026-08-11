---
layout: default
title: Algorithms Cheatsheet
parent: Go
nav_order: 1
---

# Go Algorithms Cheatsheet

> Quick reference for the algorithm implementations in `Go/Algorithms/`.
> Each entry links to the matching `.go` file in this folder.

## Available Implementations

| Topic | File | Problem |
|---|---|---|
| Array | `Array/two_sum.go` | Two Sum (brute force) |
| Dynamic Programming | `DynamicProgramming/fibonacci.go` | Fibonacci (bottom-up DP) |
| Graph | `Graph/bfs.go` | BFS traversal |
| Intervals | `Intervals/merge_intervals.go` | Merge overlapping intervals |
| Recursion | `Recursion/tower_of_hanoi.go` | Tower of Hanoi |
| Searching | `Searching/binary_search.go` | Binary search on sorted array |
| Sorting | `Sorting/merge_sort.go` | Merge sort |
| String | `String/palindrome.go` | Palindrome check |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

> `sort.Slice` uses pattern-defeating quicksort (O(n log n)). See
> `Sorting/merge_sort.go` for a stable manual merge sort.

Merge sort core (see `Sorting/merge_sort.go`):
```go
func mergeSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}
	mid := len(arr) / 2
	left := mergeSort(arr[:mid])
	right := mergeSort(arr[mid:])
	return merge(left, right)
}
```

Standard library alternative:
```go
sort.Ints(nums)                              // ascending
sort.Slice(nums, func(i, j int) bool {
	return nums[i] > nums[j]                 // descending
})
slices.Sort(nums)                            // Go 1.21+, from "slices"
```

## Searching

| Algorithm | Best | Average | Worst | Space |
|---|---|---|---|---|
| Linear search | O(1) | O(n) | O(n) | O(1) |
| Binary search | O(1) | O(log n) | O(log n) | O(1) |

> Requires a sorted slice. `slices.BinarySearch` (Go 1.21+) is built in.

Binary search (see `Searching/binary_search.go`):
```go
func binarySearch(arr []int, target int) int {
	left, right := 0, len(arr)-1
	for left <= right {
		mid := left + (right-left)/2
		if arr[mid] == target {
			return mid
		}
		if arr[mid] < target {
			left = mid + 1
		} else {
			right = mid - 1
		}
	}
	return -1
}
```

## Graph Algorithms

| Algorithm | Complexity | Notes |
|---|---|---|
| BFS | O(V + E) | Level-order, uses a slice as queue |
| DFS | O(V + E) | Recursion or an explicit stack |

BFS on an adjacency list (see `Graph/bfs.go`):
```go
func bfs(graph map[int][]int, start int) {
	visited := map[int]bool{start: true}
	queue := []int{start}
	for len(queue) > 0 {
		node := queue[0]
		queue = queue[1:]
		for _, neighbor := range graph[node] {
			if !visited[neighbor] {
				visited[neighbor] = true
				queue = append(queue, neighbor)
			}
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

Fibonacci bottom-up (see `DynamicProgramming/fibonacci.go`):
```go
func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	a, b := 0, 1
	for i := 2; i <= n; i++ {
		a, b = b, a+b
	}
	return b
}
```

## String Algorithms

| Algorithm | Time | Space |
|---|---|---|
| Palindrome (two pointers) | O(n) | O(1) |
| KMP substring search | O(n + m) | O(m) |
| Rabin-Karp rolling hash | O(n + m) avg | O(1) |

Palindrome check (see `String/palindrome.go`):
```go
func isPalindrome(s string) bool {
	i, j := 0, len(s)-1
	for i < j {
		if s[i] != s[j] {
			return false
		}
		i++
		j--
	}
	return true
}
```

## Templates / Snippets

### Two pointers (see `Array/two_sum.go`)
```go
for i := 0; i < n; i++ {
	for j := i + 1; j < n; j++ {
		if nums[i]+nums[j] == target {
			// found
		}
	}
}
```

### Sliding window (fixed size k)
```go
func windowSum(arr []int, k int) int {
	sum := 0
	for i := 0; i < k; i++ {
		sum += arr[i]
	}
	best := sum
	for i := k; i < len(arr); i++ {
		sum += arr[i] - arr[i-k]
		if sum > best {
			best = sum
		}
	}
	return best
}
```

### Interval merge (see `Intervals/merge_intervals.go`)
```go
sort.Slice(iv, func(i, j int) bool { return iv[i][0] < iv[j][0] })
// then extend the last interval while the next start overlaps
```

### Recursion template (see `Recursion/tower_of_hanoi.go`)
```go
func solve(n int, from, to, aux string) {
	if n == 0 {
		return
	}
	solve(n-1, from, aux, to)
	fmt.Println(from, "->", to)
	solve(n-1, aux, to, from)
}
```

## Real-World Use

- Sorting: ordered output, deduplication, rankings.
- Binary search: exact lookup in sorted data, time-series lookups.
- BFS: shortest path in unweighted graphs, peer discovery.
- DP (Fibonacci): combinatorics, route counting, memoized recursion.
- Palindrome: validation, text processing pipelines.
- Merge intervals: scheduling, billing windows, resource allocation.

## Pitfalls

- Slices share backing arrays; slicing in place (`arr[:mid]`) mutates the parent.
- `make([]int, 0, cap)` beats repeated `append` for performance-critical code.
- Go strings are byte strings; indexing yields bytes, not runes.
- `sort.Slice` is not stable - use `sort.SliceStable` when order matters.
- Integer division drops remainders; `(left + right) / 2` can overflow.
- Recursion depth is limited; deep cases should use an explicit stack.
- A nil slice is a valid empty slice; never compare slices with `==`.
