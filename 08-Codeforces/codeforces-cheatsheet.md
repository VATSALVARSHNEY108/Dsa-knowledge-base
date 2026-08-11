---
layout: default
title: Codeforces Cheatsheet
parent: Codeforces
nav_order: 1
---

# Codeforces Cheatsheet

Quick reference for rating tiers, problem types, contest format,
and scoring basics.

## Core Concepts

- **Codeforces rating** reflects contest performance across Div 1
  and Div 2 rounds.
- **Div 2 vs Div 1** separates problem difficulty and player pools;
  new users register for Div 2 or Div 1 based on rating.
- **Contest format** — 5-8 problems, ~2 hours, 1 point each solve,
  penalty of ~10 minutes per incorrect submission.
- **Ratings update** after every rated round based on rank within
  expected performance range.
- **Standings** are ordered by number of solved problems, then by
  total penalty time.

> Your next goal is usually: beat the Median, then climb a full
> rating tier. Consistency beats one lucky round.

## Rating Tiers and Skills

| Rating | Tier | What You Can Solve | Focus To Grow |
|--------|------|--------------------|---------------|
| 1200-1399 | Pupil | Div 2 A easily, B sometimes | Speed, edge cases |
| 1400-1599 | Specialist | Div 2 B / C early | Pattern recognition |
| 1600-1899 | Expert | Div 2 C/D, Div 1 A/B | DP, graphs, math |
| 1900-2099 | Candidate Master | Div 1 A/B/C | Advanced algorithms |
| 2100-2299 | Master | Div 1 B/C | Hard DP, geometry |
| 2300-2399 | International Master | Div 1 C/D+ | Very hard combinatorics |

> Rating floor: first contest ~1500. Improving one full tier
> usually takes 2-4 months of focused upsolving.

## Rating Lookup (target of someone)

| Approx | Codeforces Tags |
|--------|-----------------|
| 1200 | greedy, math, brute force, implementation |
| 1400 | binary search, two pointers, DP basics |
| 1600 | bitmasks, graphs, number theory, DFS/BFS |
| 1800 | segment trees, advanced DP, flows (intro) |
| 2000+ | everything, fast + accurate |

## Problem Types by Tag

| Tag | What It Tests | Typical Difficulty |
|-----|---------------|--------------------|
| Implementation | Careful translation of rules | A/B |
| Math | Number theory, modular, combinatorics | A-C |
| Greedy | Local decisions with proof | B/C |
| Binary Search | Monotonic predicates | C |
| Two Pointers | Sorted array interactions | B/C |
| DP | Overlapping subproblems | C/D |
| Graph (BFS/DFS) | Reachability, shortest path | C/D |
| Graph (MST/Dijkstra) | Weighted problems | D |
| Segment Trees / Fenwick | Range updates/queries | D/E |
| Bitmasks | Subset enumeration, xor tricks | C/E |
| Game Theory | Winning/losing positions | D/E |

> Read the tag list after solving; it teaches the "scent" of a
> problem before you memorize solutions.

## Contest Strategy: Div 2

- High priority: solve A, B, C quickly and correctly.
- Read A and B first; skip hard C to secure A+B bank.
- After A/B, if DP appears in C, decide based on time remaining.
- Wrong submissions add penalty — verify with a dry-run instead.
- O(1) or O(n) with edge cases beats a smart O(n^2) that fails.

## Contest Strategy: Div 1

- Problems are hard from the start; speed is less important than
  correctness.
- Aim for 1-2 solid problems rather than risky guesses.
- Use your library and templates; do not reinvent standard
  structures mid-contest.
- Hacks/System tests punish fragile assumptions — prove first.

## Scoring and Standings Quick Reference

```
Score = solved problems (each = 1 point)
Penalty = sum of (time solved in minutes + 10 per wrong submission)
Ranking: most problems solved, lower total penalty wins

Example: solve 3 problems at 10, 35, 60 minutes with 1 wrong
         each => penalty = 20 + 45 + 70 = 135 minutes
```

Formulas like Elo:

- Expected performance from your rating and the field.
- Beat expected => rating up; miss expected => rating down.
- Solving "harder than your rating" problems amplifies the delta.

## Format Quick Reference

| Feature | Div 1 | Div 2 |
|---------|-------|-------|
| Problems | 5-6 | 5-8 |
| Duration | 2h | 2h-3h |
| A-easy | No | Yes |
| Top raters | 2100+ | <1900 mostly |
| Strategy | Depth+accuracy | Speed+accuracy (A/B/C) |

## Common Implementations Snippets

### Fast Input (Python)

```python
import sys

def ints():
    return map(int, sys.stdin.buffer.read().split())

n, m = ints()
a = list(ints())
```

### Modparse for Combinatorics

```python
MOD = 10**9 + 7
n, k = ...    # read values
fact = [1] * (n + 1)
for i in range(1, n + 1):
    fact[i] = fact[i - 1] * i % MOD
```

### Binary Search Template

```python
def ok(x):
    return True

lo, hi = 1, 10**18
while lo < hi:
    mid = (lo + hi) // 2
    if ok(mid):
        hi = mid
    else:
        lo = mid + 1
print(lo)
```

### BFS on Grid

```python
from collections import deque

def bfs(start, grid):
    rows, cols = len(grid), len(grid[0])
    q = deque([start])
    dist = {(start): 0}
    while q:
        r, c = q.popleft()
        for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in dist:
                dist[(nr, nc)] = dist[(r, c)] + 1
                q.append((nr, nc))
    return dist
```

## Common Pitfalls

1. Rushing A/B and getting a Wrong Answer with no sample test.
2. Not checking large-input overflow (use Python int, or 64-bit C++).
3. Off-by-one in loops, especially 1-indexed problems.
4. Forgetting modulo after multiplications in combinatorics.
5. Reusing arrays between test cases without clearing them.
6. Sorting Python lists in hot loops with O(n log n) per iteration.
7. Ignoring the possibility of TLE: Python needs more clever
   algorithms than C++ for the same limit.
8. Submitting code that passes samples but fails custom primitives.
9. Panicking after one wrong answer; penalties add up.

## Improvement Tips

1. Upsolve (solve after the contest) every problem you missed within
   2-3 days — that is the highest-ROI practice.
2. Read editorials only after 20+ minutes of own attempts.
3. Keep a personal library: I/O, modular, NTT-like basics, graph
   templates, segment tree, Fenwick.
4. Simulate contests weekly with a timer and untimed upsolve.
5. Track wrong-answer reasons; fix recurring causes (overflow,
   bounds, init).

> Improvement is compounding: 30 minutes of upsolving every day
> beats 5 hours on the weekend.