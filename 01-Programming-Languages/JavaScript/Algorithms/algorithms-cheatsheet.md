---
layout: default
title: Algorithms Cheatsheet
parent: JavaScript
nav_order: 1
---

# JavaScript Algorithms Cheatsheet

Quick-reference for the algorithm implementations in this folder. Each entry maps to a
file under `Algorithms/`. All snippets are self-contained and runnable with Node.js.

## Available Files

| Category | File | Problem |
| --- | --- | --- |
| Array | `twoSum.js` | Find two indices that sum to a target |
| Dynamic Programming | `fibonacci.js` | Compute the nth Fibonacci number |
| Graph | `bfs.js` | Breadth-first graph traversal |
| Intervals | `mergeIntervals.js` | Merge overlapping intervals |
| Recursion | `towerOfHanoi.js` | Move disks between pegs |
| Searching | `binarySearch.js` | Find target in a sorted array |
| Sorting | `mergeSort.js` | Merge sort (divide and conquer) |
| String | `palindrome.js` | Valid palindrome check |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

> Built-in alternative: `Array.prototype.sort()` uses TimSort in modern V8 —
> O(n log n) average, stable. Pass a comparator: `arr.sort((a, b) => a - b)`.

## Searching

| Algorithm | Time | Space | Precondition |
| --- | --- | --- | --- |
| Binary Search | O(log n) | O(1) | Sorted array |

```javascript
function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

## Graph Algorithms

| Algorithm | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS (queue) | O(V + E) | O(V) | Shortest path in unweighted graphs |
| DFS (stack/recursion) | O(V + E) | O(V) | Use `visited` set to avoid cycles |

```javascript
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const result = [];
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}
```

> In JavaScript there is no native queue class — `Array.shift()` is O(n). For large
> inputs, emulate a queue with an index pointer over a plain array for O(1) dequeue.

## Dynamic Programming

| Problem | File | Time | Space |
| --- | --- | --- | --- |
| Fibonacci (bottom-up) | `fibonacci.js` | O(n) | O(1) |

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
```

## String Algorithms

| Algorithm | Time | Space | File |
| --- | --- | --- | --- |
| Two-pointer palindrome | O(n) | O(1) | `palindrome.js` |

```javascript
function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;
    while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++; right--;
  }
  return true;
}
```

## Templates / Snippets

### Two Sum (hash map)
```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}
```

### Merge Intervals
```javascript
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else merged.push(intervals[i]);
  }
  return merged;
}
```

### Tower of Hanoi (recursion)
```javascript
function towerOfHanoi(n, source, destination, auxiliary) {
  if (n === 1) {
    console.log(`Move disk 1 from ${source} to ${destination}`);
    return;
  }
  towerOfHanoi(n - 1, source, auxiliary, destination);
  console.log(`Move disk ${n} from ${source} to ${destination}`);
  towerOfHanoi(n - 1, auxiliary, destination, source);
}
```

### Memoized Fibonacci (top-down)
```javascript
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (n in memo) return memo[n];
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

## Real-World Use

- **Merge sort**: stable sorting in file/linked-list merges; guaranteed O(n log n).
- **Binary search**: database index lookups, spell-checking dictionaries, API pagination.
- **BFS**: shortest path in unweighted graphs, web crawlers, social "degrees of separation".
- **Two sum pattern**: caching, "two-pointer complement" problems, distributed sums.
- **Merge intervals**: calendar/meeting scheduling, IP range consolidation, video timeline merging.
- **DP Fibonacci**: amortization schedules, Fibonacci heaps, counting combinatorial structures.
- **Palindrome**: DNA sequence checks, editing-distance preprocessing, validators.

## Pitfalls

- `Array.shift()` and `unshift()` are O(n); avoid in hot loops.
- Comparisons on numbers require a comparator — default `sort()` is lexicographic.
- `const` does not freeze objects/arrays; use `Object.freeze()` for true immutability.
- Hashing with `Map` vs object: use `Map` for non-string keys; avoid prototype collisions.
- Recursion depth limits (~10k frames) can throw `RangeError`; switch to iterative for big inputs.
- `Math.floor((left + right) / 2)` avoids overflow on huge arrays better with
  `left + Math.floor((right - left) / 2)`.
- Floating point: `0.1 + 0.2 !== 0.3`; compare with an epsilon in numeric algorithms.
