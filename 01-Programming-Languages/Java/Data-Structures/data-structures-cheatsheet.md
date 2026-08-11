---
layout: default
title: Data Structures Cheatsheet
parent: Java
nav_order: 4
---

# Java Data Structures Cheatsheet

> Quick reference for data structure implementations in `Java/Data-Structures/`.
> Java's `java.util` framework covers most structures; the folder also contains
> hand-rolled examples for learning.

## Built-in Collections

| Collection | Interface / Class | Notes |
|---|---|---|
| Array | `int[]`, `T[]` | Fixed size, primitive-friendly |
| List | `ArrayList` | Dynamic array, O(1) tail append |
| List | `LinkedList` | Doubly linked list |
| Deque / Stack | `ArrayDeque`, `Deque` | Use as stack/queue |
| Queue | `LinkedList`, `PriorityQueue` | FIFO / heap |
| Priority queue | `PriorityQueue` | Min-heap by default |
| Map | `HashMap`, `TreeMap` | Hash / sorted |
| Set | `HashSet`, `TreeSet` | Hash / sorted unique keys |
| Hashtable | `Hashtable` | Legacy, synchronized |
| Vector | `Vector` | Legacy, synchronized list |

> Prefer `Deque` over the legacy `Stack` class, and `HashMap`/`ArrayList` over
> their synchronized legacy counterparts.

## Available Implementations

| Folder | File | Data structure |
|---|---|---|
| Graph | `Graph/GraphAdjacencyList.java` | Graph + DFS traversal |
| HashTable | `HashTable/HashMapImpl.java` | Hash map (separate chaining) |
| Heap | `Heap/KthLargest.java` | Min-heap (PriorityQueue) |
| LinkedList | `LinkedList/ReverseLinkedList.java` | Singly linked list reverse |
| LinkedList | `LinkedList/LinkedListCycle.java` | Cycle detection (Floyd) |
| LinkedList | `LinkedList/MergeTwoSortedLists.java` | Merge two sorted lists |
| Queue | `Queue/QueueUsingStacks.java` | Queue built from two stacks |
| Stack | `Stack/ValidParentheses.java` | Deque-based stack |
| Tree | `Tree/BinaryTreeTraversal.java` | Inorder/preorder/postorder |
| Tree | `Tree/MaxDepth.java` | Maximum depth of a tree |

## Array

Fixed size; O(1) random access, O(n) insert/delete.

```java
int[] arr = new int[10];
int x = arr[2];
Arrays.sort(arr);
```

## List (ArrayList / LinkedList)

```java
List<Integer> list = new ArrayList<>();
list.add(10);          // O(1) amortized
int x = list.get(0);   // O(1) for ArrayList, O(n) for LinkedList
list.remove(0);
```

> Use `LinkedList` only when you need O(1) middle insertion/deletion with an
> iterator; `ArrayList` wins almost everywhere else.

## Stack

`Deque` + `ArrayDeque` (see `Stack/ValidParentheses.java`):
```java
Deque<Character> stack = new ArrayDeque<>();
stack.push('(');         // push
char c = stack.peek();   // peek
char top = stack.pop();  // pop
boolean empty = stack.isEmpty();
```

## Queue

FIFO via `LinkedList` or `ArrayDeque`; the folder shows a queue built from two
stacks (`Queue/QueueUsingStacks.java`) as an exercise.
```java
Queue<Integer> q = new LinkedList<>();
q.offer(1);              // enqueue (returns false if full)
int x = q.peek();        // peek (null if empty)
q.poll();                // dequeue (null if empty)
```

## Hash Map

`HashMap` for production (O(1) average); the folder hand-rolls separate chaining
with buckets of entries (see `HashTable/HashMapImpl.java`).
```java
Map<String, Integer> m = new HashMap<>();
m.put("apple", 5);                // insert / update
int v = m.getOrDefault("apple", 0);
boolean has = m.containsKey("apple");
m.remove("apple");
```

## Heap / Priority Queue

`PriorityQueue` is a min-heap by default (see `Heap/KthLargest.java`):
```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(num);                    // push
int top = minHeap.peek();              // peek smallest
minHeap.poll();                        // pop smallest

PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());   // max-heap
```

## Tree

Binary tree node with traversals (see `Tree/BinaryTreeTraversal.java`):
```java
static class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

List<Integer> inorder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    inorderHelper(root, result);
    return result;
}

private void inorderHelper(TreeNode node, List<Integer> result) {
    if (node == null) return;
    inorderHelper(node.left, result);
    result.add(node.val);
    inorderHelper(node.right, result);
}
```

Max depth (see `Tree/MaxDepth.java`):
```java
int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

## Graph

Adjacency list using a `Map` (see `Graph/GraphAdjacencyList.java`):
```java
Map<Integer, List<Integer>> adj = new HashMap<>();
adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
adj.computeIfAbsent(v, k -> new ArrayList<>()).add(u);
```

## Complexity Quick Reference

| Operation | ArrayList | LinkedList | Stack | Queue | HashMap | PriorityQueue |
|---|---|---|---|---|---|---|
| Access / peek | O(1) | O(n) | O(1) | O(1) | O(1)* | O(1) |
| Search | O(n) | O(n) | O(n) | O(n) | O(1)* | O(n) |
| Insert | O(1) tail | O(1) | O(1) | O(1) | O(1)* | O(log n) |
| Delete | O(n) | O(1) | O(1) | O(1) | O(1)* | O(log n) |

*Average with a good hash function; worst case O(n).

| Structure | Space |
|---|---|
| HashMap | O(n) |
| Binary tree | O(n) |
| Graph (adjacency list) | O(V + E) |

## Pitfalls

- `HashMap` iteration order is unspecified; use `TreeMap`/`LinkedHashMap` for
  ordering.
- `PriorityQueue` does not allow null and is not a "queue" - do not rely on
  FIFO order when priorities tie.
- Autoboxing: `Map<Integer, Integer>` allocates objects; prefer primitive
  libraries (`Int2IntMap`, trove) for hot loops.
- Legacy `Stack`/`Vector` are synchronized and slow; use `ArrayDeque`/`ArrayList`.
- `remove` while iterating requires an `Iterator` (or `removeIf`), or you get
  `ConcurrentModificationException`.
- The `Deque`/`Queue` API returns `null` on empty peeks - distinguish "empty"
  from "contains null" (though null is not allowed in most impls).
- `ArrayList.remove(index)` vs `remove(Object)` - a subtle but classic bug.
