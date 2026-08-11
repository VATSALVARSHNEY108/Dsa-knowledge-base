# Problem Solving Cheatsheet

Quick reference for the problem-solving process, patterns,
and complexity decisions.

## Core Concepts

- **Understand first** — Restate the problem in your own words.
- **Constraints decide everything** — n, values, memory, and time
  limits pick the algorithm for you.
- **Patterns beat memorization** — most problems reuse ~14 patterns.
- **Any problem in the right form** — reduce to a known subproblem.
- **Optimal is not always brute force improved** — pick the right
  data structure early.

> A problem is 50% solved once the right pattern is identified.

## Problem Solving Steps

1. **Read and restate** the problem. List inputs, outputs, edge cases.
2. **Write examples** — 3+ cases including empty and boundary inputs.
3. **Derive the brute force** — the simplest correct solution.
4. **Measure brute force complexity** against constraints.
5. **Pick a pattern** from the recognition table below.
6. **Design the optimal algorithm** and prove it correct.
7. **Check edge cases** — empty, single element, all same, reversed,
   0, negative, overflow.
8. **Code cleanly** with descriptive names.
9. **Test** with sample + custom cases.
10. **Do a dry run** of the worst-case input in your head.

## Pattern Recognition Table

| Pattern | Core Idea | Signal (Keywords) | Typical Complexity |
|---------|-----------|-------------------|--------------------|
| Two Pointers | left/right meet in middle | sorted array, pair sum, palindrome | O(n), O(1) |
| Sliding Window | expand/shrink window | contiguous subarray/substring, k, longest/shortest | O(n), O(k) |
| Binary Search | halve search space | sorted, min/max answer, monotonic condition | O(log n) |
| Backtracking | explore + undo | combinations, permutations, constraints | O(branch^depth) |
| DP | memoize subresults | optimal substructure, max/min, ways, overlapping | O(n^2)+ |
| Greedy | local best each step | activity, interval, coin (special), scheduling | O(n log n) |
| Divide and Conquer | split, solve, merge | merge sort, counting inversions, closest pair | O(n log n) |
| Prefix Sum | precompute running sums | range sum queries, subarray sum | O(n) build |
| HashMap Count | freq map / lookup | duplicates, anagrams, two-sum, majority | O(n) |
| Heap | always-extreme element | k smallest/largest, top frequent, stream median | O(n log k) |
| Stack / Monotonic | next greater/smaller | next greater element, histogram, parentheses | O(n) |
| Union-Find | group/union components | connected components, course schedule, MST | O(α(n)) |
| Graph Traversal | BFS/DFS | shortest path, islands, cycles, topo order | O(V+E) |
| Bit Manipulation | bit tricks, masks | subsets, single number, powers of two | O(n), O(n*2^n) |
| Math / Number Theory | gcd, primes, modular | division, remainders, LCM, factors | O(√n)+ |
| Trie | shared prefixes | word search, autocomplete | O(L) per op |

> Write down the KEYWORDS for each pattern — this unlocks
> quick pattern matching during a contest.

## Complexity Rules of Thumb

```
If n up to          target complexity          pattern families
─────────────────────────────────────────────────────────────────
10                  O(n!)                     brute force, perms
20-25               O(2^n)                    bitmask DP, subsets
50                  O(n^3)                    Floyd-Warshall
100-500             O(n^3) / O(n^2 log n)     matrix / interval DP
1,000-5,000         O(n^2)                    nested loops, 2D DP
10^5                O(n log n)                sort, segment tree
10^6                O(n)                      scan, two pointers
10^7-10^8           O(n) tight / O(n)          linear in C++/Go
10^9+               O(log n), O(√n)           math, binary search
```

> Python runs ~10-50x slower than C++. In Python, aim for
> ~10^6 simple ops/second as a safe budget.

## Brute Force to Optimal Checklist

- [ ] Could I sort first to enable two pointers or binary search?
- [ ] Can a freq map turn O(n^2) lookups into O(1)?
- [ ] Is there a prefix sum that makes range queries O(1)?
- [ ] Is the array/sring searchable with a sliding window?
- [ ] Does the answer have a monotonic predicate for binary search?
- [ ] Is this a shortest path? Use BFS (unweighted) or Dijkstra.
- [ ] Does it have overlapping subproblems? Apply DP.
- [ ] Does it reduce to connected components? Use Union-Find.
- [ ] Is greedy provably optimal here? (safe only with correct proof)
- [ ] Can I trim the search with early pruning / branch & bound?
- [ ] Can I use a heap to track the k best without full sort?
- [ ] Can a sort + merge replace a nested loop (e.g., intervals)?

## Common Solution Templates

### Two Pointers

```python
def two_sum_sorted(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        total = nums[lo] + nums[hi]
        if total == target:
            return [lo, hi]
        if total < target:
            lo += 1
        else:
            hi -= 1
    return []
```

### Sliding Window

```python
def max_sum_subarray(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        best = max(best, window)
    return best
```

### Binary Search on the Answer

```python
def feasible(x):
    return True

lo, hi = 1, 10**18
while lo < hi:
    mid = (lo + hi) // 2
    if feasible(mid):
        hi = mid
    else:
        lo = mid + 1
```

### Backtracking (Permutations)

```python
def permute(nums):
    result = []
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i + 1:])
            path.pop()
    backtrack([], nums)
    return result
```

### DP (Knapsack Style)

```python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)
    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]
```

## Data Structure Selection

| Need | Structure |
|------|-----------|
| Fast lookup / dedupe | Hash set, hash map |
| Insertion order preserved | List / array / deque |
| Reverse order | Stack |
| FIFO order | Queue |
| Fast access by index | Array |
| Fast insert/delete middle | Deque, linked list |
| Always min/max | Heap (priority queue) |
| Prefix queries | Prefix sum, segment tree, Fenwick |
| Word/prefix search | Trie |
| Ranges / intervals | Segment tree, interval tree |
| Connected components | Union-Find |
| Character counting | Frequency array or dict |

## Common Pitfalls

1. **Missing edge cases** — empty input, n = 1, all equal, overflow.
2. **Wrong pattern** — using DP when greedy works, or vice versa.
3. **Forgetting to reset state** between test cases.
4. **Off-by-one** in ranges, window sizes, and binary search bounds.
5. **O(n^2) hidden loops** — string concat, `in` on lists, nested scans.
6. **Integer overflow** in C/C++/Java when summing large values.
7. **Assuming unsorted data is sorted.**
8. **Not reading the full constraint** — memory limits matter too.
9. **Deep recursion** — set recursion limit or convert to iterative.
10. **Jumping to code** before designing a correct algorithm.

## Interview / Contest Tips

1. Talk through brute force first, then optimize — shows clear thinking.
2. Always ask for constraints if the interviewer does not give them.
3. Name your intent: "This is a classic sliding window problem."
4. Verify with a concrete dry run before submitting.
5. Prefer one clean, provable solution over a clever fragile one.
6. If stuck 10 minutes, switch patterns and come back later.
7. Debug by print is slow — reason about invariants instead.
8. Practice pattern flash cards until recognition is instant.