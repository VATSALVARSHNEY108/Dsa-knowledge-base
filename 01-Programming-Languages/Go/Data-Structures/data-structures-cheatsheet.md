---
layout: default
title: Data Structures Cheatsheet
parent: Go
nav_order: 4
---

# Go Data Structures Cheatsheet

> Quick reference for data structure implementations in `Go/Data-Structures/`.
> Go's standard library provides `container/heap` and `container/list`; maps
> and slices are built in. Stacks and queues are modeled with slices.

## Built-in Collections

| Collection | Type / Package | Notes |
|---|---|---|
| Array | `[n]T` | Fixed length, value semantics |
| Slice | `[]T` | Dynamic array, view over an array |
| Map | `map[K]V` | Hash table, built in |
| String | `string` | Immutable byte sequence |
| Linked list | `container/list` | Doubly linked list |
| Heap | `container/heap` | Interface you implement |
| Stack | (none) | Model with a slice (`append`/`pop`) |
| Queue | (none) | Model with a slice (front index) |
| Set | (none) | Use `map[K]struct{}` |
| Tree / Graph | (none) | Hand-rolled structs |

> Go deliberately omits generics for stacks, queues, sets, and trees. Idiomatic
> code uses slices, maps, or a small wrapper type.

## Available Implementations

| Folder | File | Data structure |
|---|---|---|
| Graph | `Graph/graph_adjacency_list.go` | Graph + DFS traversal |
| HashTable | `HashTable/hash_map.go` | Hash map (separate chaining) |
| Heap | `Heap/kth_largest.go` | Min-heap for kth largest |
| LinkedList | `LinkedList/reverse_linked_list.go` | Singly linked list reverse |
| LinkedList | `LinkedList/linked_list_cycle.go` | Cycle detection (Floyd) |
| LinkedList | `LinkedList/merge_two_sorted_lists.go` | Merge two sorted lists |
| Queue | `Queue/queue_using_stacks.go` | Queue built from two stacks |
| Stack | `Stack/valid_parentheses.go` | Slice-based stack |
| Tree | `Tree/binary_tree_traversal.go` | Inorder/preorder/postorder |
| Tree | `Tree/max_depth.go` | Maximum depth of a tree |

## Array / Slice

Fixed-size arrays are values; slices are views over arrays.

```go
var arr [5]int                  // fixed size
slice := []int{1, 2, 3}         // dynamic
slice = append(slice, 4)        // amortized O(1)
x := slice[2]                   // O(1)
```

## Stack

Slice-based stack (see `Stack/valid_parentheses.go`):
```go
stack := []rune{}
stack = append(stack, ch)           // push
top := stack[len(stack)-1]          // peek
stack = stack[:len(stack)-1]        // pop
empty := len(stack) == 0
```

## Queue

Slice-based queue (see `Queue/queue_using_stacks.go` for the two-stack variant):
```go
queue := []int{}
queue = append(queue, 1)        // enqueue
x := queue[0]                   // peek (FIFO)
queue = queue[1:]               // dequeue (O(n) on small slices)
```

> For O(1) dequeue, track a head index instead of reslicing every pop.

## Linked List

`container/list` for production; hand-rolled node for interviews. Iterative
reverse (see `reverse_linked_list.go`):
```go
type Node struct {
	Data int
	Next *Node
}

func reverse(head *Node) *Node {
	var prev *Node
	curr := head
	for curr != nil {
		next := curr.Next
		curr.Next = prev
		prev = curr
		curr = next
	}
	return prev
}
```

Cycle detection (`linked_list_cycle.go`): Floyd's tortoise and hare.

## Hash Map

Built-in `map` for production; the folder hand-rolls separate chaining with
buckets of entries (see `HashTable/hash_map.go`).
```go
m := make(map[string]int)
m["apple"] = 5                 // insert / update
v, ok := m["apple"]            // ok is false when missing
delete(m, "apple")
```

## Heap

Implement `container/heap`'s interface (see `Heap/kth_largest.go`):
```go
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }  // min-heap
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}
```

Usage:
```go
h := &IntHeap{}
heap.Init(h)
heap.Push(h, num)
top := (*h)[0]
heap.Pop(h)
```

## Tree

Binary tree node with traversals (see `Tree/binary_tree_traversal.go`):
```go
type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func inorder(r *TreeNode) {
	if r == nil {
		return
	}
	inorder(r.Left)
	fmt.Println(r.Val)
	inorder(r.Right)
}
```

Max depth (see `Tree/max_depth.go`):
```go
func maxDepth(r *TreeNode) int {
	if r == nil {
		return 0
	}
	l, d := maxDepth(r.Left), maxDepth(r.Right)
	if l > d {
		return 1 + l
	}
	return 1 + d
}
```

## Graph

Adjacency list using a map (see `Graph/graph_adjacency_list.go`):
```go
type Graph struct {
	vertices map[int][]int
}

func (g *Graph) AddEdge(u, v int) {
	g.vertices[u] = append(g.vertices[u], v)
	g.vertices[v] = append(g.vertices[v], u)
}
```

## Complexity Quick Reference

| Operation | Slice | Linked list | Stack | Queue | Map | Heap |
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

- Slices share backing arrays; copies via `slice = slice[1:]` keep the old array
  alive until all references drop.
- Map iteration order is randomized - never rely on it.
- Reading a missing map key returns the zero value; check with the `, ok` idiom.
- `container/heap` requires implementing the interface; do not forget `Init`.
- Appending to a nil slice is fine, but slicing past the end panics.
- Go strings are byte sequences; indexing returns bytes, not runes.
- There is no built-in set - use `map[K]struct{}` as the idiomatic stand-in.
