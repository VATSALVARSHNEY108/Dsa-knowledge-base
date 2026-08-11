---
layout: default
title: Algorithms Cheatsheet
parent: Ruby
nav_order: 1
---

# Ruby Algorithms Cheatsheet

Quick-reference for common algorithms implemented in Ruby. Companion code
lives in `Ruby/Algorithms/` grouped by category: `Array/`, `Sorting/`,
`Searching/`, `Graph/`, `DynamicProgramming/`, `Recursion/`, `Intervals/`,
and `String/`.

> Ruby's standard library (`Array`, `String`, `Enumerable`) is rich.
> For interviews and problem-solving, prefer built-ins such as `sort`,
> `index`, `tally`, and `each_with_object` over hand-rolled loops where
> they fit, then reach for a custom implementation when needed.

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --------- | ---- | ------- | ----- | ----- | ------ |
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |

Available in repo: `Sorting/merge_sort.rb` (divide-and-conquer, stable).
Ruby also ships `Array#sort` (Timsort, C-backed, use it by default).

```ruby
[38, 27, 43, 3, 9, 82, 10].sort # => [3, 9, 10, 27, 38, 43, 82]
```

### Merge Sort

```ruby
def merge_sort(arr)
  return arr if arr.length <= 1
  mid = arr.length / 2
  merge(merge_sort(arr[0...mid]), merge_sort(arr[mid..]))
end

def merge(left, right)
  result = []
  i = j = 0
  while i < left.length && j < right.length
    result << (left[i] <= right[j] ? left[i] : right[j])
    left[i] <= right[j] ? i += 1 : j += 1
  end
  result.concat(left[i..]).concat(right[j..])
end
```

> Sort a hash by value: `hash.sort_by { |_k, v| v }`. Use `!` versions
> (`sort!`, `reverse!`) to mutate in place.

## Searching

Available in repo: `Searching/binary_search.rb`.

| Search | Complexity | Notes |
| ------ | ---------- | ----- |
| Linear | O(n) | Built in: `arr.index(target)` |
| Binary (sorted) | O(log n) | Loop or recursion, `arr.bsearch` |

### Binary Search (iterative)

```ruby
def binary_search(arr, target)
  lo, hi = 0, arr.length - 1
  while lo <= hi
    mid = (lo + hi) / 2
    return mid if arr[mid] == target
    arr[mid] < target ? lo = mid + 1 : hi = mid - 1
  end
  -1
end
```

Ruby's `Array#bsearch` returns the element, `Array#bsearch_index` the index:

```ruby
arr.bsearch_index { |x| x >= target } # first index >= target, or nil
```

## Graph Algorithms

Available in repo: `Graph/bfs.rb`.

| Algorithm | Complexity | Use |
| --------- | ---------- | --- |
| BFS | O(V + E) | Shortest path (unweighted), level order |
| DFS | O(V + E) | Connectivity, cycles, topological order |
| Dijkstra | O((V + E) log V) | Shortest path (non-negative weights) |
| Topological sort | O(V + E) | DAG ordering, dependency resolution |

### BFS

```ruby
def bfs(graph, start)
  visited = Array.new(graph.size, false)
  queue = [start]
  visited[start] = true
  result = []
  until queue.empty?
    node = queue.shift
    result << node
    graph[node].each do |neighbor|
      next if visited[neighbor]
      visited[neighbor] = true
      queue << neighbor
    end
  end
  result
end
```

> `Array#shift` is O(n); for heavy queue use you can keep a manual index
> pointer or use `Queue` from the stdlib.

## Dynamic Programming

Available in repo: `DynamicProgramming/fibonacci.rb`.

| Pattern | Example | Complexity |
| ------- | ------- | ---------- |
| Memoization (top-down) | Fibonacci | O(n) time, O(n) space |
| Tabulation (bottom-up) | Fibonacci | O(n) time, O(1) space |

### Fibonacci (memoized)

```ruby
def fib(n, memo = {})
  return n if n < 2
  memo[n] ||= fib(n - 1, memo) + fib(n - 2, memo)
end
```

### Fibonacci (iterative, O(1) space)

```ruby
def fib(n)
  a, b = 0, 1
  n.times { a, b = b, a + b }
  a
end
```

> Memoization keys should cover all parameters that affect the result;
> otherwise results are wrong, not just slow.

## String Algorithms

Available in repo: `String/palindrome.rb`.

| Technique | Complexity | Built-in |
| --------- | ---------- | -------- |
| Palindrome check | O(n) | `s == s.reverse` |
| Anagram check | O(n) | `s.chars.sort` or `tally` |
| Substring search | O(n * m) | `s.include?(sub)` / `s.index(sub)` |

### Palindrome

```ruby
def palindrome?(s)
  s == s.reverse
end

def longest_palindrome_around(s, left, right)
  while left >= 0 && right < s.length && s[left] == s[right]
    left -= 1
    right += 1
  end
  s[(left + 1)...right]
end
```

> `String#reverse` is the idiomatic palindrome check. For "ignore
> non-alphanumerics" variants use `s.gsub(/[^a-z0-9]/i, '').downcase`.

## Templates / Snippets

Handy building blocks that recur across many problems.

```ruby
# Two-sum style: value -> index map
def two_sum(nums, target)
  seen = {}
  nums.each_with_index do |num, i|
    return [seen[target - num], i] if seen.key?(target - num)
    seen[num] = i
  end
  []
end
```

```ruby
# Frequency counter
freq = arr.tally
```

```ruby
# Sliding window max-sum of k (fixed window)
def max_sum_window(arr, k)
  window = arr[0, k].sum
  max = window
  (k...arr.length).each do |i|
    window += arr[i] - arr[i - k]
    max = [max, window].max
  end
  max
end
```

```ruby
# Tower of Hanoi (see Recursion/tower_of_hanoi.rb)
def hanoi(n, from, to, aux, moves = [])
  return moves if n.zero?
  hanoi(n - 1, from, aux, to, moves)
  moves << [from, to]
  hanoi(n - 1, aux, to, from, moves)
end
```

## Real-World Use

- **Merge sort**: stable sort of linked lists; Ruby's default sort is
  Timsort (merge-based) for stability.
- **BFS**: shortest path in unweighted graphs — social networks,
  web-crawler traversal, word-ladder puzzles.
- **Binary search**: lookup in sorted datasets, nearest-time lookups,
  range queries, `bsearch` in ActiveRecord-adjacent pagination code.
- **Fibonacci/DP**: combinatorial counting, stock-profit, knapsack,
  sequence generation (codons, pricing tiers).
- **Palindrome/string checks**: validation, reversible-token checks,
  DNA-complement checks.

## Pitfalls

- `arr.sort` is non-mutating; forgetting `!` silently discards the result.
- `arr.index(x)` does a linear scan — O(n) per call inside a loop is O(n^2).
- `queue.shift` on a large `Array` is O(n); prefer a ring buffer or
  `Queue` when performance matters.
- Integer division: `(lo + hi) / 2` in Ruby truncates, fine for indices.
- `Hash` default: `memo = {}` returns `nil` for missing keys, so use
  `memo[n] ||= ...` only when values can't be `nil`/`false`.
- Recursion depth: deep recursion raises `SystemStackError`; convert to
  iteration or increase stack limits for very large inputs.
- `String#reverse` copies; avoid on huge strings inside hot loops.
- Mutating a hash while iterating it raises `RuntimeError`; collect
  changes and apply them after the loop.
