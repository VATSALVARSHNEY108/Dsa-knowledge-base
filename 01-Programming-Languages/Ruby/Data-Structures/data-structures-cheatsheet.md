---
layout: default
title: Data Structures Cheatsheet
parent: Ruby
nav_order: 4
---

# Ruby Data Structures Cheatsheet

Quick-reference for core data structures in Ruby. Companion code lives in
`Ruby/Data-Structures/` under `LinkedList/`, `Stack/`, `Queue/`, `HashTable/`,
`Heap/`, `Tree/`, and `Graph/`.

> Ruby gives you arrays, hashes, sets, and more for free. Many "classic"
> problems reduce to picking the right built-in; implement a custom class
> only when the problem needs a specific behavior or you must show the
> mechanics.

## Built-in Collections

| Collection | Syntax / require | Typical Ops | Notes |
| ---------- | ---------------- | ----------- | ----- |
| Array | `[]` | push, pop, shift, unshift, `[]=` | Resizable, all languages |
| Hash | `{}` | `[]`, `[]=`, `key?`, `delete` | Ordered (insertion), O(1) avg |
| Set | `require 'set'` | `add`, `include?` | Unordered, no duplicates |
| Range | `1..5` | `cover?`, `each` | Lazily generated |
| Queue | `require 'thread'` | `push`, `pop` | Thread-safe, FIFO |
| String | `"..."` | `+`, `<<`, `chars` | Immutable-ish sequence |
| Struct | `Struct.new(:a, :b)` | attribute access | Lightweight object |

## Arrays

Ruby arrays are resizable, heterogeneous, and O(1) at the end.

```ruby
grid = Array.new(3) { Array.new(3, 0) } # 2-D, careful: block form!
arr  = Array.new(5, 0)                  # fill with a single value
```

> `Array.new(3) { [] }` vs `Array.new(3, [])` — the latter shares one
> array across all rows. Always use the block form for nested arrays.

## Linked List

Available in repo: `LinkedList/reverse_linked_list.rb`,
`LinkedList/merge_two_sorted_lists.rb`, `LinkedList/linked_list_cycle.rb`.

```ruby
class ListNode
  attr_accessor :val, :next
  def initialize(val = 0, nxt = nil)
    @val = val
    @next = nxt
  end
end

# Reverse a list iteratively
def reverse_list(head)
  prev = nil
  while head
    nxt = head.next
    head.next = prev
    prev = head
    head = nxt
  end
  prev
end
```

> Ruby has no built-in linked list; `Array` is usually a fine substitute
> (`arr.delete_at(0)` is O(n), matching a list's O(1) node removal but
> with worse constant factors for large sizes).

## Stack

Available in repo: `Stack/valid_parentheses.rb`. Ruby has no dedicated
`Stack` class; an `Array` gives you a stack for free.

```ruby
stack = []
stack.push(1)   # or <<
stack.pop        # LIFO
stack.last       # peek, O(1)
```

> Matching brackets with a stack is in `Stack/valid_parentheses.rb`.

## Queue

Available in repo: `Queue/queue_using_stacks.rb`. Use `Array` with `shift`/
`push`, or the stdlib `Queue`.

```ruby
queue = []
queue.push(1)
queue.shift   # FIFO: removes from front, O(n) on Array

# Queue using two stacks (see repo example)
class MyQueue
  def initialize = (@in = []; @out = [])
  def push(x) = @in.push(x)
  def pop
    transfer if @out.empty?
    @out.pop
  end
  def peek
    transfer if @out.empty?
    @out.last
  end
  def empty = @in.empty? && @out.empty?
  private def transfer = @out.push(@in.pop) until @in.empty?
end
```

> `shift` on an `Array` is O(n) because elements move down. Two-stack
> queues give amortized O(1) — the pattern in the repo example.

## Hash Map

Available in repo: `HashTable/hash_map.rb` (custom chaining implementation).
Ruby's `Hash` is a built-in hash map with O(1) average access.

```ruby
counts = Hash.new(0)      # default value, great for counting
counts['a'] += 1
```

