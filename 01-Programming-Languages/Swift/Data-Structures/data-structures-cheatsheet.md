---
layout: default
title: Data Structures Cheatsheet
parent: Swift
nav_order: 4
---

# Swift Data Structures Cheatsheet

Quick-reference for core data structures in Swift. Companion code lives in
`Swift/Data-Structures/` under `LinkedList/`, `Stack/`, `Queue/`, `HashTable/`,
`Heap/`, `Tree/`, and `Graph/`.

> Swift's stdlib covers arrays, dictionaries, and sets. Linked lists,
> queues, heaps, and trees are typically hand-built as classes or enums —
> the repo shows the classic patterns.

## Built-in Collections

| Collection | Example | Notes |
| ---------- | ------- | ----- |
| `Array<Element>` | `[1, 2, 3]` | Ordered, O(1) index, value type |
| `Dictionary<K, V>` | `["a": 1]` | Hash map, O(1) avg access |
| `Set<Element>` | `Set([1, 2])` | Unordered, uniqueness |
| `String` | `"abc"` | Character sequence, value type |
| `Range<Int>` | `1..<5` | Lazily generated range |
| `Optional<T>` | `Int?` | `nil` / `some` wrapper |
| `ContiguousArray<T>` | `ContiguousArray(1...)` | C-like array, faster |
| `Data` / `NSArray` (Foundation) | — | Bridged Cocoa types |

```swift
var arr = [1, 2, 3]
arr.append(4)          // O(1)
arr.removeLast()       // O(1)
arr[0]                 // 1

var dict: [String: Int] = [:]
dict["a"] = 1
dict["a"]              // Int? — nil if absent
dict["b", default: 0]  // 0 without modifying the dict

var set: Set<Int> = [1, 2, 3]
set.contains(2)        // true
```

> Arrays and dictionaries are value types: assignments copy (copy-on-write
> keeps it cheap). Mutate copies, not shared instances.

## Arrays

Fixed-capacity or auto-growing via `append`/`reserveCapacity`.

```swift
var grid = Array(repeating: Array(repeating: 0, count: 3), count: 3)
var xs: [Int] = []
xs.reserveCapacity(1000)   // pre-allocate
```

> `Array(repeating: Array(...), count:)` creates independent inner arrays
> because the closure form isn't available; for mutable rows build them in
> a loop.

## Linked List

Available in repo: `LinkedList/reverse_linked_list.swift`,
`LinkedList/merge_two_sorted_lists.swift`, `LinkedList/linked_list_cycle.swift`.

```swift
final class ListNode {
    var val: Int
    var next: ListNode?
    init(_ val: Int) { self.val = val }
}

func reverseList(_ head: ListNode?) -> ListNode? {
    var prev: ListNode?
    var cur = head
    while let node = cur {
        let next = node.next
        node.next = prev
        prev = node
        cur = next
    }
    return prev
}
```

> `final class` gives reference semantics; structs would copy on assignment
> and break the shared-link pattern.

## Stack

Available in repo: `Stack/valid_parentheses.swift`. An `Array` with
`append`/`removeLast` is a natural stack.

```swift
var stack: [Character] = []
stack.append("(")
stack.removeLast()       // pop
stack.last               // peek
```

> Matching brackets with a stack is in `Stack/valid_parentheses.swift`.

## Queue

Available in repo: `Queue/queue_using_stacks.swift` (two-stack queue).
A plain array queue uses an index pointer to avoid O(n) `removeFirst`.

```swift
struct Queue<Element> {
    private var items: [Element] = []
    private var head = 0

    mutating func enqueue(_ e: Element) { items.append(e) }

    mutating func dequeue() -> Element? {
        guard head < items.count else { return nil }
        defer { head += 1 }
        return items[head]
    }
}
```

> After many dequeues, `items[head...]` grows; compact occasionally with
> `items = Array(items[head...])`.

## Hash Map / Dictionary

