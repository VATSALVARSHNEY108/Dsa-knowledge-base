---
layout: default
title: Data Structures Cheatsheet
parent: R
nav_order: 4
---

# R Data Structures Cheatsheet

Quick-reference for the data structure implementations in this folder. Each entry maps
to a file under `Data-Structures/`. Snippets run in base R (R 4.x).

## Available Files

| Category | File | Implementation |
| --- | --- | --- |
| Graph | `Graph/graph_adjacency_list.R` | Adjacency list graph |
| Hash Table | `HashTable/hash_map.R` | Hash map with chaining |
| Heap | `Heap/kth_largest.R` | Kth largest via sorted window |
| Linked List | `LinkedList/reverse_linked_list.R` | Iterative reversal |
| Linked List | `LinkedList/merge_two_sorted_lists.R` | Merge two sorted lists |
| Linked List | `LinkedList/linked_list_cycle.R` | Floyd's cycle detection |
| Queue | `Queue/queue_using_stacks.R` | Queue built from two stacks |
| Stack | `Stack/valid_parentheses.R` | Stack-based bracket matching |
| Tree | `Tree/binary_tree_traversal.R` | Inorder/preorder/postorder |
| Tree | `Tree/max_depth.R` | Max depth of a tree |

> Note: Base R has no object-oriented container types for classic DS operations; these
> files implement them using lists, vectors, and closures. For production, use packages
> like `collections`, `R6`, or `igraph`/`data.tree`.

## Built-in Collections

| Collection | Declaration | Notes |
| --- | --- | --- |
| vector | `c(1, 2, 3)` | atomic, homogeneous |
| list | `list(a = 1, b = 2)` | heterogeneous, recursive |
| matrix | `matrix(1:6, nrow = 2)` | 2D atomic |
| data.frame | `data.frame(x = 1:3)` | column-oriented records |
| factor | `factor(c("a", "b"))` | categorical levels |
| environment | `new.env()` | hash map-like, reference semantics |
| pairlist | `pairlist(1, 2)` | deprecated internal list |

> R emphasizes vectorization: preallocate vectors rather than growing with `c()`, and
> prefer `lapply`/`sapply` over explicit loops. Environments provide mutable hash-map
> behavior; lists are copied by value on modification.

## Core Data Structures

### Vector (array)
```r
arr <- c(3, 1, 2)
arr[1]             # 3 — 1-indexed!
length(arr)        # 3
sort(arr)          # 1 2 3 (new vector)
arr[order(arr)]    # sorted by index
arr[1:2]           # slice (inclusive)
```

### Linked List
```r
ListNode <- function(val = 0, next_node = NULL) {
  list(val = val, next = next_node)
}

reverse_linked_list <- function(head) {
  prev <- NULL
  current <- head
  while (!is.null(current)) {
    next_node <- current$next
    current$next <- prev
    prev <- current
    current <- next_node
  }
  prev
}
```

### Stack
```r
stack <- c()
stack <- c(stack, 1)   # push
top <- stack[length(stack)]
stack <- stack[-length(stack)]   # pop
# See valid_parentheses.R for bracket matching
```

### Queue
```r
Queue <- function() {
  list(in_stack = c(), out_stack = c())
}
enqueue <- function(q, x) {
  q$in_stack <- c(q$in_stack, x)
  q
}
dequeue <- function(q) {
  if (length(q$out_stack) == 0) {
    while (length(q$in_stack) > 0) {
      q$out_stack <- c(q$out_stack, q$in_stack[length(q$in_stack)])
      q$in_stack <- q$in_stack[-length(q$in_stack)]
    }
  }
  val <- q$out_stack[length(q$out_stack)]
  q$out_stack <- q$out_stack[-length(q$out_stack)]
  list(val = val, queue = q)
}
```

### Hash Map
```r
HashMap <- function() {
  list(size = 10, buckets = vector("list", 10))
}
hash_code <- function(key) {
  sum(as.integer(charToRaw(key)))
}
put <- function(map, key, value) {
  idx <- (hash_code(key) %% map$size) + 1
  bucket <- map$buckets[[idx]]
  for (i in seq_along(bucket)) {
    if (bucket[[i]]$key == key) {
      bucket[[i]]$value <- value
      map$buckets[[idx]] <- bucket
      return(map)
    }
  }
  bucket <- c(bucket, list(list(key = key, value = value)))
  map$buckets[[idx]] <- bucket
  map
}
get <- function(map, key) {
  idx <- (hash_code(key) %% map$size) + 1
  for (entry in map$buckets[[idx]]) {
    if (entry$key == key) return(entry$value)
  }
  NULL
}
```

> For real dictionary use, `new.env(hash = TRUE)` is far faster than a hand-rolled map.

### Heap
```r
# Base R has no heap. Kth largest uses a sorted sliding window:
find_kth_largest <- function(nums, k) {
  heap <- sort(nums[1:k])
  for (i in (k + 1):length(nums)) {
    if (nums[i] > heap[1]) {
      heap[1] <- nums[i]
      heap <- sort(heap)
    }
  }
  heap[1]
}
```

### Tree
```r
TreeNode <- function(val = 0, left = NULL, right = NULL) {
  list(val = val, left = left, right = right)
}

max_depth <- function(root) {
  if (is.null(root)) return(0)
  1 + max(max_depth(root$left), max_depth(root$right))
}

inorder <- function(root) {
  if (is.null(root)) return(c())
  c(inorder(root$left), root$val, inorder(root$right))
}
```

### Graph (Adjacency List)
```r
Graph <- function(vertices) {
  list(vertices = vertices, adj = vector("list", vertices))
}
add_edge <- function(graph, u, v) {
  graph$adj[[u]] <- c(graph$adj[[u]], v)
  graph$adj[[v]] <- c(graph$adj[[v]], u)
  graph
}
display_graph <- function(graph) {
  for (i in 1:graph$vertices) {
    cat(i, "->", graph$adj[[i]], "\n")
  }
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Vector | O(1) | O(n) | O(n) | O(n) | append copies O(n) |
| List | O(1) | O(n) | O(n) | O(n) | `[[i]]` access |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | *at known node/head |
| Stack | - | O(n) | O(n) | O(n) | vector-based `c()` |
| Queue | - | O(n) | O(n) | O(n) | two-stack amortized |
| Hash Map (env) | - | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| Heap (vector) | - | O(n) | O(n log n) | O(n log n) | sorted-window emulation |
| Binary Tree | O(log n) avg | O(log n) avg | O(log n) avg | O(log n) avg | O(n) worst skewed |
| Graph | - | O(V + E) | O(1) | O(E) | adjacency list |

## Pitfalls

- R is 1-indexed; `arr[0]` silently returns empty, and `arr[length(arr) + 1]` appends.
- `c()` copies the entire vector — appending in a loop is O(n^2); preallocate or use
  list `[[` assignment with `length(x) + 1`.
- Lists use `[[` to extract elements and `$` for named fields; `[` returns a sub-list.
- Vectors are homogeneous: `c(1, "a")` coerces `1` to `"1"`.
- Environments are reference-semantics; lists/data.frames are copy-on-write — modifying
  inside a function requires `<<-` or returning the updated object.
- `NULL` comparisons: `is.null(x)` not `x == NULL`.
- `sort()` default method may be unstable; use `method = "radix"` when stability matters.
- Recursion depth is limited; deep trees should use iterative traversals.
- `rep()`/`vector()` preallocation beats growing in loops for performance.
- Matrix/vector recycling can silently change lengths — watch for `1:0` producing a
  zero-length slice in merge-style loops.
