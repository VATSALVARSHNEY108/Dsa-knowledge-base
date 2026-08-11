---
layout: default
title: Algorithms Cheatsheet
parent: Scala
nav_order: 1
---

# Scala Algorithms Cheatsheet

Quick-reference for common algorithms implemented in Scala. Companion code
lives in `Scala/Algorithms/` under `Array/`, `Sorting/`, `Searching/`,
`Graph/`, `DynamicProgramming/`, `Recursion/`, `Intervals/`, and `String/`.

> Scala blends OOP and FP. Use immutable collections, `map`/`filter`/
> `foldLeft`, `sorted`, and pattern matching first; drop to loops or
> mutable structures only for performance-critical spots.

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --------- | ---- | ------- | ----- | ----- | ------ |
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |

Available in repo: `Sorting/MergeSort.scala`. Stdlib shortcuts:
`List.sorted`, `List.sortWith`, `Array.sorted`, `sortBy`.

```scala
List(38, 27, 43, 3, 9, 82, 10).sorted            // => List(3, 9, 10, ...)
Array(3, 1, 2).sortWith(_ > _)                   // descending, in place
xs.sortBy(x => -x.length)                        // key-based sort
```

### Merge Sort

```scala
def mergeSort(arr: Array[Int]): Array[Int] = {
  if (arr.length <= 1) arr
  else {
    val mid = arr.length / 2
    merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid, arr.length)))
  }
}

def merge(left: Array[Int], right: Array[Int]): Array[Int] = {
  val out = scala.collection.mutable.ArrayBuffer[Int]()
  var i = 0; var j = 0
  while (i < left.length && j < right.length) {
    if (left(i) <= right(j)) { out += left(i); i += 1 }
    else { out += right(j); j += 1 }
  }
  out ++= left.drop(i) ++= right.drop(j)
  out.toArray
}
```

> `Array` is mutable; `List` is immutable. For functional style, prefer
> `List` and pattern-matching recursion; use `Array` when in-place work
> or index access matters.

## Searching

Available in repo: `Searching/BinarySearch.scala`.

| Search | Complexity | Scala built-in |
| ------ | ---------- | -------------- |
| Linear | O(n) | `xs.indexOf(target)` |
| Binary (sorted) | O(log n) | `scala.collection.Searching` |

### Binary Search (iterative)

```scala
def binarySearch(arr: Array[Int], target: Int): Int = {
  var lo = 0
  var hi = arr.length - 1
  while (lo <= hi) {
    val mid = lo + (hi - lo) / 2
    if (arr(mid) == target) return mid
    else if (arr(mid) < target) lo = mid + 1
    else hi = mid - 1
  }
  -1
}
```

Stdlib: `import scala.collection.Searching._; arr.search(target)` returns
a `Found`/`InsertionPoint` result.

## Graph Algorithms

Available in repo: `Graph/BFS.scala`.

| Algorithm | Complexity | Use |
| --------- | ---------- | --- |
| BFS | O(V + E) | Shortest path (unweighted), level order |
| DFS | O(V + E) | Connectivity, cycles, topological order |
| Dijkstra | O((V + E) log V) | Shortest path (non-negative weights) |
| Topological sort | O(V + E) | DAG ordering |

### BFS

```scala
import scala.collection.mutable.Queue

def bfs(graph: Map[Int, List[Int]], start: Int): List[Int] = {
  val visited = scala.collection.mutable.Set(start)
  val queue = Queue(start)
  val result = scala.collection.mutable.ListBuffer[Int]()
  while (queue.nonEmpty) {
    val node = queue.dequeue()
    result += node
    graph.getOrElse(node, Nil).foreach { nb =>
      if (!visited.contains(nb)) {
        visited += nb
        queue.enqueue(nb)
      }
    }
  }
  result.toList
}
```

> `mutable.Queue` gives O(1) `enqueue`/`dequeue`. A pure-functional BFS
> uses `Stream`/lazy lists but is trickier to write correctly.

