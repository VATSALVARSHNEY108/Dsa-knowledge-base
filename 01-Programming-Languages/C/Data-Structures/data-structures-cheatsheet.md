---
layout: default
title: Data Structures Cheatsheet
parent: C
nav_order: 4
---

# C Data Structures Cheatsheet

> Quick reference for data structure implementations in `C/Data-Structures/`.
> In C there is no standard library of collections - every structure below is
> hand-rolled from structs, arrays, and pointers.

## Built-in Collections

| Collection | Built-in? | Notes |
|---|---|---|
| Array | Yes | Fixed size, contiguous memory |
| String | Yes | `char[]` with `\0` terminator |
| Linked list | No | Hand-rolled `struct Node` |
| Stack | No | Emulate with array + top index |
| Queue | No | Emulate with array + front/rear |
| Hash map | No | Hand-rolled bucket arrays |
| Heap | No | Hand-rolled array with heapify |
| Tree | No | Hand-rolled `struct Node` |
| Graph | No | Hand-rolled adjacency list |

> C is a systems language: you manage memory and layout yourself. Mastering the
> array-based patterns below carries over to every other language.

## Available Implementations

| Folder | File | Data structure |
|---|---|---|
| Graph | `Graph/graph_adjacency_list.c` | Graph + DFS traversal |
| HashTable | `HashTable/hash_map.c` | Hash map (separate chaining) |
| Heap | `Heap/kth_largest.c` | Min-heap for kth largest |
| LinkedList | `LinkedList/reverse_linked_list.c` | Singly linked list reverse |
| LinkedList | `LinkedList/linked_list_cycle.c` | Cycle detection (Floyd) |
| LinkedList | `LinkedList/merge_two_sorted_lists.c` | Merge two sorted lists |
| Queue | `Queue/queue_using_stacks.c` | Queue built from two stacks |
| Stack | `Stack/valid_parentheses.c` | Array-based stack |
| Tree | `Tree/binary_tree_traversal.c` | Inorder/preorder/postorder |
| Tree | `Tree/max_depth.c` | Maximum depth of a tree |

## Array

Fixed-size contiguous memory. O(1) random access; O(n) insert/delete.

```c
int arr[10];
int n = 5;
for (int i = 0; i < n; i++) arr[i] = i;
```

## Linked List

Singly linked list node + iterative reverse (see `reverse_linked_list.c`):
```c
typedef struct Node { int data; struct Node *next; } Node;

Node *reverse(Node *head)
{
    Node *prev = NULL, *curr = head, *next;
    while (curr)
    {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```

Cycle detection (`linked_list_cycle.c`): Floyd's tortoise and hare - slow moves
one step, fast moves two; they meet if and only if a cycle exists.

## Stack

Array-based stack (see `Stack/valid_parentheses.c`):
```c
char stack[MAX];
int top = -1;
stack[++top] = ch;        /* push */
char c = stack[top--];    /* pop */
int empty = (top == -1);  /* check */
```

## Queue

Queue from two stacks (see `Queue/queue_using_stacks.c`). Push into the "in"
stack; on pop, if "out" is empty, transfer all elements so FIFO order emerges.

```c
void enqueue(int x) { push(&in, x); }

int dequeue(void)
{
    if (isEmpty(&out))
        while (!isEmpty(&in)) push(&out, pop(&in));
    return pop(&out);
}
```

## Hash Map

Separate chaining with bucket arrays (see `HashTable/hash_map.c`):
```c
int hash(int key) { return abs(key) % TABLE_SIZE; }

void put(HashMap *map, int key, int value)
{
    int idx = hash(key);
    Entry *e = map->buckets[idx];
    while (e)
    {
        if (e->key == key) { e->value = value; return; }
        e = e->next;
    }
    /* insert a new Entry at the head of the bucket chain */
}
```

## Heap

Min-heap as an array (see `Heap/kth_largest.c`). For index `i` the children are
`2*i+1` and `2*i+2`. Push a value, then `heapify` upward to restore the heap
property. Keeping a min-heap of size k yields the kth largest element.

```c
void heapify(MinHeap *h, int i)
{
    int smallest = i, left = 2 * i + 1, right = 2 * i + 2;
    if (left < h->size && h->data[left] < h->data[smallest]) smallest = left;
    if (right < h->size && h->data[right] < h->data[smallest]) smallest = right;
    if (smallest != i) { swap(&h->data[i], &h->data[smallest]); heapify(h, smallest); }
}
```

## Tree

Binary tree node with inorder/preorder/postorder (see `binary_tree_traversal.c`):
```c
typedef struct Node { int data; struct Node *left, *right; } Node;

void inorder(Node *r)
{
    if (!r) return;
    inorder(r->left);
    printf("%d ", r->data);
    inorder(r->right);
}
```

Max depth (see `Tree/max_depth.c`):
```c
int max_depth(Node *r)
{
    if (!r) return 0;
    int l = max_depth(r->left), d = max_depth(r->right);
    return 1 + (l > d ? l : d);
}
```

## Graph

Adjacency list (see `Graph/graph_adjacency_list.c`): array of linked lists.
```c
typedef struct AdjNode { int v; struct AdjNode *next; } AdjNode;
typedef struct Graph { int num_vertices; AdjNode **adj_lists; } Graph;

void add_edge(Graph *g, int src, int dest)
{
    /* prepend dest to g->adj_lists[src] and src to g->adj_lists[dest] */
}
```

## Complexity Quick Reference

| Operation | Array | Linked list | Stack | Queue | Hash map | Heap |
|---|---|---|---|---|---|---|
| Access / peek | O(1) | O(n) | O(1) | O(1) | O(1)* | O(1) |
| Search | O(n) | O(n) | O(n) | O(n) | O(1)* | O(n) |
| Insert | O(n) | O(1) | O(1) | O(1) | O(1)* | O(log n) |
| Delete | O(n) | O(1) | O(1) | O(1) | O(1)* | O(log n) |

*Average with a good hash function; worst case O(n).

| Structure | Space |
|---|---|
| Hash map | O(n) |
| Binary tree | O(n) |
| Graph (adjacency list) | O(V + E) |

## Pitfalls

- Every `malloc`/`calloc` needs a matching `free`; run ASan or valgrind to catch leaks.
- Forgetting the `\0` terminator breaks `strlen`, `strcmp`, and `printf`.
- Fixed-size arrays overflow silently; always bounds-check indices.
- Reversing a list loses the old head - save it before reassigning pointers.
- `top == -1` means empty stack; popping an empty stack underflows.
- Resizing a hash table changes bucket indices - all entries must be rehashed.
- Heap child formulas differ by 0-based (`2*i+1`) versus 1-based (`2*i`) layout.
- Recursive tree code uses the call stack; deep trees can overflow it.
- Pass structs by pointer, not by value, to avoid copies of the whole structure.
