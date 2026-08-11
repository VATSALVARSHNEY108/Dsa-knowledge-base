---
layout: default
title: Data Structures Cheatsheet
parent: C++
nav_order: 4
---

# C++ Data Structures Cheatsheet

> Quick reference for data structure implementations in `C++/Data-Structures/`.
> C++ ships with the STL, so most structures are available out of the box; the
> folder also contains hand-rolled examples for learning.

## Built-in Collections (STL)

| Collection | Header | Notes |
|---|---|---|
| Array | `<array>` | Fixed size, stack allocation |
| Vector | `<vector>` | Dynamic array, amortized O(1) push_back |
| List | `<list>` | Doubly linked list |
| Forward list | `<forward_list>` | Singly linked list |
| Deque | `<deque>` | Double-ended queue |
| Stack | `<stack>` | LIFO adapter over deque |
| Queue | `<queue>` | FIFO adapter over deque |
| Priority queue | `<queue>` | Heap (default max-heap) |
| Map | `<map>` | Ordered key-value, red-black tree |
| Unordered map | `<unordered_map>` | Hash table |
| Set | `<set>` | Ordered unique keys |
| Unordered set | `<unordered_set>` | Hash-based unique keys |

## Available Implementations

| Folder | File | Data structure |
|---|---|---|
| Graph | `Graph/graph_adjacency_list.cpp` | Graph + DFS traversal |
| HashTable | `HashTable/hash_map.cpp` | Hash map (separate chaining) |
| Heap | `Heap/kth_largest.cpp` | Min-heap for kth largest |
| LinkedList | `LinkedList/reverse_linked_list.cpp` | Singly linked list reverse |
| LinkedList | `LinkedList/linked_list_cycle.cpp` | Cycle detection (Floyd) |
| LinkedList | `LinkedList/merge_two_sorted_lists.cpp` | Merge two sorted lists |
| Queue | `Queue/queue_using_stacks.cpp` | Queue built from two stacks |
| Stack | `Stack/valid_parentheses.cpp` | Stack with STL `std::stack` |
| Tree | `Tree/binary_tree_traversal.cpp` | Inorder/preorder/postorder |
| Tree | `Tree/max_depth.cpp` | Maximum depth of a tree |

## Array

Fixed-size `std::array` or raw C array; O(1) random access, O(n) insert/delete.

```cpp
std::array<int, 5> a = {1, 2, 3, 4, 5};
int x = a[2];           // O(1)
a.fill(0);
```

## Vector (dynamic array)

```cpp
vector<int> v;          // most-used dynamic structure
v.push_back(10);        // amortized O(1)
int x = v.back();
v.pop_back();
sort(v.begin(), v.end());
```

## Linked List

STL `std::list<int>` for production; hand-rolled node for interviews. Iterative
reverse (see `LinkedList/reverse_linked_list.cpp`):
```cpp
ListNode* reverse(ListNode* head)
{
    ListNode *prev = nullptr, *curr = head, *next;
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

Cycle detection (`linked_list_cycle.cpp`): Floyd's tortoise and hare.

## Stack

STL `std::stack` (see `Stack/valid_parentheses.cpp`):
```cpp
stack<char> st;
st.push('(');          // push
char c = st.top();     // peek
st.pop();              // pop
bool empty = st.empty();
```

## Queue

STL `std::queue`; the folder also shows a queue built from two stacks
(`Queue/queue_using_stacks.cpp`), useful when only stacks are allowed.
```cpp
queue<int> q;
q.push(1);             // enqueue
int x = q.front();     // peek (FIFO)
q.pop();               // dequeue
```

## Hash Map

STL `unordered_map` (O(1) average); `map` is ordered (O(log n)). The folder's
`HashTable/hash_map.cpp` hand-rolls separate chaining with `vector<list<pair>>`:
```cpp
unordered_map<string, int> m;
m["apple"] = 5;                    // insert / update
int v = m.at("apple");             // read (throws if missing)
bool has = m.count("apple");       // 0 or 1
m.erase("apple");
```

## Heap

STL `std::priority_queue` is a max-heap by default (see `Heap/kth_largest.cpp`
for a manual min-heap approach to kth largest):
```cpp
priority_queue<int> pq;                        // max-heap
priority_queue<int, vector<int>, greater<int>> min_pq;  // min-heap
pq.push(5); pq.push(9);
int top = pq.top();                            // peek
pq.pop();                                      // remove max
```

## Tree

Binary tree node with STL `TreeNode` (see `Tree/binary_tree_traversal.cpp`):
```cpp
struct TreeNode { int val; TreeNode *left, *right; };

void inorder(TreeNode* r)
{
    if (!r) return;
    inorder(r->left);
    cout << r->val << " ";
    inorder(r->right);
}
```

Max depth (see `Tree/max_depth.cpp`):
```cpp
int max_depth(TreeNode* r)
{
    return r ? 1 + max(max_depth(r->left), max_depth(r->right)) : 0;
}
```

## Graph

Adjacency list (see `Graph/graph_adjacency_list.cpp`):
```cpp
vector<vector<int>> adj(n);
adj[u].push_back(v);     // undirected: also adj[v].push_back(u);
```

## Complexity Quick Reference

| Operation | Vector | List | Stack | Queue | Unordered_map | Priority_queue |
|---|---|---|---|---|---|---|
| Access / peek | O(1) | O(n) | O(1) | O(1) | O(1)* | O(1) |
| Search | O(n) | O(n) | O(n) | O(n) | O(1)* | O(n) |
| Insert | O(1) tail | O(1) | O(1) | O(1) | O(1)* | O(log n) |
| Delete | O(n) | O(1) | O(1) | O(1) | O(1)* | O(log n) |

*Average with a good hash function; worst case O(n).

| Structure | Space |
|---|---|
| Unordered map | O(n) |
| Binary tree | O(n) |
| Graph (adjacency list) | O(V + E) |

## Pitfalls

- `vector::push_back` invalidates iterators on reallocation - reserve capacity.
- `unordered_map` iteration order is unspecified; use `map` if order matters.
- `size()` returns `size_t`; comparing it with signed ints can wrap.
- `priority_queue::pop` removes the top but does not return it - peek first.
- Hand-rolled `new` nodes must be `delete`d to avoid leaks (use smart pointers).
- Modifying a container while iterating invalidates iterators (except list/map).
- `std::stack`/`std::queue` are adapters; you cannot iterate them directly.
