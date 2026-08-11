---
layout: default
title: Algorithms Cheatsheet
parent: R
nav_order: 1
---

# R Algorithms Cheatsheet

Quick-reference for the algorithm implementations in this folder. Each entry maps to a
file under `Algorithms/`. Snippets run in base R (R 4.x).

## Available Files

| Category | File | Problem |
| --- | --- | --- |
| Array | `two_sum.R` | Find two indices that sum to a target |
| Dynamic Programming | `fibonacci.R` | Compute the nth Fibonacci number |
| Graph | `bfs.R` | Breadth-first graph traversal |
| Intervals | `merge_intervals.R` | Merge overlapping intervals |
| Recursion | `tower_of_hanoi.R` | Move disks between pegs |
| Searching | `binary_search.R` | Find target in a sorted array |
| Sorting | `merge_sort.R` | Merge sort (divide and conquer) |
| String | `palindrome.R` | Palindrome check |

> R is 1-indexed. All vector/list indexing starts at 1, unlike most other languages.

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

```r
merge_sort <- function(arr) {
  n <- length(arr)
  if (n <= 1) return(arr)
  mid <- n %/% 2
  left <- merge_sort(arr[1:mid])
  right <- merge_sort(arr[(mid + 1):n])
  merge(left, right)
}

merge <- function(left, right) {
  result <- c()
  i <- j <- 1
  while (i <= length(left) && j <= length(right)) {
    if (left[i] <= right[j]) {
      result <- c(result, left[i]); i <- i + 1
    } else {
      result <- c(result, right[j]); j <- j + 1
    }
  }
  c(result, left[i:length(left)], right[j:length(right)])
}
```

> Built-in: `sort(x)` (default method = "shell", can set `method = "radix"` for fast
> sorts), `order(x)` returns indices, and `rank(x)` returns ranks. `sort` is stable for
> radix method.

## Searching

| Algorithm | Time | Space | Precondition |
| --- | --- | --- | --- |
| Binary Search | O(log n) | O(1) | Sorted array |

```r
binary_search <- function(arr, target) {
  left <- 1
  right <- length(arr)
  while (left <= right) {
    mid <- left + (right - left) %/% 2
    if (arr[mid] == target) return(mid)
    if (arr[mid] < target) left <- mid + 1
    else right <- mid - 1
  }
  -1
}
```

> Built-in: `match(target, arr)` (first match, O(n)) and `which(arr == target)`. No
> native binary search, but `findInterval()` on sorted vectors is close.

## Graph Algorithms

| Algorithm | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS (queue) | O(V + E) | O(V) | Shortest path unweighted |
| DFS (recursion) | O(V + E) | O(V) | recursive, watch stack depth |

```r
bfs <- function(graph, start) {
  visited <- rep(FALSE, length(graph))
  queue <- c(start)
  visited[start] <- TRUE
  result <- c()
  while (length(queue) > 0) {
    node <- queue[1]
    queue <- queue[-1]
    result <- c(result, node)
    for (neighbor in graph[[node]]) {
      if (!visited[neighbor]) {
        visited[neighbor] <- TRUE
        queue <- c(queue, neighbor)
      }
    }
  }
  result
}
```

> `queue[-1]` drops the first element by copying (O(n)). For large graphs, use the
> `igraph` package or an index-pointer approach for O(1) dequeue.

## Dynamic Programming

| Problem | File | Time | Space |
| --- | --- | --- | --- |
| Fibonacci (bottom-up) | `fibonacci.R` | O(n) | O(1) |

```r
fibonacci <- function(n) {
  if (n <= 1) return(n)
  a <- 0
  b <- 1
  for (i in 2:n) {
    temp <- a + b
    a <- b
    b <- temp
  }
  b
}
```

## String Algorithms

| Algorithm | Time | Space | File |
| --- | --- | --- | --- |
| Two-pointer palindrome | O(n) | O(1) | `palindrome.R` |

```r
is_palindrome <- function(s) {
  left <- 1
  right <- nchar(s)
  while (left < right) {
    if (substr(s, left, left) != substr(s, right, right)) {
      return(FALSE)
    }
    left <- left + 1
    right <- right - 1
  }
  TRUE
}
```

> String access in R uses `nchar()` and `substr()`/`substring()`; there is no `s[i]`
> indexing for characters like in C-style languages.

## Templates / Snippets

### Two Sum (named list as map)
```r
two_sum <- function(nums, target) {
  seen <- list()
  for (i in seq_along(nums)) {
    complement <- target - nums[i]
    if (!is.null(seen[[as.character(complement)]])) {
      return(c(seen[[as.character(complement)]], i))
    }
    seen[[as.character(nums[i])]] <- i
  }
  NULL
}
```

### Merge Intervals
```r
merge_intervals <- function(intervals) {
  if (length(intervals) == 0) return(list())
  sorted <- intervals[order(sapply(intervals, `[`, 1))]
  merged <- list(sorted[[1]])
  for (i in 2:length(sorted)) {
    last <- merged[[length(merged)]]
    curr <- sorted[[i]]
    if (curr[1] <= last[2]) {
      merged[[length(merged)]][2] <- max(last[2], curr[2])
    } else {
      merged <- c(merged, list(curr))
    }
  }
  merged
}
```

### Tower of Hanoi (recursion)
```r
tower_of_hanoi <- function(n, source, destination, auxiliary) {
  if (n == 1) {
    cat("Move disk 1 from", source, "to", destination, "\n")
    return()
  }
  tower_of_hanoi(n - 1, source, auxiliary, destination)
  cat("Move disk", n, "from", source, "to", destination, "\n")
  tower_of_hanoi(n - 1, auxiliary, destination, source)
}
```

### Memoized Fibonacci (top-down)
```r
fib_memo <- local({
  memo <- list(`0` = 0, `1` = 1)
  function(n) {
    key <- as.character(n)
    if (n <= 1) return(n)
    if (is.null(memo[[key]])) {
      memo[[key]] <<- fib_memo(n - 1) + fib_memo(n - 2)
    }
    memo[[key]]
  }
})
```

## Real-World Use

- **Merge sort**: stable sorting when vectorized sorts are not applicable.
- **Binary search**: large sorted data lookups, thresholds in simulations.
- **BFS**: network spread models, shortest paths in unweighted graphs.
- **DP**: portfolio optimization, sequence alignment (LCS-like), growth models.
- **Merge intervals**: overlapping sensor/time-window consolidation.
- **Fibonacci**: growth-rate benchmarks, demo of memoization for statistics.
- **Palindrome**: validation checks in text/biological data preprocessing.

## Pitfalls

- R is 1-indexed: `arr[0]` is empty, not the first element.
- `c()` grows vectors by copying — O(n) per append; preallocate or use list `[[` indexing.
- `%/%` is integer division; `/` returns float (unlike C/Python int division).
- `which(arr == target)` may return multiple matches; `match()` returns first only.
- `sort(x)` default method is not guaranteed stable; use `method = "radix"` for stability.
- List vs vector: `intervals[[1]]` vs `intervals[1]` — `[` returns a sub-list, `[[`
  returns the element.
- Recursion in R is slow; use iteration or vectorization for large n.
- `substr` with multi-byte strings: use `nchar(s, type = "width")` and encoding-aware
  functions for UTF-8.
- Vectorized operations (`sapply`, `vapply`) are preferred over explicit loops for speed.
