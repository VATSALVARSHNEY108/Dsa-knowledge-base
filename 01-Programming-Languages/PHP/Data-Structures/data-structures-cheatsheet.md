---
layout: default
title: Data Structures Cheatsheet
parent: PHP
nav_order: 4
---

# PHP Data Structures Cheatsheet

Quick-reference for the data structure implementations in this folder. Each entry maps
to a file under `Data-Structures/`. Snippets run with PHP 7.4+.

## Available Files

| Category | File | Implementation |
| --- | --- | --- |
| Graph | `graph_adjacency_list.php` | Adjacency list graph class |
| Hash Table | `hash_map.php` | Hash map with chaining |
| Heap | `kth_largest.php` | SplMinHeap Kth largest |
| Linked List | `reverse_linked_list.php` | Iterative reversal |
| Linked List | `merge_two_sorted_lists.php` | Merge two sorted lists |
| Linked List | `linked_list_cycle.php` | Floyd's cycle detection |
| Queue | `queue_using_stacks.php` | Queue built from two stacks |
| Stack | `valid_parentheses.php` | Stack-based bracket matching |
| Tree | `binary_tree_traversal.php` | Inorder/preorder/postorder |
| Tree | `max_depth.php` | Max depth of a tree |

## Built-in Collections

| Collection | Declaration | Key Operations |
| --- | --- | --- |
| Array (list) | `$a = [1, 2]` | `[]`, `count`, `array_push`, `array_pop` |
| Array (map) | `$m = ['k' => 'v']` | `isset`, `array_key_exists`, `unset` |
| SplStack | `new SplStack()` | `push`, `pop`, `top` |
| SplQueue | `new SplQueue()` | `enqueue`, `dequeue` |
| SplPriorityQueue | `new SplPriorityQueue()` | `insert`, `extract` |
| SplMinHeap / SplMaxHeap | `new SplMinHeap()` | `insert`, `extract`, `top` |
| SplDoublyLinkedList | `new SplDoublyLinkedList()` | `push`, `pop`, `unshift`, `shift` |
| Iterator/Generator | `yield` | lazy sequences |

> PHP's array is a hybrid list + hash map (ordered by insertion). This makes many data
> structures trivial, but memory-heavy for very large collections. PHP 8.1+ adds
> `array_is_list()`, read-only properties, and `SplObjectStorage` for object keys.

## Core Data Structures

### Array (list / map)
```php
$list = [3, 1, 2];
$list[] = 4;                 // append O(1)
array_pop($list);            // remove last O(1)
array_shift($list);          // remove first O(n)
$map = ['apple' => 5];
$map['apple'];               // 5 — O(1) average
isset($map['apple']);        // true
```

### Linked List
```php
class ListNode {
    public $val;
    public $next;
    public function __construct($val = 0, $next = null) {
        $this->val = $val;
        $this->next = $next;
    }
}
// Iterative reversal
function reverseList(?ListNode $head): ?ListNode {
    $prev = null;
    $curr = $head;
    while ($curr !== null) {
        $next = $curr->next;
        $curr->next = $prev;
        $prev = $curr;
        $curr = $next;
    }
    return $prev;
}
```

### Stack
```php
$stack = [];           // or new SplStack()
$stack[] = 1;          // push O(1)
$top = array_pop($stack); // pop O(1)
// See valid_parentheses.php for a practical use
```

### Queue
```php
class MyQueue {
    private array $in = [];
    private array $out = [];
    public function enqueue($x): void { $this->in[] = $x; }
    private function transfer(): void {
        if (empty($this->out)) {
            while (!empty($this->in)) $this->out[] = array_pop($this->in);
        }
    }
    public function dequeue() {
        $this->transfer();
        return array_pop($this->out);
    }
    public function empty(): bool {
        return empty($this->in) && empty($this->out);
    }
}
```

