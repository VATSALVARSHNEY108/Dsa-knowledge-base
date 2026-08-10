# Go

Go (also known as Golang) is a statically typed, compiled programming language designed
at Google. It is known for its simplicity, efficiency, and strong support for concurrent
programming.

## Overview

- **Typing:** Static, strong
- **Paradigms:** Procedural, concurrent, (limited) object-oriented via composition
- **Key Strengths:** Fast compilation, built-in concurrency, garbage collection, rich standard library
- **Best For:** Microservices, cloud infrastructure, CLI tools, network servers

## OOP in Go

Go does not have traditional classes, but supports object-oriented patterns through
composition:

- **Structs** — User-defined data types with fields and methods
- **Methods** — Functions with receiver arguments
- **Interfaces** — Implicit satisfaction; interfaces are satisfied by implementing methods
- **Embedding** — Composition over inheritance for code reuse
- **Encapsulation** — Capitalized identifiers are exported, lowercase are package-private
- **Goroutines & Channels** — Lightweight concurrency built into the language

```go
type Animal interface {
    Speak() string
}

type Dog struct {
    name string
}

func (d Dog) Speak() string {
    return "Woof!"
}
```

## Repository Content

The `01-Programming-Languages/Go/` folder contains:

```
Go/
├── README.md                       # Language overview and learning path
├── go-introduction.md              # Getting started guide
├── Basics/
│   ├── go-basics-tutorial.md       # Fundamentals tutorial
│   └── syntax.md                   # Syntax reference
├── OOP/
│   ├── oop.md                      # Composition, structs, interfaces
│   └── oop.go                      # Example implementations
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
3. Go Basics: syntax, goroutines, channels
4. Object-Oriented Programming: structs, methods, interfaces
5. [[Data-Structures]] and [[Algorithms]] in Go
6. [[Problem-Solving]] and competitive programming
7. [[DevOps-Cloud]] and microservices development

## See Also

- [[Programming-Languages]] — Language comparison and overview
- [[Data-Structures]] — Go DS implementations
- [[Algorithms]] — Algorithm examples in Go
- [[DevOps-Cloud]] — Go in cloud infrastructure and microservices
- [[Resources]] — Books, courses, and tools
