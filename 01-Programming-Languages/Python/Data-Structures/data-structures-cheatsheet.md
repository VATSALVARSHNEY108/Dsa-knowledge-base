---
layout: default
title: Data Structures Cheatsheet
parent: Python
nav_order: 9
---

# Python Data Structures Cheatsheet

Quick-reference for the data structure implementations in this folder. Each entry maps
to a file under `Data-Structures/`. Snippets run with Python 3.6+.

## Available Files

| Category | File | Implementation |
| --- | --- | --- |
| Graph | `Graph/` (in algorithms) | adjacency list graph class |
| Hash Table | `HashTable/hash_map.py` | Chaining hash map, LRU cache |
| Heap | `Heap/heap.py` | MinHeap, MaxHeap, heap sort, median |
| Linked List | `LinkedList/reverse_linked_list.py` | Iterative reversal |
| Linked List | `LinkedList/merge_two_sorted_lists.py` | Merge two sorted lists |
| Linked List | `LinkedList/linked_list_cycle.py` | Floyd's cycle detection |
| Queue | `Queue/queue.py` | deque queue, priority queue, circular queue |
| Stack | `Stack/valid_parentheses.py` | Stack-based bracket matching |
| Tree | `Tree/Traversal/binary_tree_inorder_traversal.py` | Recursive + iterative inorder |

> Note: Graph and tree node classes live inside the algorithm/problem files, so check
> those for the canonical graph/tree representations.

## Built-in Collections

| Collection | Module | Declaration | Notes |
| --- | --- | --- | --- |
| list | built-in | `[1, 2, 3]` | dynamic array, ordered |
| tuple | built-in | `(1, 2)` | immutable list |
| dict | built-in | `{'k': 1}` | hash map, ordered (3.7+) |
| set | built-in | `{1, 2, 3}` | unique hash set |
| deque | `collections` | `deque()` | double-ended queue, O(1) ends |
| defaultdict | `collections` | `defaultdict(list)` | auto-default dict |
| Counter | `collections` | `Counter('aab')` | count elements |
| heapq | `heapq` | heapify/push/pop | min-heap primitives |
| array | `array` | `array('i')` | typed C arrays |
| namedtuple | `collections` | `namedtuple('P', 'x y')` | lightweight records |

> Prefer `collections.deque` over list for queue operations; prefer `heapq` for heaps —
> Python has no standalone `Heap` class.

## Core Data Structures

### Array (list)
```python
arr = [3, 1, 2]
arr.append(4)          # O(1)
arr.pop()              # O(1) last element
arr.pop(0)             # O(n) first element
arr.sort()             # in-place, stable, O(n log n)
arr[1:3]               # slice copy
```

### Linked List
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
```

### Stack
```python
stack = []
stack.append(1)        # push O(1)
stack.pop()            # pop O(1)
stack[-1]              # peek O(1)
# See valid_parentheses.py for bracket matching
```

### Queue
```python
from collections import deque

q = deque()
q.append(1)            # enqueue O(1)
q.popleft()            # dequeue O(1)
q[0]                   # peek O(1)
# Priority queue:
import heapq
pq = []
heapq.heappush(pq, (priority, item))  # O(log n)
heapq.heappop(pq)                     # O(log n)
```

### Hash Map
```python
d = {}
d['apple'] = 5         # O(1) average
d.get('apple')         # 5
d.get('missing', -1)   # default -1
'apple' in d           # membership
del d['apple']         # delete
# Chaining implementation: HashTable/hash_map.py
```

### Heap
```python
import heapq

data = [5, 3, 8, 1]
heapq.heapify(data)          # O(n) min-heap
heapq.heappush(data, 2)      # O(log n)
heapq.heappop(data)          # 1 — O(log n)
data[0]                      # peek — O(1)
# Max-heap: negate values
max_heap = [-x for x in [5, 3, 8]]
heapq.heapify(max_heap)
top = -max_heap[0]           # peek max
```

### Tree
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root, result=None):
    if result is None:
        result = []
    if root:
        inorder(root.left, result)
        result.append(root.val)
        inorder(root.right, result)
    return result
# Iterative inorder also available in binary_tree_inorder_traversal.py
```

### Graph (Adjacency List)
```python
from collections import defaultdict

class Graph:
    def __init__(self, directed=False):
        self.directed = directed
        self.adj = defaultdict(list)

    def add_edge(self, u, v, weight=1):
        self.adj[u].append((v, weight))
        if not self.directed:
            self.adj[v].append((u, weight))

    def get_neighbors(self, node):
        return self.adj[node]

    def get_nodes(self):
        nodes = set(self.adj.keys())
        for neighbors in self.adj.values():
            for v, _ in neighbors:
                nodes.add(v)
        return nodes
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| list | O(1) | O(n) | O(n) | O(n) | append amortized O(1) |
| deque | O(n) | O(n) | O(1) ends | O(1) ends | O(n) middle |
| dict | - | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| set | - | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| heap | - | O(n) | O(log n) | O(log n) | peek O(1) |
| tuple | O(1) | O(n) | n/a | n/a | immutable |
| Binary Tree | O(log n) avg | O(log n) avg | O(log n) avg | O(log n) avg | O(n) worst skewed |
| Graph | - | O(V + E) | O(1) | O(E) | adjacency list |

## Pitfalls

- `list.pop(0)` and `insert(0, x)` are O(n) — use `deque` for FIFO workloads.
- `heapq` is min-heap only; negate values (or wrap in a class) for a max-heap.
- `defaultdict(list)` and `defaultdict(int)` auto-create keys — use `in` checks when
  missing keys should be an error.
- Mutable default args (`def f(x=[])`) are shared across calls — use `None` + create.
- Sets/dicts require hashable keys; lists/dicts are unhashable.
- `dict` order is insertion order (3.7+) but don't rely on it for sorting semantics.
- `deque` indexing in the middle is O(n); only O(1) at both ends.
- Tuple unpacking mismatches raise `ValueError`; guard dynamic-length inputs.
- Iterating a dict while mutating it raises `RuntimeError`; iterate over `list(d.items())`.
- Slicing creates copies: `arr[:]` duplicates memory for large structures.
