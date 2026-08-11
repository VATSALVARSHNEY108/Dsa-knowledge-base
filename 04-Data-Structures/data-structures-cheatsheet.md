---
layout: default
title: Data Structures Cheatsheet
parent: Data Structures
nav_order: 1
---

# Data Structures Cheatsheet

Master quick-reference for choosing and implementing the core
data structures used in interviews and real systems.

## Quick Choice Guide

| Need This Behavior | Use This Structure | Why |
|-------------------|--------------------|-----|
| Fast random access by index | Array | O(1) access |
| Frequent insert/delete anywhere | Linked List | O(1) at known node |
| Last in, first out | Stack | LIFO |
| First in, first out | Queue | FIFO |
| Fast lookup by key | Hash Map / Set | O(1) avg |
| Ordered keys + range queries | Tree (BST/AVL) | O(log n) |
| Always get min/max fast | Heap | O(1) peek |
| Prefix matching / autocomplete | Trie | O(L) per word |
| Relationships between items | Graph | Nodes + edges |
| Merge sets / connectivity | Union-Find | Near O(1) |

## Complexity Overview

| Structure | Access | Search | Insert | Delete | Space |
|-----------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| Dynamic Array | O(1) | O(n) | O(1)* | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1) | O(1) | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash Table | O(1)* | O(1)* | O(1)* | O(1)* | O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Heap | O(n) | O(n) | O(log n) | O(log n) | O(n) |
| Trie | O(L) | O(L) | O(L) | O(L) | O(ALPH*N*L) |
| Graph (adj list) | O(1) | O(V+E) | O(1) | O(1) | O(V+E) |

*Amortized / average case.

## Language Built-ins

| Structure | Python | Java | C++ | JS |
|-----------|--------|------|-----|-----|
| Dynamic array | `list` | `ArrayList` | `vector` | `Array` |
| Hash map | `dict` | `HashMap` | `unordered_map` | `Map` |
| Hash set | `set` | `HashSet` | `unordered_set` | `Set` |
| Stack | `list`/`deque` | `ArrayDeque` | `stack` | `Array` |
| Queue | `collections.deque` | `ArrayDeque` | `queue` | custom |
| Min heap | `heapq` | `PriorityQueue` | `priority_queue` | `MinHeap` |
| Sorted set | no | `TreeSet` | `set` | no |

## One-Line Patterns

```python
# Stack (Python)
stack.append(x)  # push
stack.pop()      # pop
stack[-1]        # peek

# Queue via collections.deque
from collections import deque
q = deque()
q.append(x)      # enqueue
q.popleft()      # dequeue

# Min heap
import heapq
heapq.heappush(h, x)
heapq.heappop(h)
```

## Real-World Application Examples

- **Arrays** — pixel buffers, tables, lookup grids.
- **Hash maps** — user sessions, caching, dictionaries.
- **Stacks** — undo/redo, browser back, expression parsing.
- **Queues** — print spooling, task scheduling, BFS.
- **Heaps** — priority queues, top-K, Dijkstra.
- **Tries** — autocomplete, spell check, IP routing.
- **Graphs** — social networks, maps, dependency graphs.
- **Union-Find** — friend groups, network connectivity.

## Choosing Between Similar Options

- **Array vs Linked List**: array if you mostly read; linked list
  if you mostly insert/delete at ends.
- **Stack vs Queue**: LIFO vs FIFO — reverse vs arrival order.
- **Hash map vs BST**: unordered fast lookup vs sorted/range.
- **Heap vs sorted array**: heap if you only need min/max;
  sorted array if you need full sorted order.
- **Array vs deque for queue**: deque never shifts; array shifts.

## Common Pitfalls

1. **Stack overflow** — deep recursion with stack-based data.
2. **Hash collision attacks** — use safe hash in adversarial input.
3. **Off-by-one** in array indices; heap is 0-indexed with
   children `2i+1`, `2i+2`.
4. **Memory** — linked lists cost pointer overhead; arrays may
   overallocate (capacity > size).
5. **Mutable keys** — never modify a hash key after insert.

## Interview Checklist

```
□ State the complexity of every operation you use
□ Know at least 2 structures for any given problem
□ Mention space as well as time
□ Ask: does this need order? uniqueness? range queries?
□ Consider preprocessing (sort, hash, prefix sums)
```

> Pick the data structure FIRST; the algorithm often follows
> naturally from your choice.