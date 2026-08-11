---
layout: default
title: Algorithms Cheatsheet
parent: Rust
nav_order: 1
---

# Rust Algorithms Cheatsheet

Quick-reference for common algorithms implemented in Rust. Companion code
lives in `Rust/Algorithms/` under `Array/`, `Sorting/`, `Searching/`,
`Graph/`, `DynamicProgramming/`, `Recursion/`, `Intervals/`, and `String/`.

> Rust favors iterators (`slice::sort`, `slice::binary_search`,
> `iter().scan`, `HashMap`) over manual loops. Prefer stdlib primitives
> for production code; the custom implementations below are for learning
> and for showing the mechanics in interviews.

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --------- | ---- | ------- | ----- | ----- | ------ |
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |

Available in repo: `Sorting/merge_sort.rs`. Rust's stdlib also provides
`slice::sort` (stable, Timsort-like) and `slice::sort_unstable`
(introsort, faster, unstable).

```rust
let mut v = vec![38, 27, 43, 3, 9, 82, 10];
v.sort();        // stable ascending
v.sort_by(|a, b| b.cmp(a)); // descending
```

### Merge Sort

```rust
fn merge_sort(mut arr: Vec<i32>) -> Vec<i32> {
    if arr.len() <= 1 { return arr; }
    let mid = arr.len() / 2;
    let right = arr.split_off(mid);
    merge(merge_sort(arr), merge_sort(right))
}

fn merge(mut left: Vec<i32>, mut right: Vec<i32>) -> Vec<i32> {
    let mut out = Vec::with_capacity(left.len() + right.len());
    while !left.is_empty() && !right.is_empty() {
        if left[0] <= right[0] {
            out.push(left.remove(0));
        } else {
            out.push(right.remove(0));
        }
    }
    out.extend(left);
    out.extend(right);
    out
}
```

> `Vec::remove(0)` is O(n); the repo version uses index pointers for
> O(1) pops. Prefer index-based merging in practice.

## Searching

Available in repo: `Searching/binary_search.rs`.

| Search | Complexity | Rust built-in |
| ------ | ---------- | ------------- |
| Linear | O(n) | `iter().position(\|x\| *x == t)` |
| Binary (sorted) | O(log n) | `slice::binary_search` |

### Binary Search (iterative)

```rust
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0, arr.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        match arr[mid].cmp(&target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => lo = mid + 1,
            std::cmp::Ordering::Greater => hi = mid,
        }
    }
    None
}
```

Stdlib equivalents: `binary_search` (any match), `partition_point`
(first index where predicate flips).

## Graph Algorithms

Available in repo: `Graph/bfs.rs`.

| Algorithm | Complexity | Use |
| --------- | ---------- | --- |
| BFS | O(V + E) | Shortest path (unweighted), level order |
| DFS | O(V + E) | Connectivity, cycles, topological order |
| Dijkstra | O((V + E) log V) | Shortest path (non-negative weights) |
| Union-Find | O(alpha) | Connectivity queries, MST |

### BFS

```rust
use std::collections::VecDeque;

fn bfs(graph: &[Vec<usize>], start: usize) -> Vec<usize> {
    let mut visited = vec![false; graph.len()];
    let mut queue = VecDeque::new();
    let mut result = Vec::new();
    visited[start] = true;
    queue.push_back(start);
    while let Some(node) = queue.pop_front() {
        result.push(node);
        for &nb in &graph[node] {
            if !visited[nb] {
                visited[nb] = true;
                queue.push_back(nb);
            }
        }
    }
    result
}
```

> Rust's `VecDeque` is the correct queue: `push_back` + `pop_front` are
> both O(1), unlike `Vec::remove(0)`.

## Dynamic Programming

Available in repo: `DynamicProgramming/fibonacci.rs`.

| Pattern | Example | Complexity |
| ------- | ------- | ---------- |
| Memoization (top-down) | Fibonacci | O(n) time, O(n) space |
| Tabulation (bottom-up) | Fibonacci | O(n) time, O(1) space |

### Fibonacci (memoized)

```rust
use std::collections::HashMap;

fn fib(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {
    if n < 2 { return n; }
    if let Some(&v) = memo.get(&n) { return v; }
    let v = fib(n - 1, memo) + fib(n - 2, memo);
    memo.insert(n, v);
    v
}
```

### Fibonacci (iterative)

```rust
fn fib(n: u64) -> u64 {
    let (mut a, mut b) = (0, 1);
    for _ in 0..n { let t = a + b; a = b; b = t; }
    a
}
```

> Add memoization only when a subproblem repeats; a plain recursive
> Fibonacci without memo is O(2^n).

## String Algorithms

Available in repo: `String/palindrome.rs`.

| Technique | Complexity | Rust built-in |
| --------- | ---------- | ------------- |
| Palindrome check | O(n) | `s == s.chars().rev()...` |
| Anagram check | O(n) | sort chars / `HashMap` counts |
| Substring search | O(n * m) | `s.contains(sub)`, `find` |

### Palindrome

```rust
fn is_palindrome(s: &str) -> bool {
    let bytes = s.as_bytes();
    let (mut i, mut j) = (0, bytes.len());
    while i < j {
        if bytes[i] != bytes[j - 1] { return false; }
        i += 1;
        j -= 1;
    }
    true
}
```

> Compare `&str` with `.chars()` for non-ASCII; byte comparison is faster
> for ASCII but breaks on multi-byte UTF-8 characters.

## Templates / Snippets

Reusable building blocks for interviews and contests.

```rust
// Two-sum style: value -> index map
fn two_sum(nums: &[i32], target: i32) -> Vec<usize> {
    let mut seen = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        if let Some(&j) = seen.get(&(target - num)) {
            return vec![j, i];
        }
        seen.insert(num, i);
    }
    vec![]
}
```

```rust
// Frequency counter
let mut freq: HashMap<i32, usize> = HashMap::new();
for &x in &arr { *freq.entry(x).or_insert(0) += 1; }
```

```rust
// Prefix sums
let prefix: Vec<i32> = nums.iter().scan(0, |acc, &x| {
    *acc += x;
    Some(*acc)
}).collect();
```

> `scan` keeps the running accumulator without the stdlib's `Iterator` crate.

## Real-World Use

- **Sorting**: `slice::sort` is production-grade; stable sorts preserve
  ordering of equal keys (e.g., sorting by price then by name).
- **BFS**: shortest hops in unweighted networks, social-graph friend
  suggestion, puzzle solving.
- **Binary search**: lookup in sorted data, `partition_point` for ranges,
  time-series bucketing.
- **Memoized DP**: sequence generation, path counting, knapsack-family
  problems.
- **Two-sum/HashMap**: O(1) membership checks powering caches, indexes,
  and deduplication.

## Pitfalls

- `usize` subtraction underflows: `lo + (hi - lo) / 2` avoids overflow;
  never write `(lo + hi) / 2`.
- `Vec::remove(0)` / `insert(0, _)` are O(n) — use `VecDeque` for queue
  semantics.
- Sorting in place requires `mut`; `sort_by` needs a closure returning
  `Ordering`.
- `HashMap` iteration order is random; sort keys or collect into a `BTreeMap`
  when order matters.
- `String` vs `&str`: functions taking `&str` accept both `&String` and
  string literals; prefer `&str` in signatures.