### Hash Map
```php
class HashMap {
    private array $buckets;
    public function __construct(private int $capacity = 16) {
        $this->buckets = array_fill(0, $capacity, []);
    }
    private function hash($key): int {
        return crc32((string)$key) % $this->capacity;
    }
    public function put($key, $value): void {
        $idx = $this->hash($key);
        foreach ($this->buckets[$idx] as &$pair) {
            if ($pair[0] === $key) { $pair[1] = $value; return; }
        }
        $this->buckets[$idx][] = [$key, $value];
    }
    public function get($key) {
        $idx = $this->hash($key);
        foreach ($this->buckets[$idx] as $pair) {
            if ($pair[0] === $key) return $pair[1];
        }
        return null;
    }
}
```

### Heap
```php
$heap = new SplMinHeap();
$heap->insert(3);         // O(log n)
$heap->insert(1);
$heap->insert(2);
$heap->top();             // 1 — O(1)
$heap->extract();         // 1 — O(log n)
// SplMaxHeap for max-heap; see kth_largest.php for a practical use
```

### Tree
```php
class TreeNode {
    public $val;
    public $left;
    public $right;
    public function __construct($val = 0, $left = null, $right = null) {
        $this->val = $val;
        $this->left = $left;
        $this->right = $right;
    }
}
// Max depth
function maxDepth(?TreeNode $root): int {
    if ($root === null) return 0;
    return 1 + max(maxDepth($root->left), maxDepth($root->right));
}
// Inorder traversal
function inorder(?TreeNode $root, array &$result): void {
    if ($root === null) return;
    inorder($root->left, $result);
    $result[] = $root->val;
    inorder($root->right, $result);
}
```

### Graph (Adjacency List)
```php
class Graph {
    private array $adjList;
    public function __construct() { $this->adjList = []; }
    public function addVertex($v): void {
        if (!isset($this->adjList[$v])) $this->adjList[$v] = [];
    }
    public function addEdge($v1, $v2): void {
        $this->addVertex($v1);
        $this->addVertex($v2);
        $this->adjList[$v1][] = $v2;
        $this->adjList[$v2][] = $v1;
    }
    public function bfs($start): array {
        $visited = [$start => true];
        $queue = [$start];
        $result = [];
        while (!empty($queue)) {
            $node = array_shift($queue);
            $result[] = $node;
            foreach ($this->adjList[$node] as $neighbor) {
                if (!isset($visited[$neighbor])) {
                    $visited[$neighbor] = true;
                    $queue[] = $neighbor;
                }
            }
        }
        return $result;
    }
}
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Array (list) | O(1) | O(n) | O(n) | O(n) | contiguous-ish |
| Array (map) | - | O(1) avg | O(1) avg | O(1) avg | hash map, ordered |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | *at known node/head |
| Stack | - | O(n) | O(1) | O(1) | LIFO |
| Queue | - | O(n) | O(1) | O(1) | FIFO (array-based O(n) shift) |
| Hash Map | - | O(1) avg | O(1) avg | O(1) avg | O(n) worst |
| Heap | - | O(n) | O(log n) | O(log n) | top/extract O(1)/O(log n) |
| Binary Tree | O(log n) avg | O(log n) avg | O(log n) avg | O(log n) avg | O(n) worst skewed |
| Graph | - | O(V + E) | O(1) | O(E) | adjacency list |

## Pitfalls

- `array_shift` / `array_unshift` re-index arrays and are O(n); use `SplQueue` when order
  matters and performance is critical.
- `isset` returns false for `null` values; use `array_key_exists` to distinguish.
- Iterating `foreach ($arr as &$pair)` leaves a dangling reference — `unset($pair)` after.
- SPL heaps/queues implement a heap-like container; iteration order is NOT guaranteed
  sorted. Poll repeatedly to consume in order.
- `crc32` collisions or integer overflow when hashing; always `% capacity` and handle
  negatives with `& 0x7FFFFFFF`.
- Reference parameters (`array &$result`) are needed for in-place mutation; forgetting
  `&` causes silent copying.
- PHP arrays are memory-hungry: a 10M-element array can exhaust memory.
- Object identity in `===` compares references, not values — implement `equals()` where
  needed.
- `SplDoublyLinkedList` supports both stack and queue semantics; be explicit about mode.
