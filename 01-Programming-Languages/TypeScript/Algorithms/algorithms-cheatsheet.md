---
layout: default
title: Algorithms Cheatsheet
parent: TypeScript
nav_order: 1
---

# TypeScript Algorithms Cheatsheet

Quick-reference for common algorithms implemented in TypeScript. Companion
code lives in `TypeScript/Algorithms/` under `Array/`, `Sorting/`,
`Searching/`, `Graph/`, `DynamicProgramming/`, `Recursion/`, `Intervals/`,
and `String/`.

> TypeScript inherits JavaScript's arrays, maps, sets, and string methods.
> Use the built-ins (`sort`, `indexOf`, `Map`, `Set`, `reduce`) wherever
> they fit; implement custom algorithms when you need guaranteed
> complexity or must show the mechanics.

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --------- | ---- | ------- | ----- | ----- | ------ |
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |

Available in repo: `Sorting/mergeSort.ts`. `Array.prototype.sort` is
stable in modern engines (Timsort/V8).

```typescript
const xs = [38, 27, 43, 3, 9, 82, 10];
xs.sort((a, b) => a - b);              // numeric ascending
xs.sort((a, b) => b - a);              // descending
objs.sort((a, b) => a.name.localeCompare(b.name));
```

> Default `sort()` converts to strings — always pass a comparator for
> numbers.

### Merge Sort

```typescript
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(
    mergeSort(arr.slice(0, mid)),
    mergeSort(arr.slice(mid))
  );
}

function merge(left: number[], right: number[]): number[] {
  const out: number[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}
```

## Searching

Available in repo: `Searching/binarySearch.ts`.

| Search | Complexity | Built-in |
| ------ | ---------- | -------- |
| Linear | O(n) | `indexOf`, `findIndex`, `includes` |
| Binary (sorted) | O(log n) | none in stdlib |

### Binary Search (iterative)

```typescript
function binarySearch(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

## Graph Algorithms

Available in repo: `Graph/bfs.ts`.

| Algorithm | Complexity | Use |
| --------- | ---------- | --- |
| BFS | O(V + E) | Shortest path (unweighted), level order |
| DFS | O(V + E) | Connectivity, cycles, topological order |
| Dijkstra | O((V + E) log V) | Shortest path (non-negative weights) |
| Topological sort | O(V + E) | DAG ordering |

### BFS

```typescript
function bfs(graph: number[][], start: number): number[] {
  const visited = new Array(graph.length).fill(false);
  const queue: number[] = [start];
  const result: number[] = [];
  visited[start] = true;
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        queue.push(neighbor);
      }
    }
  }
  return result;
}
```

> `Array.shift()` is O(n); for large graphs use an index-pointer queue to
> keep BFS truly O(V + E).

## Dynamic Programming

Available in repo: `DynamicProgramming/fibonacci.ts`.

| Pattern | Example | Complexity |
| ------- | ------- | ---------- |
| Memoization (top-down) | Fibonacci | O(n) time, O(n) space |
| Tabulation (bottom-up) | Fibonacci | O(n) time, O(1) space |

### Fibonacci (memoized)

```typescript
function fib(n: number, memo: Map<number, number> = new Map()): number {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);
  return value;
}
```

### Fibonacci (iterative)

```typescript
function fib(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}
```

## String Algorithms

Available in repo: `String/palindrome.ts`.

| Technique | Complexity | Built-in |
| --------- | ---------- | -------- |
| Palindrome check | O(n) | `s === [...s].reverse().join('')` |
| Anagram check | O(n) | sorted chars or `Map` counts |
| Substring search | O(n * m) | `indexOf`, `includes` |

### Palindrome

```typescript
function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) return false;
    i++;
    j--;
  }
  return true;
}
```

> For "ignore non-alphanumeric" problems, normalize first:
> `s.replace(/[^a-z0-9]/gi, '').toLowerCase()`.

## Templates / Snippets

Reusable building blocks.

```typescript
// Two-sum style: value -> index map
function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement)!, i];
    seen.set(nums[i], i);
  }
  return [];
}
```

```typescript
// Sliding window: max sum of fixed window size k
function maxSumWindow(arr: number[], k: number): number {
  let window = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let max = window;
  for (let i = k; i < arr.length; i++) {
    window += arr[i] - arr[i - k];
    max = Math.max(max, window);
  }
  return max;
}
```

```typescript
// Tower of Hanoi (see Recursion/towerOfHanoi.ts)
function hanoi(n: number, from: string, to: string, aux: string): void {
  if (n === 0) return;
  hanoi(n - 1, from, aux, to);
  console.log(`Move disk ${n}: ${from} -> ${to}`);
  hanoi(n - 1, aux, to, from);
}
```

## Real-World Use

- **Merge sort**: stable sort semantics; the default engine sort is
  merge-based for most cases.
- **BFS**: unweighted shortest path — social graphs, web crawling,
  game-level navigation.
- **Binary search**: sorted-data lookups, range queries, autocomplete
  boundaries.
- **Memoized DP**: counting/optimization problems, sequence generation,
  knapsack variants.
- **Map-based lookups**: deduplication, caches, anagram grouping,
  majority-element detection.

## Pitfalls

- `sort()` without a comparator sorts lexicographically (`[10, 2]` -> `[10, 2]`
  as strings); always pass a numeric comparator.
- `shift()`/`unshift()` on arrays are O(n); avoid in hot loops.
- `Array.prototype.sort` mutates the array — clone with `[...arr]` first
  if you need the original.
- `Math.floor((lo + hi) / 2)` can overflow for huge indices; use
  `lo + Math.floor((hi - lo) / 2)`.
- Numbers are IEEE-754 doubles — no arbitrary-precision integers; big
  sums may lose precision (use `BigInt` when needed).
- `map.get()` returns `undefined` for missing keys; `?? 0` defaults are
  the idiomatic fix.
- Spreading huge arrays (`[...arr]`) copies them — O(n) per copy.
