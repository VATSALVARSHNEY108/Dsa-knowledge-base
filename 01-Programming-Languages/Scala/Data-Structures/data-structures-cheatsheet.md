---
layout: default
title: Data Structures Cheatsheet
parent: Scala
nav_order: 4
---

# Scala Data Structures Cheatsheet

Quick-reference for core data structures in Scala. Companion code lives in
`Scala/Data-Structures/` under `LinkedList/`, `Stack/`, `Queue/`, `HashTable/`,
`Heap/`, `Tree/`, and `Graph/`.

> Scala ships a rich collection hierarchy. Prefer the immutable variants
> (`List`, `Vector`, `Map`, `Set`) by default; reach for `mutable.*`
> when you need in-place updates or performance-sensitive hot loops.

## Built-in Collections

| Collection | Example | Notes |
| ---------- | ------- | ----- |
| `List[A]` | `List(1, 2, 3)` | Immutable, O(1) head/prepend |
| `Vector[A]` | `Vector(1, 2, 3)` | Immutable, O(log n) index/update |
| `Array[A]` | `Array(1, 2, 3)` | Mutable, O(1) index |
| `ArrayBuffer[A]` | `mutable.ArrayBuffer(1)` | Mutable, O(1) append |
| `Map[K, V]` | `Map("a" -> 1)` | Immutable, O(log n) avg |
| `mutable.Map[K, V]` | `mutable.Map("a" -> 1)` | Mutable, O(1) avg (hash) |
| `Set[A]` | `Set(1, 2, 3)` | Immutable, uniqueness |
| `mutable.Queue[A]` | `mutable.Queue(1)` | FIFO, O(1) enqueue/dequeue |
| `mutable.Stack[A]` | `mutable.Stack(1)` | LIFO |
| `PriorityQueue[A]` | `mutable.PriorityQueue(1)` | Heap (max by default) |
| `Option[A]` | `Some(1)` / `None` | Nullable value |
| `String` | `"abc"` | Immutable sequence of chars |

```scala
val list = List(1, 2, 3)
list.head                // 1
list.tail                // List(2, 3)
val mapped = list.map(_ * 2)   // List(2, 4, 6)

val m = mutable.Map[String, Int]()
m("a") = 1               // insert / update
m.getOrElse("b", 0)      // 0

val q = mutable.Queue(1)
q.enqueue(2)
q.dequeue()              // 1
```

> Prefer `immutable.Vector` for random access; `List` shines for
> recursive algorithms with head/tail pattern matching.

## Array / Vector

Mutable `Array` for indexed in-place work; immutable `Vector` for safe
functional code.

```scala
val arr = Array.fill(3, 3)(0)     // 2-D matrix
val vec = Vector(1, 2, 3)
vec(1)                   // 2
vec.updated(1, 9)        // new Vector, original unchanged
```

## Linked List

Available in repo: `LinkedList/ReverseLinkedList.scala`,
`LinkedList/MergeTwoSortedLists.scala`, `LinkedList/LinkedListCycle.scala`.
Scala's immutable `List` is itself a singly linked list.

```scala
case class ListNode(var value: Int, var next: ListNode = null)

def reverse(head: ListNode): ListNode = {
  var prev: ListNode = null
  var cur = head
  while (cur != null) {
    val nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
  }
  prev
}
```

> Scala's `List` gives you a linked list for free with `::` (cons) and
> pattern matching: `case head :: tail => ...`.

## Stack

Available in repo: `Stack/ValidParentheses.scala`. Use `mutable.Stack`
or a `List` acting as an immutable stack.

```scala
val stack = mutable.Stack[Char]()
stack.push('(')
stack.top            // peek
stack.pop()

def validParentheses(s: String): Boolean = {
  val stack = mutable.Stack[Char]()
  for (ch <- s) {
    ch match {
      case '(' | '[' | '{' => stack.push(ch)
      case ')' => if (stack.pop() != '(') return false
      case ']' => if (stack.pop() != '[') return false
      case '}' => if (stack.pop() != '{') return false
      case _   => ()
    }
  }
  stack.isEmpty
}
```

## Queue

Available in repo: `Queue/QueueUsingStacks.scala`. `mutable.Queue` is the
direct answer; the repo example builds one from two stacks to show the
classic technique.

```scala
val q = mutable.Queue[Int]()
q.enqueue(1)
q.enqueue(2)
q.dequeue()      // 1
q.head           // peek
```