Available in repo: `HashTable/hash_map.swift` (custom chaining). Swift's
`Dictionary` is a hash map with O(1) average access.

```swift
// Counting
var freq: [String: Int] = [:]
freq["a", default: 0] += 1
```

> `dict[key]` returns an `Optional`; mutating via subscripting a missing
> key is fine only when you assign a value. `default:` avoids nil-handling.

## Heap

Available in repo: `Heap/kth_largest.swift` (custom min-heap). Swift stdlib
has no heap; `kth_largest.swift` implements a binary heap with `siftUp`/
`siftDown`.

```swift
struct MinHeap {
    private var heap: [Int] = []
    var count: Int { heap.count }
    var peek: Int? { heap.first }

    mutating func push(_ v: Int) {
        heap.append(v)
        var i = heap.count - 1
        while i > 0 && heap[(i - 1) / 2] > heap[i] {
            heap.swapAt(i, (i - 1) / 2)
            i = (i - 1) / 2
        }
    }

    mutating func pop() -> Int? {
        guard let top = heap.first else { return nil }
        heap[0] = heap.removeLast()
        var i = 0
        while true {
            let l = 2 * i + 1
            let r = 2 * i + 2
            var s = i
            if l < heap.count && heap[l] < heap[s] { s = l }
            if r < heap.count && heap[r] < heap[s] { s = r }
            if s == i { break }
            heap.swapAt(i, s)
            i = s
        }
        return top
    }
}
```

> For the "kth largest in a stream" problem, cap the heap at size `k`
> (see `Heap/kth_largest.swift`).

## Tree

Available in repo: `Tree/binary_tree_traversal.swift`, `Tree/max_depth.swift`.

```swift
final class TreeNode {
    var val: Int
    var left: TreeNode?
    var right: TreeNode?
    init(_ val: Int) { self.val = val }
}

func maxDepth(_ root: TreeNode?) -> Int {
    guard let root = root else { return 0 }
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
}
```

> `Tree/binary_tree_traversal.swift` covers in-order, pre-order,
> post-order, and level-order traversals.

## Graph

Available in repo: `Graph/graph_adjacency_list.swift`. Adjacency list as
`[Int: [Int]]` or `[[Int]]`.

```swift
var graph: [Int: [Int]] = [:]
graph[0, default: []].append(1)
graph[0, default: []].append(2)
graph[1, default: []].append(3)
```

> `Graph/graph_adjacency_list.swift` shows BFS/DFS over this layout.

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Space |
| -------------- | ------ | ------ | ------ | ------ | ----- |
| Array (end) | O(1) | O(n) | O(1) | O(1) | O(n) |
| Array (front/middle) | O(1) | O(n) | O(n) | O(n) | O(n) |
| Dictionary | n/a | O(1) avg | O(1) avg | O(1) avg | O(n) |
| Set | n/a | O(1) avg | O(1) avg | O(1) avg | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue (index pointer) | O(n) | O(n) | O(1) | O(1) | O(n) |
| Heap | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| Tree (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Graph (adj list) | O(1) | O(V + E) | O(1) | O(V + E) | O(V + E) |

\* Given a pointer to the node to remove/insert after.

## Pitfalls

- `Array.removeFirst()` is O(n); use an index pointer or a two-stack
  queue for FIFO workloads.
- Value semantics: assigning `let b = arr` copies; mutating `b` never
  affects `a`. Great for safety, surprising if you expected references.
- `dict[key]` returns `Optional`; force-unwrapping (`!`) crashes on
  missing keys — prefer `default:` or `??`.
- No stdlib heap: your custom heap needs correct `siftUp`/`siftDown`;
  test with duplicates and single elements.
- Recursive tree/graph code can overflow the stack on deep inputs;
  switch to explicit stacks or queues.
- Reserve capacity (`reserveCapacity`) when appending in tight loops to
  avoid repeated reallocation.
