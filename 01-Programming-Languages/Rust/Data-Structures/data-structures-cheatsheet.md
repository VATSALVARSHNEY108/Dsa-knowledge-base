---
layout: default
title: Data Structures Cheatsheet
parent: Rust
nav_order: 4
---

# Rust Data Structures Cheatsheet

Quick-reference for core data structures in Rust. Companion code lives in
`Rust/Data-Structures/` under `LinkedList/`, `Stack/`, `Queue/`, `HashTable/`,
`Heap/`, `Tree/`, and `Graph/`.

> Rust's stdlib is deliberately small: `Vec`, `VecDeque`, `HashMap`,
> `BTreeMap`, `HashSet`, `BTreeSet`, and `BinaryHeap`. Custom linked lists
> and trees are mainly learning exercises; ownership makes them harder
> than in other languages.

## Built-in Collections

| Collection | Signature | Notes |
| ---------- | --------- | ----- |
| `Vec<T>` | `Vec::new()`, `vec![..]` | Growable array, contiguous |
| `VecDeque<T>` | `VecDeque::new()` | Ring buffer, FIFO ops O(1) |
| `LinkedList<T>` | `LinkedList::new()` | Doubly linked, rare in practice |
| `HashMap<K, V>` | `HashMap::new()` | O(1) avg, random order |
| `BTreeMap<K, V>` | `BTreeMap::new()` | Sorted order, O(log n) |
| `HashSet<T>` | `HashSet::new()` | Set, O(1) avg |
| `BTreeSet<T>` | `BTreeSet::new()` | Sorted set, O(log n) |
| `BinaryHeap<T>` | `BinaryHeap::new()` | Max-heap by default |
| `Option<T>` | `None` / `Some(v)` | Nullable value |
| `&[T]` / arrays | `[1, 2, 3]` | Fixed-size `[T; N]`, slice view |

```rust
use std::collections::{HashMap, VecDeque, BinaryHeap};

let mut v: Vec<i32> = vec![1, 2, 3];
v.push(4);
v.pop();

let mut h: HashMap<&str, i32> = HashMap::new();
h.insert("a", 1);
h.entry("b").or_insert(2);

let mut heap = BinaryHeap::new(); // max-heap
heap.push(3);
heap.peek(); // Some(&3)
```

> `BinaryHeap` is a max-heap. For a min-heap, reverse the comparator or
> store `Reverse<T>` (`std::cmp::Reverse`).

## Arrays / Vectors

`Vec<T>` is the workhorse: contiguous, O(1) index, O(1) push/pop.

```rust
let mut grid = vec![vec![0; 3]; 3];       // 2-D matrix
let arr = [1, 2, 3];                      // fixed-size array
let slice: &[i32] = &arr[..];             // view

v.iter().map(|x| x * 2).collect::<Vec<_>>();
v.iter().filter(|x| **x > 1).collect::<Vec<_>>();
```

> Vec is bounded by the OS stack only for stack arrays; heaps grow. Index
> with `.get(i)` to avoid panics on out-of-bounds.

## Linked List

Available in repo: `LinkedList/reverse_linked_list.rs`,
`LinkedList/merge_two_sorted_lists.rs`, `LinkedList/linked_list_cycle.rs`.
The repo examples use boxed nodes; stdlib `LinkedList` exists but has
poor cache locality.

```rust
#[derive(PartialEq, Eq)]
struct ListNode {
    val: i32,
    next: Option<Box<ListNode>>,
}

impl ListNode {
    fn new(val: i32) -> Self {
        ListNode { val, next: None }
    }
}

// Reverse a linked list
fn reverse_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
    let mut prev = None;
    let mut cur = head;
    while let Some(mut node) = cur {
        cur = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    prev
}
```

> `Option<Box<ListNode>>` is the idiomatic "nullable node" encoding.
> `take()` lets you move out of an `Option` without leaving a dangling ref.

## Stack

Available in repo: `Stack/valid_parentheses.rs`. A `Vec` is a stack:
`push`, `pop`, `last` (peek) all O(1).

```rust
let mut stack = Vec::new();
stack.push(1);
stack.pop();       // Option<i32>
stack.last();      // Option<&i32>, peek
```

> See `Stack/valid_parentheses.rs` for a matching-bracket solution.

## Queue

