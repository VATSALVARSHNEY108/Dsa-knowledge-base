---
layout: default
title: Rust Cheatsheet
parent: Rust
nav_order: 1
---

# Rust Cheatsheet

Quick-reference for Rust: a memory-safe systems language with
ownership, zero-cost abstractions, and fearless concurrency.

## Core Syntax

### Variables and Types

```rust
// let binds immutable, mut makes it mutable
let x = 5;                 // i32 by default
let mut count = 0;
count += 1;

// Explicit type annotations
let price: f64 = 19.99;
let name: &str = "hello";  // string slice
let flag: bool = true;
let ch: char = 'a';

// Shadowing allows reusing a name
let s = "1";
let s: i32 = s.parse().expect("parse failed");
```

> The compiler infers types but never violates safety.
> Shadowing differs from `mut`: it creates a new binding.

### Control Flow

```rust
let n = 10;
if n > 5 {
    println!("big");
} else if n > 2 {
    println!("mid");
} else {
    println!("small");
}

// match (exhaustive)
match n {
    0 => println!("zero"),
    1..=5 => println!("small"),
    _ => println!("other"),
}
```

### Loops

```rust
// while
let mut i = 0;
while i < 10 {
    i += 1;
}

// for over ranges and iterators
for x in 0..5 {            // 0,1,2,3,4
    println!("{}", x);
}
for (idx, val) in vec.iter().enumerate() {
    println!("{}: {}", idx, val);
}
```

### Functions

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b            // last expression is the return
}

let result = add(2, 3);    // 5
```

### Closures

```rust
let square = |x: i32| x * x;
let items: Vec<i32> = vec![1, 2, 3].into_iter()
    .map(|x| x * 2)
    .collect();
```

## Ownership & Borrowing

```rust
// Ownership: each value has exactly one owner
let s = String::from("hello");
let t = s;                 // s is MOVED, s no longer usable

// Clone for explicit deep copy
let a = String::from("hi");
let b = a.clone();         // both usable

// Borrowing with references
fn len(s: &String) -> usize { s.len() }
let s = String::from("abc");
let l = len(&s);           // s still usable after

// Mutable borrow
fn push_str(s: &mut String, extra: &str) {
    s.push_str(extra);
}
let mut s = String::from("a");
push_str(&mut s, "b");
```

> Borrow rules: either one mutable reference OR many
> immutable references, never both at once.

> Lifetimes prevent dangling references at compile time.
> Most cases use elision; explicit `'a` only where needed.

## Option & Result

```rust
// Option<T>: Some(value) or None
let maybe: Option<i32> = Some(5);
match maybe {
    Some(v) => println!("{v}"),
    None => println!("nothing"),
}
let doubled = maybe.map(|v| v * 2);          // Some(10)
let or_zero = maybe.unwrap_or(0);

// Result<T, E>: Ok(value) or Err(e)
fn div(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("divide by zero".into()) }
    else { Ok(a / b) }
}
```

> `Option` and `Result` must be handled — the compiler
> forces it. There is no null in Rust.

## Data Structures & Collections

| Type | Description | Common Methods |
|------|-------------|----------------|
| `Vec<T>` | Growable array | `push`, `pop`, `len`, `get`, `contains` |
| `String` | UTF-8 string | `push_str`, `len`, `chars`, `split` |
| `&str` | String slice | `len`, `starts_with`, `contains` |
| `HashMap<K,V>` | Hash table | `insert`, `get`, `entry`, `contains_key` |
| `HashSet<T>` | Unique values | `insert`, `contains`, `remove`, `union` |
| `VecDeque<T>` | Double-ended queue | `push_front`, `pop_back` |
| `BinaryHeap<T>` | Max-heap | `push`, `pop`, `peek` |
| `Option<T>` / `Result<T,E>` | Optional / fallible | `map`, `unwrap_or`, `ok_or` |

```rust
// Vectors
let mut v: Vec<i32> = Vec::new();
v.push(1);
v.push(2);
let v2 = vec![1, 2, 3];            // macro form
let first = v2[0];
let safe = v2.get(5);              // Option<&i32>

// HashMap
use std::collections::HashMap;
let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.entry(String::from("Red")).or_insert(20);

// HashSet
use std::collections::HashSet;
let mut seen = HashSet::new();
seen.insert("a");
seen.contains("a");                // true
```

## String Handling

```rust
let s = String::from("hello, world");
s.len()                          // 12 (bytes, not chars)
s.is_empty()                     // false
s.starts_with("hello")           // true
s.contains("world")              // true
s.replace("hello", "hi")         // new String
s.to_uppercase()                 // "HELLO, WORLD"

// Split, join, iterate characters (UTF-8 safe)
let words: Vec<&str> = "a,b,c".split(',').collect();
let joined = words.join("-");    // "a-b-c"
for ch in s.chars() {
    println!("{ch}");
}

// Numbers to/from strings
let n: i32 = "42".parse().expect("parse failed");
let text = 42.to_string();
```

> Rust strings are UTF-8 byte sequences; `len()` counts bytes,
> so multi-byte characters need `.chars()` iteration.

## Structs & Enums

```rust
// Struct with named fields
struct Point {
    x: f64,
    y: f64,
}

// Methods via impl
impl Point {
    fn new(x: f64, y: f64) -> Self {
        Point { x, y }
    }
    fn dist_from_origin(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
}

// Enum with data
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

let msg = Message::Move { x: 1, y: 2 };
```

