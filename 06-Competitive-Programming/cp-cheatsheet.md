# Competitive Programming Cheatsheet

Quick reference for contest strategy, complexity budgets,
templates, and data structure choices.

## Core Concepts

- **Contests are speed + accuracy** — read, pattern-match, code,
  and verify within time limits.
- **Constraints are the roadmap** — the time limit and n tell
  you the required complexity.
- **Templates save minutes** — ship fast I/O, modular, and sieve
  snippets already tested.
- **Code once, reuse everywhere** — build a personal library.
- **Python is allowed but slower** — optimize when needed.

> Typical contest time limit: 1-2 seconds per test case.
> Every language gets the same limit, so pick wisely.

## Contest Strategy

Before the contest:

- Warm up with 2-3 easy problems.
- Keep templates and snippets ready.
- Plan time: easy (10-15 min), medium (30-40 min), hard (rest).

During the contest:

1. Read ALL problems first (usually 5-8 minutes).
2. Solve the easiest one to build confidence and a score baseline.
3. For each attempt: brute force idea, note pattern, code, test.
4. Never submit unverified code; dry-run sample cases in your head.
5. If stuck 20+ min on a problem, skip it and return later.
6. Watch for multiple test cases — reset global state properly.
7. Submit only when it passes your custom edge tests too.

After the contest:

- Upsolve what you missed and read editorials.
- Store the failed pattern in your study list.

## Time Limit to Complexity Guide

```
Time limit    n max             Required complexity class
────────────────────────────────────────────────────────────
1-2 sec       10                O(n!) — brute force
1-2 sec       20-25             O(2^n) — bitmask DP
1-2 sec       100               O(n^3) — Floyd-Warshall
1-2 sec       10^3-10^4         O(n^2) — nested loops
1-2 sec       10^5-10^6         O(n log n) or O(n)
1-2 sec       10^7+             O(n) with tiny constants (C++ only)
1-2 sec       10^9+             O(log n) or O(√n) — math
```

> If n is 10^5 and the story smells like "check every pair",
> it is almost never O(n^2) — find a linear or n log n trick.

## Python Speed Notes

- Python is ~10-50x slower than C++ for the same operations.
- Budget roughly 10^7 simple ops in 2 seconds (C++: 10^8-10^9).
- Use `sys.stdin.buffer.read()` for big input.
- Prefer arrays and bitops; avoid deep recursion and O(n) slicing.
- PyPy is often faster than CPython on contests (where allowed).

## Common Snippets

### Fast I/O

```python
import sys

def solve():
    data = sys.stdin.buffer.read().split()
    it = iter(data)
    n = int(next(it))
    arr = [int(next(it)) for _ in range(n)]
    print(arr)

t = 1
if len(sys.argv) > 1:
    t = int(sys.argv[1])
for _ in range(t):
    solve()
```

Output fast path:

```python
out = []
for i in range(n):
    out.append(str(i))
sys.stdout.write("\n".join(out))
```

### Modular Arithmetic

```python
MOD = 10**9 + 7

def add(a, b): return (a + b) % MOD
def sub(a, b): return (a - b) % MOD
def mul(a, b): return (a * b) % MOD

def mod_pow(a, b, mod=MOD):
    result = 1
    while b > 0:
        if b & 1:
            result = (result * a) % mod
        a = (a * a) % mod
        b >>= 1
    return result
```

Division uses modular inverse (Fermat for prime mod):

```python
def mod_inv(x, mod=MOD):
    return mod_pow(x, mod - 2, mod)
```

### Sieve of Eratosthenes

```python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if is_prime[i]:
            for j in range(i * i, n + 1, i):
                is_prime[j] = False
    return [i for i in range(2, n + 1) if is_prime[i]]
```

### Binary Exponentiation (Same Power)

```python
def power(a, b, mod=None):
    result = 1
    while b > 0:
        if b & 1:
            result *= a
            if mod: result %= mod
        a *= a
        if mod: a %= mod
        b >>= 1
    return result
```

### GCD / LCM

```python
import math

gcd = math.gcd(12, 18)   # 6
lcm = 12 * 18 // math.gcd(12, 18)
```

## Common Data Structure Choices

| Situation | Structure | Complexity |
|-----------|-----------|------------|
| Count frequencies | dict / Counter | O(1) avg |
| Always min/max | heap | O(log n) push/pop |
| Prefix range sum | prefix sums / Fenwick | O(log n) update+query |
| Range min/max on static | sparse table / segment tree | O(1) / O(log n) |
| Ordered key access | balanced BST (sorted dict) | O(log n) |
| Connected components | Union-Find (DSU) | O(α(n)) |
| Graph shortest unweighted | BFS | O(V+E) |
| Graph weighted | Dijkstra with heap | O((V+E) log V) |
| String prefixes | Trie | O(L) per op |
| Big number math | Python int (arbitrary precision) | - |

> In Python, `bisect` gives O(log n) search in sorted lists;
> `sortedcontainers` covers balanced-tree needs when available.

## Common Number Theory Facts

- gcd(a, b) = gcd(b, a % b); lcm = a * b / gcd.
- For prime p and a%p != 0: a^(p-1) ≡ 1 (mod p) — Fermat.
- Sieve up to 10^7 is feasible in memory, not in all languages.
- Largest prime factor of n: try divisors up to √n.
- n mod 9 pattern, digit sums, palindromes in bases.
- Binary search works on monotonic predicates — the "answer" space.

## Bit Manipulation Tricks

```python
x & 1          # is odd
x & (x - 1)    # clear lowest set bit
x & -x         # lowest set bit
1 << k         # 2^k
mask & (1 << i)  # test bit i
mask | (1 << i)  # set bit i
```

```python
# Enumerate all subsets of a bitmask
def subsets(mask):
    sub = mask
    while sub:
        sub = (sub - 1) & mask
        yield sub
```

## Common Implementations Checklist

- [ ] Fast I/O (input size > 100k).
- [ ] Recursion limit raised if deep recursion used.
- [ ] Modular arithmetic for anything with large sums.
- [ ] Use arrays (`array('q')`) or lists, not string math for speed.
- [ ] Precompute factorials + inverses for combos (nCr).
- [ ] O(1) memoization maps for DP states.
- [ ] Sort once instead of sorting inside a loop.

## Common Pitfalls

1. Off-by-one in loops and binary search bounds.
2. Integer overflow in C/C++/Java with large sums.
3. Negative indices in slicing messing up window logic.
4. `a ** b` without mod on huge powers (use mod_pow).
5. Reusing global arrays between test cases without resetting.
6. Ignoring that n can be 0 or 1 (empty test cases).
7. Reading input wrong because of trailing newlines/spaces.
8. Deep recursion hitting the Python recursion limit.
9. Sorting Python lists O(n log n) per element copy — slice cheaply.
10. Submitting without running at least one custom edge case.

## Interview / Contest Tips

1. Ship tested snippets, not debug-on-the-go code.
2. Start with sample inputs always; verify output format exactly.
3. If editorial exists, upsolve within 48 hours of the contest.
4. Track personal weak patterns and drill them weekly.
5. Read the problem statement twice before coding.
6. Use 64-bit types everywhere unless told otherwise.
7. Localize variable names to the story (e.g., `a`, `b` arrays).
8. Know your language's fastest input/output idioms by heart.