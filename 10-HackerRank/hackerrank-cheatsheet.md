# HackerRank Cheatsheet

Quick reference for domains, scoring, question formats, and prep.

## Core Concepts

- **Platform** — Coding practice + hiring tests used by FAANG-lite.
- **Domains** — Problem Solving, Interview Prep Kits, Language
  tracks (Python, Java, C++), Databases, Linux Shell, AI, etc.
- **Scoring** — Most problems award full points for *any* passing
  solution (no time bonus, unlike Codeforces).
- **Test Types** — Coding Questions, MCQ, SQL / Database,
  Debugging tasks, Code Pair (interviews).

> HackerRank rewards correctness, not speed. Aim for a clean,
> passing solution over an "optimized" one that's wrong.

## Scoring Rules

- **Full score** = all test cases passed (hidden tests included).
- **Partial marks** — sometimes subtask based.
- **No penalty** for wrong submissions (unlike CodeChef).
- **Output format** must match exactly (spacing, newlines).

> Hidden test cases matter — test your solution on edge inputs
> before submitting.

## Skill Domains (Which to Master)

| Domain | What's Tested | Prep Focus |
|--------|---------------|------------|
| Problem Solving | Algorithms, data structures | patterns + big-O |
| Interview Prep Kit | Everything | same as interviews |
| Python / Java / C++ | Language syntax | language basics |
| SQL | Queries, joins, windows | SQL mastery |
| Databases | Schema design | normalization |
| Linux Shell | Bash / text tools | shell commands |
| AI / ML | Data science, ML basics | sklearn, pandas |
| Security | Crypto, network | security fundamentals |

## Common Question Formats

1. **Function only** — implement a given function signature.
2. **Full program** — read stdin, print result.
3. **MCQ** — multiple choice, single correct answer.
4. **SQL** — write a query against a provided schema.
5. **Debug** — fix a buggy solution.

## Python Input/Output Template

```python
from sys import stdin, stdout

# Number of test cases / queries
n = int(input())
arr = list(map(int, input().split()))

# Output via string buffer for large results
out = []
for x in arr:
    out.append(str(x * 2))
stdout.write("\n".join(out) + "\n")
```

## Typical Interview Kit Roadmap

1. Warmup — challenges to learn the submission flow.
2. Arrays & Strings — two pointers, sliding window.
3. HashMaps & Sets — frequency, lookups.
4. Sorting & Searching — binary search, comparators.
5. Stacks & Queues — monotonic stack, BFS.
6. Trees & Graphs — traversals, DFS/BFS.
7. Recursion & Backtracking.
8. Greedy & DP.
9. Linked Lists.
10. Miscellaneous — bit manipulation, math.

## Question Difficulty Labels

| Label | Typical Approach | Estimated Time |
|-------|------------------|----------------|
| Easy | Basic loop / map | 10-20 min |
| Medium | Key pattern (2ptr, binsearch) | 20-40 min |
| Hard | Multi-step / advanced pattern | 40+ min |

## Real-World Application Examples

- **Problem Solving** — algorithm design in production services.
- **SQL** — every analytics query you'll write on the job.
- **Linux shell** — server admin, automation, log greps.
- **Interview Kit** — direct preparation for coding interviews.

## Common Mistakes

1. **Not reading the input format** — parse exactly.
2. **Off-by-one** on even/odd lengths.
3. **Integer overflow** in C++/Java — use `long`.
4. **Recursion depth** — Python recursion limited (~1000).
5. **Forgetting `.strip()` / newline handling** on strings.
6. **Wrong variable names** — match the given function signature.

## Interview Prep Tips (HackerRank-Specific)

- Use the **Interview Preparation Kit** — it's free and organized.
- Practice **with hidden tests in mind** — write edge tests yourself.
- Solve same problem again next week (spaced repetition).
- **Mock test feature** mimics real hiring fair conditions.
- Track stars / solved counts to keep a habit streak.

## Quick Algorithm Reference (When You're Stuck)

```
Need fastest lookup?      → Hash map / sorted array
Need order preserved?     → Stack / Queue
Need sorted stream of k?  → Heap (Top K)
Need subarray property?   → Sliding window
Need sorted data search?  → Binary search
Need reachability?        → BFS / DFS
Need counting paths / opt → DP
Need smallest set edges   → Greedy / MST
```

## The HackerRank Workflow

```
1. Read problem FULLY (constraints define allowed complexity)
2. Understand input/output examples
3. Pick data structure + algorithm (see table above)
4. Write code, handle edge cases
5. Run sample tests → submit
6. If fails: re-read constraints, handle empty/single/large
```

## Final Tips

- Solve **daily** — even 1 easy keeps the pattern fresh.
- Aim for **all hidden test cases**, not just "it passed".
- After solving, read others' submissions for cleaner ideas.
- Great for building a **submission streak** and interview prep
  discipline.

> HackerRank is about solid, correct, readable solutions.
> Speed comes naturally once patterns are automatic.