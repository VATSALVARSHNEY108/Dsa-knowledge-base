---
layout: default
title: Data Structures Cheatsheet
parent: JavaScript
nav_order: 4
---

# JavaScript Data Structures Cheatsheet

Quick-reference for the data structure implementations in this folder. Each entry maps
to a file under `Data-Structures/`. Snippets run with Node.js.

## Available Files

| Category | File | Implementation |
| --- | --- | --- |
| Graph | `graphAdjacencyList.js` | Adjacency list graph class |
| Hash Table | `hashMap.js` | Hash map with separate chaining |
| Heap | `kthLargest.js` | Min-heap + Kth largest |
| Linked List | `reverseLinkedList.js` | Iterative reversal |
| Linked List | `mergeTwoSortedLists.js` | Merge two sorted lists |
| Linked List | `linkedListCycle.js` | Floyd's cycle detection |
| Queue | `queueUsingStacks.js` | Queue built from two stacks |
| Stack | `validParentheses.js` | Stack-based bracket matching |
| Tree | `binaryTreeTraversal.js` | Inorder/preorder/postorder |
| Tree | `maxDepth.js` | Max depth of a tree |

## Built-in Collections

| Collection | Declaration | Key Methods |
| --- | --- | --- |
| Array | `let a = []` | `push`, `pop`, `shift`, `unshift`, `splice`, `slice` |
| Object (map) | `let o = {}` | dot/bracket access, `Object.keys`, `hasOwnProperty` |
| Map | `new Map()` | `set`, `get`, `has`, `delete`, `size` |
| Set | `new Set()` | `add`, `has`, `delete`, `size` |
| WeakMap/WeakSet | `new WeakMap()` | like Map/Set, keys must be objects, no iteration |
| Typed Arrays | `new Int32Array(10)` | fixed-size numeric arrays |
| String | `let s = "hi"` | `charAt`, `slice`, `indexOf`, `includes` |

> JavaScript has NO native linked list, stack, queue, tree, or heap. Arrays with
> `push`/`pop` act as stacks; `push` + `shift` (or an index pointer) act as a queue.

## Core Data Structures

### Array
```javascript
const arr = [3, 1, 2];
arr.push(4);           // [3,1,2,4] — O(1)
arr.pop();             // O(1)
arr.shift();           // removes first — O(n)
arr.sort((a, b) => a - b);
```

### Linked List
```javascript
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}
// Iterative reversal
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

### Stack
```javascript
const stack = [];
stack.push(1);      // O(1)
const top = stack.pop();  // O(1)
const peek = stack[stack.length - 1];
// Use for DFS, backtracking, bracket matching (see validParentheses.js)
```

### Queue
```javascript
class QueueUsingStacks {
  constructor() { this.inStack = []; this.outStack = []; }
  enqueue(val) { this.inStack.push(val); }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length > 0) this.outStack.push(this.inStack.pop());
    }
    return this.outStack.pop();
  }
  empty() { return this.inStack.length === 0 && this.outStack.length === 0; }
}
```

### Hash Map
```javascript
const map = new Map();
map.set('apple', 5);
map.get('apple');            // 5 — O(1) average
map.has('banana');           // false
map.delete('apple');
// See hashMap.js for a full chaining implementation
```

### Heap (Min-Heap)
```javascript
class MinHeap {
  constructor() { this.heap = []; }
  push(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[p] <= this.heap[i]) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }
  peek() { return this.heap[0]; }
  size() { return this.heap.length; }
}
// Full implementation + KthLargest in kthLargest.js
```

### Tree
```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
// Max depth
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
// Inorder traversal
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}
```

### Graph (Adjacency List)
```javascript
class Graph {
  constructor() { this.adjList = new Map(); }
  addVertex(v) { if (!this.adjList.has(v)) this.adjList.set(v, []); }
  addEdge(v1, v2) {
    this.addVertex(v1); this.addVertex(v2);
    this.adjList.get(v1).push(v2);
    this.adjList.get(v2).push(v1);
  }
  display() {
    for (const [v, neighbors] of this.adjList) {
      console.log(`${v} -> [${neighbors.join(', ')}]`);
    }
  }
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) | contiguous, index access |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | *at known node/head |
| Stack | - | O(n) | O(1) | O(1) | LIFO push/pop |
| Queue | O(1) | O(n) | O(1) | O(1) | FIFO enqueue/dequeue |
| Hash Map | - | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| Heap | - | O(n) | O(log n) | O(log n) | peek O(1) |
| Binary Tree | O(log n) avg | O(log n) avg | O(log n) avg | O(log n) avg | O(n) worst skewed |
| Graph | - | O(V + E) | O(1) | O(E) | via adjacency list |

## Pitfalls

- `Array.prototype.shift()` and `unshift()` are O(n); prefer index-pointer queues for
  BFS over large data.
- `Map`/`Set` compare by reference for objects — clone or use value keys.
- `map.has()` vs `map.get()`: `get` returns `undefined` for missing keys; check `has`.
- Heap index math: parent `(i-1)/2`, left `2i+1`, right `2i+2`; off-by-one causes bugs.
- Linked lists in JS are pointer-based; copying `head` to a variable does not copy nodes.
- Recursive tree traversals overflow the call stack on deep/skewed trees; use an
  explicit stack for iterative traversal.
- Mutating an array while iterating (`forEach`, `for...of`) skips/duplicates elements;
  iterate over a copy.
- Object key iteration order is not guaranteed for integer-like keys; use `Map` if order
  matters.