## Heap

Available in repo: `Heap/kth_largest.rb` (custom min-heap). Ruby stdlib
has no heap; `Array#min`, `Array#sort`, or a hand-rolled heap are used.

```ruby
# Kth largest in a stream — min-heap of size k (see Heap/kth_largest.rb)
class KthLargest
  def initialize(k, nums)
    @k = k
    @heap = []
    nums.each { |n| add(n) }
  end

  def add(val)
    @heap.push(val)
    bubble_up(@heap.length - 1)
    if @heap.length > @k
      @heap[0] = @heap.pop
      sink_down(0)
    end
    @heap[0]
  end

  private

  def bubble_up(i)
    while i.positive? && @heap[(i - 1) / 2] > @heap[i]
      @heap[i], @heap[(i - 1) / 2] = @heap[(i - 1) / 2], @heap[i]
      i = (i - 1) / 2
    end
  end

  def sink_down(i)
    size = @heap.length
    loop do
      l = 2 * i + 1
      r = 2 * i + 2
      s = i
      s = l if l < size && @heap[l] < @heap[s]
      s = r if r < size && @heap[r] < @heap[s]
      break if s == i
      @heap[i], @heap[s] = @heap[s], @heap[i]
      i = s
    end
  end
end
```

> For quick needs: `arr.min` is O(n); a heap gives O(log n) per op when
> you add/remove repeatedly.

## Tree

Available in repo: `Tree/binary_tree_traversal.rb`, `Tree/max_depth.rb`.

```ruby
class TreeNode
  attr_accessor :val, :left, :right
  def initialize(val = 0, left = nil, right = nil)
    @val = val; @left = left; @right = right
  end
end

def max_depth(root)
  root.nil? ? 0 : 1 + [max_depth(root.left), max_depth(root.right)].max
end
```

Traversals: in-order `(left, root, right)`, pre-order `(root, left, right)`,
post-order `(left, right, root)`. See `Tree/binary_tree_traversal.rb`.

## Graph

Available in repo: `Graph/graph_adjacency_list.rb`. Represent as an
adjacency list: a hash mapping node -> array of neighbors.

```ruby
graph = {
  0 => [1, 2],
  1 => [0, 3],
  2 => [0, 4],
  3 => [1],
  4 => [2]
}

def bfs(graph, start)
  seen = { start => true }
  queue = [start]
  result = []
  until queue.empty?
    node = queue.shift
    result << node
    (graph[node] || []).each do |nb|
      next if seen[nb]
      seen[nb] = true
      queue << nb
    end
  end
  result
end
```

## Complexity Reference

| Data Structure | Access | Search | Insert | Delete | Space |
| -------------- | ------ | ------ | ------ | ------ | ----- |
| Array (end) | O(1) | O(n) | O(1) | O(1) | O(n) |
| Array (front/middle) | O(1) | O(n) | O(n) | O(n) | O(n) |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | O(n) |
| Stack | O(n) | O(n) | O(1) | O(1) | O(n) |
| Queue | O(n) | O(n) | O(1) | O(1) | O(n) |
| Hash Map | n/a | O(1) avg | O(1) avg | O(1) avg | O(n) |
| Heap | O(1) peek | O(n) | O(log n) | O(log n) | O(n) |
| Binary Tree (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| Graph (adj list) | O(1) | O(V + E) | O(1) | O(V + E) | O(V + E) |

\* Given a pointer to the node to remove or insert after.

## Pitfalls

- `Array.new(n, [])` shares one inner array; use the block form.
- Default mutable hash values: `Hash.new([])` shares one array across keys;
  use `Hash.new { |h, k| h[k] = [] }`.
- `Hash` iteration order is insertion order (since Ruby 1.9) — do not rely
  on it for sorted semantics.
- `Array#shift`/`#unshift` are O(n); use them sparingly in hot paths.
- Custom heap code is easy to get wrong; test with edge cases (duplicates,
  single element, empty) before trusting it.
- Tree/graph recursion can overflow the stack on deep structures; switch to
  an explicit stack/queue for large inputs.
