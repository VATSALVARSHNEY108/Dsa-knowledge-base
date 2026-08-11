# CodeChef Cheatsheet

Quick reference for contests, ratings, problem types, and strategy.

## Core Concepts

- **Contest Types** — Starters (weekly), Long Challenge, Cook-Off,
  Lunchtime, DSA Learning Series.
- **Rating** — Your CodeChef rating ranges 0 to ~2800+.
  Higher = better rank in contests.
- **Divisions** — Based on rating; Division 1 (top),
  Division 2, Division 3, Division 4 (newcomers).
- **Submission Status** — AC (Accepted), WA, TLE, RE, CE. No penalty
  for WA/TLE, only for wrong answer (10 min) and skip (20 min).

> CodeChef scores problems by relative difficulty and starts
> everyone at the same base; solving quickly matters.

## CodeChef Contest Types

| Contest | Frequency | Duration | Best For |
|---------|-----------|----------|----------|
| Starters | Weekly | 2-3 hrs | Fast-paced practice, ratings |
| Long Challenge | Monthly | 10 days | Hard problem depth |
| Cook-Off | Monthly | 2.5 hrs | Speed + accuracy under time |
| Lunchtime | Monthly | 3 hrs | Ranking improvement |
| DSA Learning Series | Ongoing | Self-paced | Structured beginner flow |

## Rating Tiers

| Rating | Tier | What It Means |
|--------|------|---------------|
| 0-1000 | Newbie | Getting familiar with contests |
| 1000-1400 | Pupil | Solving easy/medium starters |
| 1400-1600 | Specialist | Consistent middle-rank finishes |
| 1600-1900 | Expert | Strong Div 2 performance |
| 1900-2200 | Candidate Master | Top Div 1 / Div 2 competitor |
| 2200-2400 | Master | National-level competitor |
| 2500+ | International Master | Elite global level |

## Scoring and Problem Marking

- **Easy Problems** (~100 pts): Basic math, simulation, arrays.
- **Medium Problems** (~200-300 pts): Greedy, binary search, DP.
- **Hard Problems** (~500+ pts): Advanced graphs, combinatorics,
  data structures, heavy math.
- **Partial scoring**: Some problems award partial marks for
  subtasks (common in Long Challenge).

## CodeChef Problem Types

| Problem Type | Typical Approach | Common Tags |
|-------------|------------------|-------------|
| Ad-hoc / simulation | Straight implementation | arrays, strings |
| Math / number theory | Mod arithmetic, GCD | primes, divisors |
| Two pointers / sliding | Expand-contract window | subarray, range |
| Binary search | Choose the boolean predicate | arrays, graphs |
| Greedy | Pick best local choice | activities, sorting |
| Dynamic programming | Define dp[] state & transition | knapsack, dp |
| Graphs | BFS/DFS, Dijkstra, DSU | connectivity, flow |

## Binary Exponentation (Modulo)

```python
MOD = 10**9 + 7

def power(base, exp):
    base %= MOD
    result = 1
    while exp > 0:
        if exp & 1:
            result = result * base % MOD
        base = base * base % MOD
        exp >>= 1
    return result
```

## Fast Input (Python)

```python
import sys
input = sys.stdin.readline

t = int(input())
while t:
    n = int(input())
    arr = list(map(int, input().split()))
    # solve ...
    t -= 1
```

> For heavy IO use `sys.stdout.write` with a string buffer.

## Intro to Starters Strategy

1. Read all 4-6 problems in the first few minutes.
2. Solve the easiest problem(s) first for guaranteed points.
3. Allocate remaining time to the hardest one you can attempt.
4. Never leave a problem unread — sometimes you spot the trick.
5. After the contest, solve everything you missed for growth.

## Contest Readiness Checklist

```
BEFORE CONTEST
□ Refresh templates (fast IO, mod, gcd)
□ Review previous mistakes list
□ Keep language docs/cheatsheet open
□ Sleep well (typing speed drops fast)

DURING CONTEST
□ Read all problems, note the easy wins
□ Skip to next problem after 20 min stuck
□ Test edge cases before submitting
□ Submit as soon as logic is proven

AFTER CONTEST
□ Solve unsolved problems by next day
□ Add new patterns to this cheatsheet
□ Track rating change and streak
```

## Common Pitfalls

1. **Wrong mod when `N` is huge** — apply mod at every step.
2. **TLE due to Python** — optimize loops, use fast IO.
3. **Oversized arrays** — always bound memory to constraints.
4. **Missing edge cases** — n=1, empty input, large inputs.
5. **Overflow** — Python is safe, but C++/Java may need long.
6. **TL (Time Limit)** — check your approach is O(N) or O(N log N).

## CodeChef Tips (Quick)

- Practice **Starters** weekly — they match real contest pace.
- Use **subtasks** to earn partial marks on hard problems.
- Read editorial after each contest. It's the fastest teacher.
- **Not solving = learning zero**; two problems solved well
  beats a full attempt with nothing.

## Real-World Applications (Why You Practice)

- **Algorithms in products** — search, ranking, scheduling.
- **Optimization** — finding the fastest/lowest-cost path.
- **Problem decomposition** — breaking thorny bugs into
  provable small steps.
- The same patterns appear in interviews, so every contest
  is also interview practice.

> CodeChef measures progress with rating, but your real skill
> grows in editorials, upsolving, and consistency.

## Quick Revision

```
Fast IO  → sys.stdin.readline
Modulo   → base ** exp % MOD via exponentiation
GCD      → math.gcd / __gcd
Binary   → while lo < hi: mid = (lo + hi + 1) // 2
Sorting  → sorted(arr), arr.sort()
Set/Map  → set(), dict()
Heap     → heapq push / pop
```

## Learning Path

1. Solve all "easy" tags to establish basics.
2. Attempt one medium per week using this cheatsheet.
3. After each contest, upsolve 2 problems (editorial → code).
4. Reading editorials then rewriting from scratch is the key
   fluency exercise.