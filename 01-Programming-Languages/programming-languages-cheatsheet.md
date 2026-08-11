---
layout: default
title: Programming Languages Cheatsheet
parent: Programming Languages
nav_order: 1
---

# Programming Languages Cheatsheet

Quick reference for common syntax across popular languages
plus guidance for choosing the right language.

## Core Concepts

- **C** — Low-level, manual memory, no OOP. Fast, closest to hardware.
- **C++** — C + OOP + templates + STL. Top choice for competitive
  programming and systems.
- **Java** — OOP, JVM, garbage collected. Strong typing, big ecosystem.
- **Python** — Readable, dynamic, batteries included. Best for data,
  interviews, and scripting.
- **JavaScript** — Event-driven, runs in browsers and Node.js. Web standard.
- **Go** — Compiled, simple, built-in concurrency (goroutines).
- **Rust** — Memory safe without GC, ownership model, zero-cost abstractions.
- **TypeScript** — JavaScript with static types, superset, compile to JS.

> Universities teach the "big four": C, C++, Java, Python.
> The real world needs: JavaScript (web), Go (cloud), Rust (systems).

## Hello World

| Language | Code |
|----------|------|
| C | `printf("Hello, World!\n");` |
| C++ | `cout << "Hello, World!\n";` |
| Java | `System.out.println("Hello, World!");` |
| Python | `print("Hello, World!")` |
| JavaScript | `console.log("Hello, World!");` |
| Go | `fmt.Println("Hello, World!")` |
| Rust | `println!("Hello, World!");` |
| TypeScript | `console.log("Hello, World!");` |

## Variables and Types

| Language | Declaration | Type Inference | Mutability |
|----------|-------------|----------------|------------|
| C | `int x = 5;` | Not needed | Manual |
| C++ | `int x = 5;` | `auto x = 5;` | Manual |
| Java | `int x = 5;` | `var x = 5;` | Manual |
| Python | `x = 5` | Dynamic | Implicit |
| JavaScript | `let x = 5;` | Dynamic | `let` vs `const` |
| Go | `var x int = 5` | `x := 5` | `var` vs `const` |
| Rust | `let mut x = 5;` | `let x = 5;` | `mut` keyword |
| TypeScript | `let x: number = 5;` | `let x = 5;` | `let` vs `const` |

> Python and JavaScript infer types dynamically at runtime.
> TypeScript and Rust catch type errors at compile time.

## Loops

```python
# Python - for and while
for i in range(10):
    print(i)

while x < 10:
    x += 1
```

```javascript
// JavaScript - for, for...of, for...in, while
for (let i = 0; i < 10; i++) {
    console.log(i);
}

for (const item of items) {
    console.log(item);
}

while (x < 10) {
    x++;
}
```

```c
// C - classic for, while, do-while
for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
}

while (x < 10) {
    x++;
}
```

```java
// Java - same as C with for-each
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

for (int item : items) {
    System.out.println(item);
}
```

```go
// Go - single for loop, range over slices/maps
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

for i, item := range items {
    fmt.Println(i, item)
}
```

```rust
// Rust - for + range, iterators
for i in 0..10 {
    println!("{}", i);
}

for item in items.iter() {
    println!("{}", item);
}
```

## Functions

| Language | Syntax |
|----------|--------|
| C | `int add(int a, int b) { return a + b; }` |
| C++ | `int add(int a, int b) { return a + b; }` |
| Java | `static int add(int a, int b) { return a + b; }` |
| Python | `def add(a, b): return a + b` |
| JavaScript | `function add(a, b) { return a + b; }` |
| Go | `func add(a, b int) int { return a + b }` |
| Rust | `fn add(a: i32, b: i32) -> i32 { a + b }` |
| TypeScript | `function add(a: number, b: number): number { return a + b; }` |

Lambda / one-line forms:

```js
// JavaScript / TypeScript arrow functions
const add = (a, b) => a + b;
```

```rust
// Rust closure
let add = |a: i32, b: i32| a + b;
```

```python
# Python lambda
add = lambda a, b: a + b
```

```go
// Go anonymous function
add := func(a, b int) int { return a + b }
```

## Collections / Data Structures

| Type | C | C++ | Java | Python | JavaScript | Go | Rust | TypeScript |
|------|-------|----------|---------|--------|-----------|-----|------|------------|
| Array | `int a[10]` | `array` / `vector` | `int[]` | `list` | `Array` | `[]int` | `[T; N]` | `number[]` |
| Dynamic list | manual | `std::vector` | `ArrayList` | `list` | `Array` | `slice` | `Vec<T>` | `number[]` |
| Hash map | manual | `std::unordered_map` | `HashMap` | `dict` | `Map` | `map` | `HashMap` | `Map` |
| Set | manual | `std::set` | `HashSet` | `set` | `Set` | `map` | `HashSet` | `Set` |
| Stack | manual | `std::stack` | `Deque` | `list` | `Array` | custom | `Vec<T>` | `Array` |
| Queue | manual | `std::queue` | `Queue` | `collections.deque` | `Array` | custom | `VecDeque` | `Array` |

