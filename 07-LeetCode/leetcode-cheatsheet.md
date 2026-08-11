# LeetCode Cheatsheet

Quick reference for patterns, problem frequency, prep plans,
and solving checklists.

## Core Concepts

- **LeetCode is pattern-driven** — most problems reduce to a
  handful of reusable approaches.
- **Company tags matter** — the same pattern appears repeatedly
  at specific companies.
- **Speed + accuracy** — you must write clean code quickly,
  usually within 45 minutes per problem.
- **Learn by category**, not by random order — drill one pattern
  at a time.

> Target: solve 2-3 problems per pattern and review the editorial,
> not just the answer.

## How to Use Patterns

1. **Pick one pattern** (e.g., two pointers).
2. **Solve its Easy, Medium, Hard** around 5-8 problems each.
3. **Keep a pattern journal** — one line per problem: pattern +
  key trick.
4. **Review weekly** — re-solve problems you could not code cold.
5. **Simulate interview** — 45 minutes, no peeking, typed code.
6. **Space-repetition** — redo old problems before new ones.

> Never memorize problem numbers. Memorize the PATTERN and the
> signal keywords that trigger it.

## Top 50 / Top 100 Pattern List

Ranked by interview frequency:

| # | Pattern | Signature Problems |
|---|---------|--------------------|
| 1 | Group Anagrams | 49 |
| 2 | Longest Substring Without Repeating | 3 |
| 3 | Top K Frequent Elements | 347 |
| 4 | Merge Intervals | 56 |
| 5 | Two Sum | 1 |
| 6 | Number of Islands | 200 |
| 7 | Valid Parentheses | 20 |
| 8 | Best Time to Buy/Sell Stock | 121 |
| 9 | Product of Array Except Self | 238 |
| 10 | Binary Tree Level Order | 102 |
| 11 | Contains Duplicate | 217 |
| 12 | Maximum Subarray (Kadane) | 53 |
| 13 | House Robber (DP) | 198 |
| 14 | Coin Change | 322 |
| 15 | Word Search | 79 |
| 16 | Rotting Oranges / BFS grid | 994 |
| 17 | Course Schedule (topo) | 207 |
| 18 | Climbing Stairs | 70 |
| 19 | Kth Smallest in BST | 230 |
| 20 | Longest Palindromic Substring | 5 |

Extend to full Top 50/100 by adding:

- Linked list reversal (206), cycle detection (141).
- Two pointer container (11), trapping rain water (42).
- Sliding window min/max (239), shortest window (76).
- Strings: palindrome (125), valid palindrome II (680).
- Trees: invert (226), max depth (104), diameter (543).
- Heap: Kth largest (215), merge k lists (23).
- DP: LIS (300), edit distance (72), partition (416).
- Backtracking: combinations (39), permutation (46).
- Graphs: clone graph (133), flood fill (733).

## Frequency of Problem Types

Approximate share of interview coding questions:

```
Arrays / Strings        30-35%
Hash Tables / Sets      15-20%
Trees / Graphs          12-15%
Dynamic Programming     10-12%
Linked Lists             6-8%
Two Pointers / Sliding   6-8%
Heaps / Priority Queue   4-6%
Stack / Queue            4-6%
Math / Bit Manip         3-5%
Backtracking             3-5%
Misc (Trie, UF, etc.)    3-5%
```

> Arrays + Strings + Hashing + Trees + DP cover ~70% of all
> interview problems — master those first.

## Prep Plan by Company Tag

### General Timeline (12 weeks)

- Weeks 1-2: Arrays, Strings, Hashing. (200+ local leaderboards)
- Weeks 3-4: Two Pointers, Sliding Window, Linked Lists.
- Weeks 5-6: Trees, BFS/DFS, Graphs.
- Weeks 7-8: Backtracking, Stacks, Queues.
- Weeks 9-10: DP I (1D), DP II (2D), Greedy.
- Weeks 11-12: Heaps, Strings, Math, review + mocks.

### Company-Focused Tagging

| Company | Priority Tags |
|---------|---------------|
| Google | Graphs, DP, Arrays, BFS/DFS |
| Amazon | Arrays, Trees, Two Pointers, Hashing |
| Meta | Arrays, Strings, DP, Intervals |
| Microsoft | Trees, Hash, DP, Linked List |
| Apple | Arrays, Strings, DP, Recursion |
| Netflix | Arrays, Two Pointers, DP |
| Uber | Graphs, BFS/DFS, DP |

> Practice the "Most Asked" list for your target company and
> its recent 6-month tags before interview week.

## Solving Checklist (Every Problem)

- [ ] Restate the problem and constraint to the interviewer.
- [ ] List edge cases: empty, size 1, all equal, negative, dupes.
- [ ] Write a brute force and say its complexity out loud.
- [ ] Identify the pattern and state it: "This looks like...".
- [ ] Build the optimal solution; explain trade-offs.
- [ ] Dry-run on a custom example, not just the sample.
- [ ] Code with full signatures; handle null/None and 0-length.
- [ ] Walk through time and space complexity at the end.
- [ ] Ask if they want a test run against the example.

## Templates Worth Having Ready

### Fast Set/Map Counting

```python
from collections import Counter

counts = Counter(nums)
if any(v > 1 for v in counts.values()):
    return True
```

### Sliding Window (Variable Length)

```python
left = 0
best = 0
window = set()
for right in range(len(s)):
    while s[right] in window:
        window.remove(s[left])
        left += 1
    window.add(s[right])
    best = max(best, right - left + 1)
```

### Two Pointer On Sorted Array

```python
left, right = 0, len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    if total == target:
        return [left, right]
    if total < target:
        left += 1
    else:
        right -= 1
```

### BFS Grid

```python
from collections import deque

def bfs(grid, start):
    rows, cols = len(grid), len(grid[0])
    q = deque([start])
    seen = {start}
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols
                    and (nr, nc) not in seen):
                seen.add((nr, nc))
                q.append((nr, nc))
```

> Copy these four templates and adapt; most problems are one of
> these with a twist.

## Common Pitfalls

1. Jumping to code before stating the brute force.
2. Only testing the sample input.
3. Ignoring constraints that point to O(1) or O(log n).
4. Verbose over-cleaving code — keep it clean but not overbuilt.
5. Using `in` on lists where a hash set is O(1).
6. Off-by-one in window/range bounds.
7. Not handling `None`/empty vs length-1 cases.
8. Forgetting to reset visited state between BFS/DFS calls.
9. Deep recursion on grids (use iterative BFS).
10. Panic — a 5-minute pattern review beats coding blind.

## Interview / Contest Tips

1. Speak your logic first; the interviewer grades reasoning.
2. Time-box: 10 min to pattern, 25 min to code, 10 min to verify.
3. If the first pattern fails, try the second, not unlimited code.
4. Mock interviews weekly with a timer.
5. Do company tags in review mode one month before interviews.
6. Always end with the time/space complexity of your code.