> Enums + `match` are Rust's way of modeling ADTs with
> exhaustive, compile-time-checked handling.

## Traits

```rust
// Traits define shared behavior
trait Greet {
    fn greet(&self) -> String;
}

struct Dog { name: String }

impl Greet for Dog {
    fn greet(&self) -> String {
        format!("woof, I'm {}", self.name)
    }
}
```

> Common std traits: `Debug`, `Clone`, `Copy`, `PartialEq`,
> `Eq`, `Hash`, `Default`, `Iterator`, `From`.

## Error Handling

```rust
use std::fs;

// The ? operator propagates errors automatically
fn read_config(path: &str) -> Result<String, std::io::Error> {
    let data = fs::read_to_string(path)?;
    Ok(data)
}

// Custom error types via enums
#[derive(Debug)]
enum AppError {
    NotFound,
    Invalid(String),
}
```

> `?` unwraps `Ok` or returns early with `Err`.
> It only works inside functions that return `Result` or `Option`.

## Cargo Basics

```bash
cargo new my_app           # new binary project
cargo build                # debug build
cargo build --release      # optimized build
cargo run                  # build and run
cargo test                 # run tests
cargo check                # fast type check, no binary
cargo add serde            # add dependency
```

```toml
# Cargo.toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
```

## Common Built-ins / Standard Library

- `std::iter` — `Iterator` trait: `map`, `filter`, `fold`,
  `collect`, `enumerate`, `take`, `skip`, `any`, `all`.
- `Vec` / `VecDeque` / `HashMap` / `HashSet` — core collections.
- `Option` / `Result` — `map`, `and_then`, `ok_or`, `?`.
- `Box<T>`, `Rc<T>`, `Arc<T>`, `RefCell<T>` — smart pointers.
- Formatting — `format!`, `println!`, `eprintln!`, `write!`.
- `std::fs` — file read/write, `read_to_string`, `write`.
- `std::cmp` — `min`, `max`, `Ord`, `PartialOrd`.
- `std::convert` — `From` / `TryFrom` conversions.
- `std::mem` — `size_of`, `drop`, `swap`, `take`.
- Common traits — `Debug`, `Clone`, `Copy`, `PartialEq`,
  `Eq`, `Hash`, `Default`, `Display`, `From`.

> Rust has no runtime standard library bloat; everything lives
> in `std`, with `core` available for no_std targets.

## Memory & Performance Notes

- No garbage collector; memory freed when ownership ends.
- Stack vs heap: primitives and fixed arrays on stack,
  `Vec`/`String`/`Box` allocate on the heap.
- `Copy` types duplicate by assignment; `Clone` is explicit.
- Ownership enables RAII-style automatic cleanup.
- Zero-cost abstractions: iterators compile as fast as loops.
- Data-race-free guarantees make concurrency safe to write.
- `Box<T>` for heap allocation, `Rc<T>` for shared ownership,
  `RefCell<T>` for interior mutability (single-threaded).
- Unsafe code (`unsafe { }`) opts out of some guarantees.
- Release builds are fast: `cargo build --release`.

> Rust gives C-level performance with memory safety —
> the cost is learning the borrow checker.

## Real-World Use Cases

- Systems programming: OS kernels, drivers, embedded devices.
- WebAssembly (compile Rust to run in browsers).
- High-performance web services and network tools.
- CLI tools (ripgrep, fd, bat, alacritty).
- Game engines and graphics pipelines.
- Blockchain and crypto infrastructure.
- Database engines, browsers (Firefox's Servo).
- Network servers requiring high throughput and safety.

## Common Pitfalls

1. **Borrow checker fights** — cannot borrow mutable and
   immutable at once; restructure to avoid holding refs.
2. **Use-after-move** — once a value is moved, the old
   binding is unusable; use references or clone.
3. **String vs &str confusion** — `String` owns heap data;
   `&str` is a view into a string.
4. **Indexing returns values, iterating returns references** —
   `for x in v` moves, `for x in &v` borrows.
5. **`unwrap()` panic** — avoid in production; use `?`,
   `unwrap_or`, or `match`.
6. **Integer overflow** — release builds wrap silently;
   use `checked_add` when it matters.
7. **HashMap iteration order is random** — sort if order matters.
8. **String indexing by byte** — `s[0]` fails on multi-byte
   UTF-8 chars; iterate with `.chars()`.
9. **Lifetime errors on returned references** — add explicit
   lifetimes or return owned types.
10. **`mut` forgot on loop variables** — `for mut x in ...`.

## Interview Tips

1. Be ready to explain ownership, borrowing, and lifetimes —
   the top Rust interview topics.
2. Know `Option`, `Result`, and the `?` operator cold.
3. Practice `match` with enums including pattern guards.
4. Be comfortable with iterator chains: `map`, `filter`,
   `fold`, `collect`, `enumerate`.
5. Know the difference between `str`/`String`, `Vec`/`slice`,
   and `&T` vs `&mut T`.
6. Explain `Rc`, `Arc`, `RefCell`, and `Mutex` and when to use each.
7. Understand trait objects (`dyn Trait`) vs generics.
8. Practice common algorithms (FizzBuzz, palindrome, word count)
   in idiomatic Rust.
9. Know Cargo commands and how the compiler error messages help
   guide fixes.
10. Mention `cargo clippy` and `cargo fmt` as best-practice tools.
