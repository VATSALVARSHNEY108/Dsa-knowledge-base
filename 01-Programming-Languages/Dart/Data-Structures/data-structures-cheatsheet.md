---
layout: default
title: Data Structures Cheatsheet
parent: Dart
nav_order: 4
---

# Dart Data Structures Cheatsheet

> Quick reference for data structure implementations in `Dart/Data-Structures/`.
> Dart's core library provides `List`, `Set`, and `Map`; `dart:collection` adds
> queues and ordered variants. Heaps and linked lists are typically hand-rolled.

## Built-in Collections

| Collection | Class | Notes |
|---|---|---|
| Dynamic array | `List<E>` | Growable or fixed-length |
| Map | `Map<K, V>` | Hash-based, insertion-ordered by default |
| Set | `Set<E>` | Unique elements, hash-based |
| Queue | `Queue<E>` | `dart:collection`, FIFO, O(1) add/remove |
| Linked hash map | `LinkedHashMap` | `dart:collection`, insertion order |
| Splay tree map | `SplayTreeMap` | `dart:collection`, sorted keys |
| Splay tree set | `SplayTreeSet` | `dart:collection`, sorted elements |
| Heap / priority queue | (none) | No core priority queue; hand-roll |
| Linked list | `LinkedList<E>` | `dart:collection`, internal nodes |

> Dart has no built-in stack, heap, or priority queue classes. Idiomatic code
> models a stack with a `List` (`add`/`removeLast`) and a heap manually.

## Available Implementations

| Folder | File | Data structure |
|---|---|---|
| Graph | `Graph/graph_adjacency_list.dart` | Graph + DFS traversal |
| HashTable | `HashTable/hash_map.dart` | Hash map (separate chaining) |
| Heap | `Heap/kth_largest.dart` | Min-heap for kth largest |
| LinkedList | `LinkedList/reverse_linked_list.dart` | Singly linked list reverse |
| LinkedList | `LinkedList/linked_list_cycle.dart` | Cycle detection (Floyd) |
| LinkedList | `LinkedList/merge_two_sorted_lists.dart` | Merge two sorted lists |
| Queue | `Queue/queue_using_stacks.dart` | Queue built from two stacks |
| Stack | `Stack/valid_parentheses.dart` | List-based stack |
| Tree | `Tree/binary_tree_traversal.dart` | Inorder/preorder/postorder |
| Tree | `Tree/max_depth.dart` | Maximum depth of a tree |

## Array (List)

Growable dynamic array; O(1) random access and tail append.

```dart
final list = <int>[1, 2, 3];
list.add(4);                  // O(1) amortized
int x = list[2];              // O(1)
list.removeLast();            // O(1)
list.sort();
```

## Stack

Model with a `List` (see `Stack/valid_parentheses.dart`):
```dart
final stack = <String>[];
stack.add(ch);                // push
String c = stack.removeLast();  // pop
bool empty = stack.isEmpty;   // check
```

## Queue

`dart:collection` `Queue` for production; the folder shows a queue built from
two stacks (`Queue/queue_using_stacks.dart`) as an exercise.
```dart
import 'dart:collection';
final q = Queue<int>();
q.add(1);                     // enqueue
int x = q.removeFirst();      // dequeue (O(1))
```

## Linked List

Hand-rolled node class; iterative reverse (see `reverse_linked_list.dart`):
```dart
class Node {
  int data;
  Node? next;
  Node(this.data);
}

Node? reverse(Node? head) {
  Node? prev, curr = head;
  while (curr != null) {
    final next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

Cycle detection (`linked_list_cycle.dart`): Floyd's tortoise and hare.

## Hash Map

`Map<K, V>` literal in production; the folder hand-rolls separate chaining with
buckets of entries (see `HashTable/hash_map.dart`).
```dart
final map = <String, int>{};
map['apple'] = 5;              // insert / update
int? v = map['apple'];         // read (null if missing)
bool has = map.containsKey('apple');
map.remove('apple');
```

## Heap

No core class - hand-roll an array-based heap (see `Heap/kth_largest.dart`),
using a sorted `List` as a simple stand-in:
```dart
int findKthLargest(List<int> nums, int k) {
  final heap = <int>[];
  for (final num in nums) {
    heap.add(num);
    heap.sort();
    if (heap.length > k) heap.removeAt(0);
  }
  return heap.first;
}
```

## Tree

Binary tree node with traversals (see `Tree/binary_tree_traversal.dart`):
```dart
class TreeNode {
  int data;
  TreeNode? left, right;
  TreeNode(this.data);
}

void inorder(TreeNode? r) {
  if (r == null) return;
  inorder(r.left);
  print(r.data);
  inorder(r.right);
}
```

Max depth (see `Tree/max_depth.dart`):
```dart
int maxDepth(TreeNode? r) {
  if (r == null) return 0;
  return 1 + math.max(maxDepth(r.left), maxDepth(r.right));
}
```

## Graph

Adjacency list using `Map<int, List<int>>` (see `graph_adjacency_list.dart`):
```dart
class Graph {
  final Map<int, List<int>> _adj = {};

  void addEdge(int u, int v) {
    _adj.putIfAbsent(u, () => []).add(v);
    _adj.putIfAbsent(v, () => []).add(u);
  }
}
```

## Complexity Quick Reference

| Operation | List | Linked list | Stack | Queue | Map | Heap |
|---|---|---|---|---|---|---|
| Access / peek | O(1) | O(n) | O(1) | O(1) | O(1)* | O(1) |
| Search | O(n) | O(n) | O(n) | O(n) | O(1)* | O(n) |
| Insert | O(1) tail | O(1) | O(1) | O(1) | O(1)* | O(log n) |
| Delete | O(n) | O(1) | O(1) | O(1) | O(1)* | O(log n) |

*Average with a good hash function; worst case O(n).

| Structure | Space |
|---|---|
| Map | O(n) |
| Binary tree | O(n) |
| Graph (adjacency list) | O(V + E) |

## Pitfalls

- `removeAt(0)` on a `List` is O(n); use `Queue` for true FIFO behavior.
- `Map` insertion order is preserved in Dart (unlike many languages).
- Growing a `List` repeatedly without capacity planning can fragment memory.
- Dart has no built-in heap/priority queue - add the `collection` package or
  hand-roll one.
- Null safety means fields are nullable unless initialized (`Node? next`).
- Recursive tree/graph code can overflow the stack on deep inputs.
- String indices (`s[i]`) return a single UTF-16 code unit; watch out for
  emoji and other non-BMP characters.