Available in repo: `Queue/queue_using_stacks.rs`. Use `VecDeque` for a
true O(1) FIFO.

```rust
use std::collections::VecDeque;

let mut q: VecDeque<i32> = VecDeque::new();
q.push_back(1);
q.push_front(0);
q.pop_front();  // Some(1), O(1)
q.pop_back();   // O(1)
```

> `Vec::remove(0)` is O(n) — never build a queue from a plain `Vec`.
> The repo `queue_using_stacks.rs` demonstrates a two-stack amortized
> O(1) queue.

## Hash Map

Available in repo: `HashTable/hash_map.rs` (custom implementation).
Stdlib `HashMap` uses SipHash by default; `FxHashMap`/`HashMap with a
BuildHasher` alternatives exist in crates for speed.

```rust
use std::collections::HashMap;

let mut m: HashMap<String, i32> = HashMap::new();
m.insert("k".to_string(), 1);
m.entry("k".to_string()).and_modify(|v| *v += 1).or_insert(1);
m.get("k");          // Option<&i32>
m.remove("k");       // Option<i32>
```

> Values are moved, not borrowed: `insert(&str, ...)` needs a `&str` key
> borrowed for the map's lifetime, which usually means `String` keys.
> Iterate with `for (k, v) in &m`.

## Heap

Available in repo: `Heap/kth_largest.rs` (custom min-heap). Stdlib
`BinaryHeap` is a max-heap; use `Reverse` for min-heap semantics.

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut min_heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
min_heap.push(Reverse(3));
min_heap.push(Reverse(1));
min_heap.pop(); // Some(Reverse(1))
```

> Keep a min-heap capped at size `k` to answer "kth largest in a stream"
> in O(log k) per push (see `Heap/kth_largest.rs`).

## Tree

Available in repo: `Tree/binary_tree_traversal.rs`, `Tree/max_depth.rs`.
Trees use `Option<Box<TreeNode>>`; recursion borrows via `&TreeNode`.

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct TreeNode {
    val: i32,
    left: Option<Rc<RefCell<TreeNode>>>,
    right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}

fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
    match root {
        None => 0,
        Some(node) => {
            let n = node.borrow();
            1 + max_depth(n.left.clone()).max(max_depth(n.right.clone()))
        }
    }
}
```

> For shared/mutable trees use `Rc<RefCell<TreeNode>>`; for pure
> traversals, `&TreeNode` with `Box<TreeNode>` avoids runtime borrow
> checks. Leetcode-style problems typically use `Option<Rc<RefCell<TreeNode>>>`.

## Graph

Available in repo: `Graph/graph_adjacency_list.rs`. Adjacency list as
`Vec<Vec<usize>>` or `HashMap<K, Vec<K>>`.

```rust
use std::collections::HashMap;

let mut graph: HashMap<u32, Vec<u32>> = HashMap::new();
graph.entry(0).or_default().push(1);
graph.entry(0).or_default().push(2);
graph.entry(1).or_default().push(3);

for (node, neighbors) in &graph {
    println!("{} -> {:?}", node, neighbors);
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Space |
| -------------- | ------ | ------ | ------ | ------ | ----- |
| Vec (end) | O(1) | O(n) | O(1) | O(1) | O(n) |
| Vec (front/middle) | O(1) | O(n) | O(n) | O(n) | O(n) |
| VecDeque | O(1) | O(n) | O(1) | O(1) | O(n) |
| LinkedList | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| HashMap | n/a | O(1) avg | O(1) avg | O(1) avg | O(n) |
| BTreeMap | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| BinaryHeap | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| Binary Tree (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Graph (adj list) | O(1) | O(V + E) | O(1) | O(V + E) | O(V + E) |

\* Given a pointer to the node to remove/insert after.

## Pitfalls

- `HashMap` iteration order is nondeterministic; use `BTreeMap` for
  sorted iteration.
- `BinaryHeap` is a max-heap; wrap in `Reverse` for a min-heap.
- `Rc<RefCell<T>>` adds runtime overhead; prefer `&T`/`Box<T>` when
  mutation isn't needed.
- Borrow checker rejects storing references to a `HashMap` and mutating
  it simultaneously; clone or restructure.
- `BinaryHeap` doesn't support arbitrary deletion; pop and re-push, or
  use a "lazy deletion" count map.