```python
# Python collections quick reference
nums = [1, 2, 3]
d = {"key": "value"}
s = {1, 2, 3}
from collections import deque
q = deque([1, 2, 3])
```

```go
// Go collections quick reference
nums := []int{1, 2, 3}
m := map[string]int{"key": 1}
s := map[int]bool{1: true}
```

```rust
// Rust collections quick reference
let v = vec![1, 2, 3];
use std::collections::HashMap;
let mut m = HashMap::new();
m.insert("key", 1);
```

## Common Operations Comparison

| Operation | Python | JavaScript | Go | Rust |
|-----------|--------|-----------|-----|------|
| Length | `len(x)` | `x.length` | `len(x)` | `x.len()` |
| Sort | `sorted(x)` | `x.sort()` | `sort.Ints(x)` | `x.sort()` |
| Add to end | `x.append(v)` | `x.push(v)` | `append(x, v)` | `x.push(v)` |
| Merge strings | `"a" + "b"` | `"a" + "b"` | `"a" + "b"` | `format!("{}", s)` |
| Check membership | `v in x` | `x.includes(v)` | loop | `x.contains(&v)` |
| String length | `len(s)` | `s.length` | `len(s)` | `s.len()` |

## Memory and Safety Model

| Language | Memory | Garbage Collected | Null Safety |
|----------|--------|-------------------|-------------|
| C | Manual (`malloc`/`free`) | No | No |
| C++ | Manual (`new`/`delete`, RAII) | No | No |
| Java | JVM GC | Yes | Partial |
| Python | Ref count + GC | Yes | No (`None`) |
| JavaScript | V8 GC | Yes | No (`null`/`undefined`) |
| Go | GC | Yes | No (`nil`) |
| Rust | Ownership / borrow checker | No | Yes (`Option`) |
| TypeScript | JS GC | Yes | Yes (types) |

> Rust prevents use-after-free and data races at compile time.
> C/C++ give full control but require discipline.

## When to Choose Which

| Need | Best Pick | Runner Up |
|------|-----------|-----------|
| Competitive programming | C++ | Python, Java |
| Web backend | Go, Node.js | Python, Rust |
| Web frontend | TypeScript | JavaScript |
| Data science / ML | Python | R, Julia |
| Systems / embedded | C, Rust | C++ |
| Android apps | Kotlin (Java) | C++ |
| iOS / macOS | Swift | Rust |
| Enterprise services | Java | Go, C# |
| Scripting / automation | Python | Bash, JS |
| High-performance net services | Rust, Go | C++ |

## Language Speed Ranking (Approximate)

```
Fastest:  Rust, C, C++, Go
Mid:      Java, TypeScript (compiled JS)
Slow:     Python, JavaScript (large numeric loops)
```

> For 10^7+ tight loops, Python may time out.
> Use C++ or Go; or rewrite hot loops in Python with
> NumPy / bit tricks.

## Common Pitfalls

1. **Python** — Mutable default arguments, shadowing built-ins,
   `x += 1` inside loops creates new int objects.
2. **JavaScript** — `==` vs `===`, `var` hoisting, `this` binding,
   0.1 + 0.2 floating point issues.
3. **C/C++** — Buffer overflows, pointer leaks, undefined behavior,
   signed/unsigned mixing.
4. **Java** — Autoboxing overhead, compare primitives with `==`
   but objects with `.equals()`.
5. **Go** — `nil` map writes panic, goroutine leaks, slice aliasing.
6. **Rust** — Borrow checker fights reference cycles; use `&`
   vs `&mut` consciously.
7. **TypeScript** — `any` disables safety, `null` vs `undefined`.
8. Off-by-one on `range`/`slice` bounds in every language.

## Interview / Learning Tips

1. Pick ONE primary language and master it deeply.
2. Know the exact Big-O behavior of built-in structures.
3. Practice standard library: sorting, hashing, priority queues.
4. Write clean signatures; readability is graded too.
5. In interviews, Python is often the fastest to write.
6. In competitive platforms, C++ gives the best edge cases.
7. Learn a second language that is greatly different
   (e.g., Python then Rust).
8. Always know how your language handles: strings vs chars,
   integers vs floats, and null vs empty.

> "The best language to learn first is the one you will
> actually write every day." — Practice beats theory.

## Quick Start Steps

1. Print a greeting in all 8 languages from the tables above.
2. Write FizzBuzz in Python, JavaScript, Go, and Rust.
3. Build the same data structure (stack, queue, hash map)
   using each language's standard library.
4. Compare memory and speed of a 10^7 loop across
   C++, Python, and Go.
5. Choose your main language and set interview/contest
   templates for it.