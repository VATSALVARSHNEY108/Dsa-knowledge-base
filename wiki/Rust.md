# Rust

Rust is a statically typed, compiled, multi-paradigm systems programming language focused
on safety and performance. Its ownership model eliminates data races at compile time without
a garbage collector.

## Overview

- **Typing:** Static, strong, with powerful type inference
- **Paradigms:** Procedural, object-oriented (via traits/structs), functional
- **Key Strengths:** Memory safety without GC, zero-cost abstractions, fearless concurrency
- **Best For:** Systems programming, WebAssembly, CLI tools, performance-critical services

## OOP in Rust

Rust does not have traditional classes or inheritance, but supports object-oriented
patterns through:

- **Structs & Enums** — Data modeling with fields and variants
- **impl Blocks** — Attach methods and associated functions to types
- **Traits** — Define shared behavior (like interfaces); enables polymorphism
- **Trait Objects** — `dyn Trait` for dynamic dispatch
- **Generics & Traits** — Compile-time polymorphism with trait bounds
- **Ownership & Borrowing** — Memory safety enforced at compile time
- **Modules & Visibility** — `pub`/`private` control of encapsulation

```rust
trait Animal {
    fn speak(&self) -> String;
}

struct Dog {
    name: String,
}

impl Animal for Dog {
    fn speak(&self) -> String {
        "Woof!".to_string()
    }
}
```

## Repository Content

The `01-Programming-Languages/Rust/` folder contains:

```
Rust/
├── README.md                       # Language overview and learning path
├── rust-introduction.md            # Getting started guide
├── Basics/
│   ├── rust-basics-tutorial.md     # Fundamentals tutorial
│   └── syntax.md                   # Syntax reference
├── OOP/
│   ├── oop.md                      # Structs, traits, ownership
│   └── oop.rs                      # Example implementations
├── Data-Structures/
│   ├── LinkedList/  Stack/  Queue/
│   ├── Tree/  HashTable/  Heap/  Graph/
└── Algorithms/
    ├── Array/  String/  Sorting/  Searching/
    ├── Intervals/  DynamicProgramming/  Graph/  Recursion/
```

## Learning Path

1. [[Getting-Started]]
2. [[Programming-Languages]]
3. Rust Basics: syntax, ownership, borrowing, lifetimes
4. Object-Oriented Programming: structs, enums, traits
5. Error Handling: `Result` and `Option`
6. [[Data-Structures]] and [[Algorithms]] in Rust
7. [[Problem-Solving]] and systems programming projects

## See Also

- [[Programming-Languages]] — Language comparison and overview
- [[Data-Structures]] — Rust DS implementations
- [[Algorithms]] — Algorithm examples in Rust
- [[System-Design]] — Building high-performance, reliable systems
- [[Resources]] — Books, courses, and tools
