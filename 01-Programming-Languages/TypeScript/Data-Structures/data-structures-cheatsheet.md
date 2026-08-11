---
layout: default
title: Data Structures Cheatsheet
parent: TypeScript
nav_order: 4
---

# TypeScript Data Structures Cheatsheet

Quick-reference for core data structures in TypeScript. Companion code
lives in `TypeScript/Data-Structures/` under `LinkedList/`, `Stack/`,
`Queue/`, `HashTable/`, `Heap/`, `Tree/`, and `Graph/`.

> TypeScript brings typing to JavaScript's runtime collections. Arrays,
> `Map`, `Set`, and objects cover most needs; linked lists, heaps, trees,
> and graphs are usually hand-built as classes.

## Built-in Collections

| Collection | Example | Notes |
| ---------- | ------- | ----- |
| `number[]` | `[1, 2, 3]` | Array, O(1) index, ordered |
| `string` | `"abc"` | Immutable sequence of UTF-16 units |
| `Map<K, V>` | `new Map<string, number>()` | Key-value, O(1) avg |
| `Set<T>` | `new Set<number>()` | Unique values, O(1) avg |
| `object` | `{ a: 1 }` | Keys are strings/symbols |
| `Record<K, V>` | `Record<string, number>` | Typed object map |
| `T[]` / `ReadonlyArray<T>` | `readonly number[]` | Immutable view |
| `Tuple` | `[string, number]` | Fixed-size array |
| `null` / `undefined` | — | Missing values |
| `bigint` | `9007199254740993n` | Arbitrary-precision integers |

```typescript
const arr: number[] = [1, 2, 3];
arr.push(4);               // O(1) amortized
arr.pop();                 // O(1)

const m = new Map<string, number>();
m.set("a", 1);
m.get("a");                // number | undefined
m.has("a");                // true
m.delete("a");

const s = new Set<number>([1, 2, 3]);
s.has(2);                  // true
```

> Use `Map`/`Set` (not plain objects) when keys are dynamic or non-string;
> use `Record<string, T>` when you want an object with string keys.

## Arrays

Auto-resizing, O(1) append/remove at the end, O(n) at the front.

```typescript
const grid: number[][] = Array.from({ length: 3 }, () =>
  Array.from({ length: 3 }, () => 0)
);
arr.slice(0, 2);           // copy, non-mutating
arr.splice(1, 1);          // remove at index, mutating, O(n)
arr.indexOf(target);       // O(n)
```

> `Array.from` with a callback avoids shared-reference bugs that plague
> `Array(n).fill([])`.

## Linked List

Available in repo: `LinkedList/reverseLinkedList.ts`,
`LinkedList/mergeTwoSortedLists.ts`, `LinkedList/linkedListCycle.ts`.

```typescript
class ListNode {
  val: number;
  next: ListNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
```

## Stack

Available in repo: `Stack/validParentheses.ts`. An array with `push`/
`pop` is a stack; `at(-1)` peeks.

```typescript
const stack: number[] = [];
stack.push(1);
stack.pop();           // 1
stack[stack.length - 1]; // peek
```

> Matching brackets with a stack is in `Stack/validParentheses.ts`.

## Queue

Available in repo: `Queue/queueUsingStacks.ts` (two-stack queue). A plain
array queue is O(n) per `shift`; use an index pointer for O(1) amortized.

```typescript
class Queue<T> {
  private items: T[] = [];
  private head = 0;

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    if (this.head >= this.items.length) return undefined;
    return this.items[this.head++];
  }

  get size(): number {
    return this.items.length - this.head;
  }
}
```

## Hash Map

Available in repo: `HashTable/hashMap.ts` (custom implementation). The
built-in `Map` is the production choice.

> Two-sum pattern: store `Map<value, index>`, then for each element check
> whether `target - num` is already a key (`index.has` / `index.get`).
> Use `Map` over plain objects for numeric/object keys and for guaranteed
> insertion order. `Object.create(null)` for safe dictionary keys.

## Heap

Available in repo: `Heap/kthLargest.ts` (custom binary min-heap). JS/TS
has no stdlib heap; implement one or use a library.

```typescript
class MinHeap {
  private heap: number[] = [];

  size(): number {
    return this.heap.length;
  }

  peek(): number | undefined {
    return this.heap[0];
  }

  push(val: number): void {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    const top = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0 && bottom !== undefined) {
      this.heap[0] = bottom;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent] <= this.heap[idx]) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  private sinkDown(idx: number): void {
    const length = this.heap.length;
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let s = idx;
      if (left < length && this.heap[left] < this.heap[s]) s = left;
      if (right < length && this.heap[right] < this.heap[s]) s = right;
      if (s === idx) break;
      [this.heap[idx], this.heap[s]] = [this.heap[s], this.heap[idx]];
      idx = s;
    }
  }
}
```

> For the "kth largest in a stream" problem, cap the heap at size `k`
> (see `Heap/kthLargest.ts`).

## Tree

Available in repo: `Tree/binaryTreeTraversal.ts`, `Tree/maxDepth.ts`.

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) {
    this.val = val;
  }
}

function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

> `Tree/binaryTreeTraversal.ts` covers in-order, pre-order, post-order
> (recursive and iterative), and level-order traversals.

## Graph

Available in repo: `Graph/graphAdjacencyList.ts`. Adjacency list as
`Map<number, number[]>` or `Record<number, number[]>`.

```typescript
const graph: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 4],
  3: [1],
  4: [2],
};

function bfs(start: number): number[] {
  const visited = new Set<number>([start]);
  const queue: number[] = [start];
  const result: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Space |
| -------------- | ------ | ------ | ------ | ------ | ----- |
| Array (end) | O(1) | O(n) | O(1) | O(1) | O(n) |
| Array (front/middle) | O(1) | O(n) | O(n) | O(n) | O(n) |
| Map / Set | n/a | O(1) avg | O(1) avg | O(1) avg | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue (index pointer) | O(n) | O(n) | O(1) | O(1) | O(n) |
| Heap | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| Tree (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Graph (adj list) | O(1) | O(V + E) | O(1) | O(V + E) | O(V + E) |

\* Given a pointer to the node to remove/insert after.

## Pitfalls

- `shift()`/`unshift()` on arrays are O(n) — avoid in hot loops; use an
  index pointer for queues.
- `sort()` without a comparator sorts as strings; pass one for numbers.
- `Map` keys are strict-identity compared — object keys match only the
  same reference.
- `map.get()` returns `undefined` for missing keys; distinguish "absent"
  from "stored undefined" with `.has()`.
- `Array(n).fill([])` shares one array reference; build rows with
  `Array.from({ length: n }, () => [])`.
- Objects as maps inherit `Object.prototype` keys — use `Map` or
  `Object.create(null)` for untrusted keys.
