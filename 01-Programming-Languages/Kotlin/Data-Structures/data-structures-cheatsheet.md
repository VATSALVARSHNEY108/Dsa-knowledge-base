---
layout: default
title: Data Structures Cheatsheet
parent: Kotlin
nav_order: 4
---

# Kotlin Data Structures Cheatsheet

Quick-reference for the data structure implementations in this folder. Each entry maps
to a file under `Data-Structures/`. Snippets compile and run with Kotlin/JVM.

## Available Files

| Category | File | Implementation |
| --- | --- | --- |
| Graph | `graph_adjacency_list.kt` | Adjacency list graph class |
| Hash Table | `hash_map.kt` | Hash map with chaining |
| Heap | `kth_largest.kt` | PriorityQueue Kth largest |
| Linked List | `reverse_linked_list.kt` | Iterative reversal |
| Linked List | `merge_two_sorted_lists.kt` | Merge two sorted lists |
| Linked List | `linked_list_cycle.kt` | Floyd's cycle detection |
| Queue | `queue_using_stacks.kt` | Queue built from two stacks |
| Stack | `valid_parentheses.kt` | Stack-based bracket matching |
| Tree | `binary_tree_traversal.kt` | Inorder/preorder/postorder |
| Tree | `max_depth.kt` | Max depth of a tree |

## Built-in Collections

| Collection | Declaration | Key Operations |
| --- | --- | --- |
| List | `listOf(1, 2)` | `get`, `size`, `contains`, immutable |
| MutableList | `mutableListOf(1, 2)` | `add`, `remove`, `set`, `clear` |
| Array | `arrayOf(...)` | fixed size, mutable elements |
| Set | `setOf(...)` | `contains`, `intersect`, unique |
| Map | `mapOf(1 to "a")` | `get`, `keys`, `values`, immutable |
| ArrayDeque | `ArrayDeque<Int>()` | `addFirst`, `addLast`, `removeFirst` |
| LinkedList | `LinkedList<Int>()` | JVM doubly-linked list |

> Kotlin defaults to immutable collections (`listOf`, `mapOf`, `setOf`). Use the
> `mutable*` variants when modifying in place. Java collections are available via
> `java.util.*`.

## Core Data Structures

### Array
```kotlin
val arr = intArrayOf(3, 1, 2)
arr.sort()               // in-place, O(n log n)
val sorted = arr.sorted() // returns new list
arr.copyOfRange(0, 2)    // subarray copy
```

### Linked List
```kotlin
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}
// Iterative reversal
fun reverseList(head: ListNode?): ListNode? {
    var prev: ListNode? = null
    var curr = head
    while (curr != null) {
        val next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
}
```

### Stack
```kotlin
val stack = ArrayDeque<Int>()
stack.push(1)          // O(1)
val top = stack.pop()  // O(1)
val peek = stack.peek() // O(1)
// Also works with java.util.Stack / ArrayDeque
```

### Queue
```kotlin
class QueueUsingStacks {
    private val `in` = ArrayDeque<Int>()
    private val out = ArrayDeque<Int>()
    fun enqueue(x: Int) { `in`.push(x) }
    fun dequeue(): Int {
        if (out.isEmpty()) while (`in`.isNotEmpty()) out.push(`in`.pop())
        return out.pop()
    }
    fun isEmpty() = `in`.isEmpty() && out.isEmpty()
}
```

### Hash Map
```kotlin
val map = mutableMapOf<String, Int>()
map["apple"] = 5        // or map.put("apple", 5)
map["apple"]            // 5 — O(1) average
map.containsKey("banana")
map.remove("apple")
// See hash_map.kt for a chaining implementation
```

### Heap (Priority Queue)
```kotlin
import java.util.*
// Min-heap (default)
val minHeap = PriorityQueue<Int>()
minHeap.offer(3)        // O(log n)
minHeap.peek()          // O(1) smallest
minHeap.poll()          // O(log n) smallest
// Max-heap
val maxHeap = PriorityQueue<Int>(compareByDescending { it })
```

### Tree
```kotlin
class TreeNode(var `val`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}
// Max depth
fun maxDepth(root: TreeNode?): Int {
    if (root == null) return 0
    return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
}
// Inorder traversal
fun inorder(root: TreeNode?): List<Int> {
    val result = mutableListOf<Int>()
    fun helper(node: TreeNode?) {
        if (node == null) return
        helper(node.left)
        result.add(node.`val`)
        helper(node.right)
    }
    helper(root)
    return result
}
```

### Graph (Adjacency List)
```kotlin
class GraphAdjacencyList {
    private val adj = mutableMapOf<Int, MutableList<Int>>()
    fun addVertex(v: Int) { adj.putIfAbsent(v, mutableListOf()) }
    fun addEdge(u: Int, v: Int) {
        adj.putIfAbsent(u, mutableListOf())
        adj.putIfAbsent(v, mutableListOf())
        adj[u]!!.add(v)
        adj[v]!!.add(u)
    }
    fun getNeighbors(v: Int) = adj[v] ?: emptyList()
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) | contiguous, index access |
| List | O(n) | O(n) | O(n) | O(n) | ArrayList-backed |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | *at known node/head |
| Stack | - | O(n) | O(1) | O(1) | LIFO push/pop |
| Queue | - | O(n) | O(1) | O(1) | FIFO |
| Hash Map | - | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| Heap | - | O(n) | O(log n) | O(log n) | peek O(1) |
| Binary Tree | O(log n) avg | O(log n) avg | O(log n) avg | O(log n) avg | O(n) worst |
| Graph | - | O(V + E) | O(1) | O(E) | via adjacency list |

## Pitfalls

- Immutable vs mutable: `listOf` cannot be modified; compile-time errors instead of
  runtime surprises.
- `ArrayDeque` push/pop in Kotlin operates at the front (unlike `Stack` append) —
  verify intended order.
- `map[key]` returns null for missing keys; `map[key]!!` throws NPE — prefer
  `map.getOrDefault(key, default)`.
- `PriorityQueue` iterates in unspecified order — always poll to consume in priority order.
- `putIfAbsent` plus `!!` forces non-null; guard against missing vertices before
  `addEdge` on isolated nodes.
- `sorted()` returns a new list; `sort()` mutates — mixing these silently loses changes.
- Linked list `next!!` and smart-casts: nullable `next` requires safe calls (`?.`).
- Deep recursion on trees can overflow the JVM stack; convert to an explicit stack loop.
- Kotlin/Java strings are immutable; building strings in loops should use `StringBuilder`.