## Hash Map

Available in repo: `HashTable/HashMap.scala` (custom implementation).
Stdlib `mutable.Map` is a hash map with O(1) average access.

```scala
val counts = mutable.Map[String, Int]().withDefaultValue(0)
counts("a") += 1            // auto-insert 0 then increment

val index = mutable.Map[Int, Int]()
index(target - num) = i     // two-sum pattern

// Immutable, FP style
val m2 = Map("a" -> 1)
m2.get("a")                 // Some(1)
m2.getOrElse("z", 0)        // 0
m2.updated("b", 2)          // new map
```

> `withDefaultValue` avoids `NoSuchElementException` but does not add the
> key to the map — `get` still returns the default only on missing keys.

## Heap / Priority Queue

Available in repo: `Heap/KthLargest.scala` (custom min-heap). Stdlib
`mutable.PriorityQueue` is a max-heap by default.

```scala
import scala.collection.mutable.PriorityQueue

val maxHeap = PriorityQueue(3, 1, 4, 1, 5)
maxHeap.dequeue()            // 5

// Min-heap via ordering reversal
val minHeap = PriorityQueue(3, 1, 4)(Ordering.Int.reverse)
minHeap.dequeue()            // 1
```

## Tree

Available in repo: `Tree/BinaryTreeTraversal.scala`, `Tree/MaxDepth.scala`.

```scala
case class TreeNode(value: Int, left: TreeNode = null, right: TreeNode = null)

def maxDepth(root: TreeNode): Int =
  if (root == null) 0
  else 1 + math.max(maxDepth(root.left), maxDepth(root.right))
```

Traversals in the repo: in-order, pre-order, post-order (recursive), and
level-order via a `Queue`. Functional in-order:

```scala
def inorder(root: TreeNode): List[Int] =
  if (root == null) Nil
  else inorder(root.left) ::: (root.value :: inorder(root.right))
```

## Graph

Available in repo: `Graph/GraphAdjacencyList.scala`. Adjacency list as
`Map[Int, List[Int]]`.

```scala
val graph = Map(
  0 -> List(1, 2),
  1 -> List(0, 3),
  2 -> List(0, 4),
  3 -> List(1),
  4 -> List(2)
)

def bfs(start: Int): List[Int] = {
  val visited = mutable.Set(start)
  val queue = mutable.Queue(start)
  val result = mutable.ListBuffer[Int]()
  while (queue.nonEmpty) {
    val node = queue.dequeue()
    result += node
    graph.getOrElse(node, Nil).foreach { nb =>
      if (!visited(nb)) { visited += nb; queue.enqueue(nb) }
    }
  }
  result.toList
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Space |
| -------------- | ------ | ------ | ------ | ------ | ----- |
| Array | O(1) | O(n) | O(n) | O(n) | O(n) |
| List (head ops) | O(n) | O(n) | O(1) | O(1) | O(n) |
| Vector | O(log n) | O(n) | O(log n) | O(log n) | O(n) |
| ArrayBuffer (end) | O(1) | O(n) | O(1) | O(1) | O(n) |
| mutable.Map / Set | n/a | O(1) avg | O(1) avg | O(1) avg | O(n) |
| immutable Map | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| PriorityQueue | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| Tree (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Graph (adj list) | O(1) | O(V + E) | O(1) | O(V + E) | O(V + E) |

## Pitfalls

- `List` prepend (`::`) is O(1), append (`:+`) is O(n) — build lists by
  prepending then reversing.
- `Array` is mutable and JVM-fixed-size; use `ArrayBuffer` for growing.
- `PriorityQueue.dequeue` returns the max (default ordering); reverse the
  `Ordering` for a min-heap.
- `mutable.Map` iteration order is hash-based; use `TreeMap` or sort keys
  for deterministic order.
- `withDefaultValue` masks missing keys but never inserts them — do not
  mutate through the default.
- Recursive tree/graph code can stack-overflow on deep structures; switch
  to explicit stacks or `tailrec` when possible.
- `return` inside a `foreach`/closure is a non-local return that throws —
  avoid in hot code.
- `var` vs `val` in case classes: `ListNode` needs `var` fields to reverse
  in place; prefer building new immutable structures otherwise.
- Comparing `null` trees: guard with `if (root == null)` before pattern
  matching, or use `Option`/`None` nodes instead.
