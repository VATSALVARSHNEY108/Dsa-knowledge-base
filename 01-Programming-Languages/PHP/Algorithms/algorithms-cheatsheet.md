---
layout: default
title: Algorithms Cheatsheet
parent: PHP
nav_order: 1
---

# PHP Algorithms Cheatsheet

Quick-reference for the algorithm implementations in this folder. Each entry maps to a
file under `Algorithms/`. Snippets run with PHP 7.4+ (typed properties, arrow functions).

## Available Files

| Category | File | Problem |
| --- | --- | --- |
| Array | `two_sum.php` | Find two indices that sum to a target |
| Dynamic Programming | `fibonacci.php` | Compute the nth Fibonacci number |
| Graph | `bfs.php` | Breadth-first graph traversal |
| Intervals | `merge_intervals.php` | Merge overlapping intervals |
| Recursion | `tower_of_hanoi.php` | Move disks between pegs |
| Searching | `binary_search.php` | Find target in a sorted array |
| Sorting | `merge_sort.php` | Merge sort (divide and conquer) |
| String | `palindrome.php` | Palindrome check |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |

```php
function mergeSort(array &$arr, int $left, int $right): void {
    if ($left < $right) {
        $mid = intdiv($left + $right, 2);
        mergeSort($arr, $left, $mid);
        mergeSort($arr, $mid + 1, $right);
        merge($arr, $left, $mid, $right);
    }
}
function merge(array &$arr, int $left, int $mid, int $right): void {
    $L = array_slice($arr, $left, $mid - $left + 1);
    $R = array_slice($arr, $mid + 1, $right - $mid);
    $i = $j = 0; $k = $left;
    while ($i < count($L) && $j < count($R)) {
        $arr[$k++] = ($L[$i] <= $R[$j]) ? $L[$i++] : $R[$j++];
    }
    while ($i < count($L)) $arr[$k++] = $L[$i++];
    while ($j < count($R)) $arr[$k++] = $R[$j++];
}
```

> Built-in: `sort()` (ascending), `rsort()` (descending), `usort($arr, $cmp)` for custom
> comparators. PHP sort functions are NOT stable. For stable sorting use `uasort` with
> an index tiebreaker or merge sort.

## Searching

| Algorithm | Time | Space | Precondition |
| --- | --- | --- | --- |
| Binary Search | O(log n) | O(1) | Sorted array |

```php
function binarySearch(array $nums, int $target): int {
    $left = 0;
    $right = count($nums) - 1;
    while ($left <= $right) {
        $mid = $left + intdiv($right - $left, 2);
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$mid] < $target) $left = $mid + 1;
        else $right = $mid - 1;
    }
    return -1;
}
```

> Built-in: `in_array($needle, $haystack, true)` (strict, O(n)) and `array_search`.
> No built-in binary search for plain arrays.

## Graph Algorithms

| Algorithm | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS (queue) | O(V + E) | O(V) | Shortest path in unweighted graphs |
| DFS (stack/recursion) | O(V + E) | O(V) | Track `visited` to avoid cycles |

```php
function bfs(array $graph, int $start): array {
    $visited = array_fill(0, count($graph), false);
    $queue = [$start];
    $visited[$start] = true;
    $result = [];
    while (!empty($queue)) {
        $node = array_shift($queue);
        $result[] = $node;
        foreach ($graph[$node] as $neighbor) {
            if (!$visited[$neighbor]) {
                $visited[$neighbor] = true;
                $queue[] = $neighbor;
            }
        }
    }
    return $result;
}
```

> `array_shift()` is O(n); for large graphs use a manual head index pointer or
> `SplQueue` to achieve O(1) dequeue.

## Dynamic Programming

| Problem | File | Time | Space |
| --- | --- | --- | --- |
| Fibonacci (bottom-up) | `fibonacci.php` | O(n) | O(1) |

```php
function fib(int $n): int {
    if ($n <= 1) return $n;
    $prev2 = 0;
    $prev1 = 1;
    for ($i = 2; $i <= $n; $i++) {
        $curr = $prev1 + $prev2;
        $prev2 = $prev1;
        $prev1 = $curr;
    }
    return $prev1;
}
```

## String Algorithms

| Algorithm | Time | Space | File |
| --- | --- | --- | --- |
| Two-pointer palindrome | O(n) | O(1) | `palindrome.php` |

```php
function isPalindrome(string $s): bool {
    $left = 0;
    $right = strlen($s) - 1;
    while ($left < $right) {
        if ($s[$left] !== $s[$right]) return false;
        $left++;
        $right--;
    }
    return true;
}
```

> PHP strings are byte arrays: `strlen()` counts bytes. Use `mb_strlen()` / `mb_substr()`
> for multi-byte (UTF-8) input.

## Templates / Snippets

### Two Sum (hash map)
```php
function twoSum(array $nums, int $target): array {
    $map = [];
    foreach ($nums as $i => $num) {
        $complement = $target - $num;
        if (array_key_exists($complement, $map)) {
            return [$map[$complement], $i];
        }
        $map[$num] = $i;
    }
    return [];
}
```

### Merge Intervals
```php
function mergeIntervals(array $intervals): array {
    if (empty($intervals)) return [];
    usort($intervals, fn($a, $b) => $a[0] <=> $b[0]);
    $merged = [$intervals[0]];
    for ($i = 1; $i < count($intervals); $i++) {
        $last = &$merged[count($merged) - 1];
        if ($intervals[$i][0] <= $last[1]) {
            $last[1] = max($last[1], $intervals[$i][1]);
        } else {
            $merged[] = $intervals[$i];
        }
    }
    return $merged;
}
```

### Tower of Hanoi (recursion)
```php
function towerOfHanoi(int $n, string $source, string $dest, string $aux): void {
    if ($n === 1) {
        echo "Move disk 1 from $source to $dest\n";
        return;
    }
    towerOfHanoi($n - 1, $source, $aux, $dest);
    echo "Move disk $n from $source to $dest\n";
    towerOfHanoi($n - 1, $aux, $dest, $source);
}
```

### Memoized Fibonacci (top-down)
```php
function fibMemo(int $n, array &$memo = []): int {
    if ($n <= 1) return $n;
    if (isset($memo[$n])) return $memo[$n];
    return $memo[$n] = fibMemo($n - 1, $memo) + fibMemo($n - 2, $memo);
}
```

## Real-World Use

- **Merge sort**: stable ordering when PHP's native `sort` stability is insufficient.
- **Binary search**: sorted lookups in large datasets, range queries, validation.
- **BFS**: shortest path, social-network degrees, level-order processing.
- **Two sum pattern**: deduplication, complement lookups, inventory checks.
- **Merge intervals**: booking/availability slots, log time consolidation.
- **DP Fibonacci**: compounding calculations, path counting, memoized recursion seeds.
- **Palindrome**: basic validation, password-pattern checks, natural-language preprocess.

## Pitfalls

- PHP `sort`/`rsort` re-index numeric arrays and are unstable — use `usort` for stability.
- `array_key_exists` vs `isset`: `isset` returns false for `null` values.
- `array_shift` is O(n); use `SplQueue` for queue-heavy algorithms.
- Strings are byte-indexed: multi-byte characters break `$s[$i]` access.
- `intdiv()` throws a `DivisionByZeroError` if the divisor is 0 — guard inputs.
- Reference semantics (`&$arr`, `&$merged`) are required for in-place mutation; forgetting
  the `&` silently copies.
- Loose `==` vs strict `===`: array/string comparisons may coerce types unexpectedly.
- `usort` with arrow functions requires PHP 7.4+; older code needs `function ($a, $b)`.