## Dynamic Programming

Available in repo: `DynamicProgramming/Fibonacci.scala`.

| Pattern | Example | Complexity |
| ------- | ------- | ---------- |
| Memoization (top-down) | Fibonacci | O(n) time, O(n) space |
| Tabulation (bottom-up) | Fibonacci | O(n) time, O(1) space |

### Fibonacci (memoized, functional)

```scala
import scala.collection.mutable

val memo = mutable.Map[Int, Long]()

def fib(n: Int): Long = {
  if (n < 2) n
  else memo.getOrElseUpdate(n, fib(n - 1) + fib(n - 2))
}
```

### Fibonacci (iterative)

```scala
def fib(n: Int): Long = {
  var a = 0L
  var b = 1L
  for (_ <- 0 until n) { val t = a + b; a = b; b = t }
  a
}
```

> `getOrElseUpdate` is the idiomatic memoization pattern in Scala.

## String Algorithms

Available in repo: `String/Palindrome.scala`.

| Technique | Complexity | Scala built-in |
| --------- | ---------- | -------------- |
| Palindrome check | O(n) | `s == s.reverse` |
| Anagram check | O(n) | `s.sorted` or `groupBy` counts |
| Substring search | O(n * m) | `s.contains(sub)`, `s.indexOf` |

### Palindrome

```scala
def isPalindrome(s: String): Boolean = s == s.reverse

def longestPalindromeAround(s: String, l: Int, r: Int): String = {
  var left = l
  var right = r
  while (left >= 0 && right < s.length && s(left) == s(right)) {
    left -= 1
    right += 1
  }
  s.substring(left + 1, right)
}
```

> `String.reverse` works on the full string; for "ignore case/punctuation"
> variants normalize with `s.toLowerCase.filter(_.isLetterOrDigit)`.

## Templates / Snippets

Reusable building blocks.

```scala
// Two-sum style: value -> index map
def twoSum(nums: Array[Int], target: Int): Array[Int] = {
  val seen = scala.collection.mutable.Map[Int, Int]()
  for ((num, i) <- nums.zipWithIndex) {
    seen.get(target - num) match {
      case Some(j) => return Array(j, i)
      case None    => seen(num) = i
    }
  }
  Array.emptyIntArray
}
```

```scala
// Frequency counter
val freq = arr.groupBy(identity).view.mapValues(_.length).toMap
```

```scala
// Tower of Hanoi (see Recursion/TowerOfHanoi.scala)
def hanoi(n: Int, from: Char, to: Char, aux: Char): List[(Char, Char)] = {
  if (n == 0) Nil
  else
    hanoi(n - 1, from, aux, to) ++
      List((from, to)) ++
      hanoi(n - 1, aux, to, from)
}
```

## Real-World Use

- **Merge sort**: stable sort of linked lists; Java/Scala's default sort
  for objects is merge-based (Timsort).
- **BFS**: shortest path in unweighted graphs — route planning, social
  networks, web crawlers.
- **Binary search**: sorted-data lookups, range queries, `Searching`
  library for boundaries.
- **Memoized DP**: counting problems, sequence generation, knapsack-family
  algorithms.

## Pitfalls

- `Array.slice` allocates; for large arrays prefer index ranges `arr(i)`
  access.
- `Array` is mutable — returning it leaks internal state; return copies
  or use `List`.
- `String.reverse` creates a new string; avoid on huge strings in hot
  loops.
- `for` loops with `return` inside a `match` are fine in Scala but the
  compiler warns about non-local returns in closures.
- Integer division in `mid` calculation: use `lo + (hi - lo) / 2` to avoid
  overflow.
- `groupBy` returns a `Map[K, Array[...]]` with order not guaranteed;
  sort keys if deterministic output matters.
- Deep recursion (e.g., naive Fibonacci) overflows the stack; always add
  memoization or switch to iteration.
- `mutable.Queue`/`mutable.Set` are thread-unsafe; use immutable versions
  or `synchronized` when shared across threads.
