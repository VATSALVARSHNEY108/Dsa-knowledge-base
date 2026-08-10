# JavaScript

JavaScript is a dynamically typed, multi-paradigm language primarily used for web
development. With Node.js, it extends to server-side programming. ES6+ introduced
significant OOP capabilities.

## Overview

- **Typing:** Dynamic, strong
- **Paradigms:** Event-driven, functional, object-oriented (prototype-based)
- **Key Strengths:** Ubiquitous in browsers, async/await, huge ecosystem (npm)
- **Best For:** Web apps, serverless functions, real-time apps, full-stack

## OOP in JavaScript

JavaScript uses prototype-based OOP, enhanced by ES6 `class` syntax:

- **Prototypes** — Objects inherit from other objects via the prototype chain
- **ES6 Classes** — Syntactic sugar over prototypes (`class`, `extends`, `super`)
- **Encapsulation** — Private fields (`#field`), closures, module pattern
- **Polymorphism** — Duck typing; method resolution via prototype chain
- **Mixins** — Composition patterns for code reuse
- **Object.create()** — Direct prototype manipulation
- **Symbols & Well-Known Symbols** — Custom behavior for built-in operations

```javascript
class Animal {
    #name;
    constructor(name) { this.#name = name; }
    speak() { throw new Error("Not implemented"); }
}

class Dog extends Animal {
    speak() { return "Woof!"; }
}
```

## Repository Content

The `01-Programming-Languages/JavaScript/` folder contains:

```
JavaScript/
├── README.md                       # Language overview and learning path
├── javascript-introduction.md      # Getting started guide
├── Basics/
│   ├── javascript-basics-tutorial.md # Fundamentals tutorial
│   └── syntax.md                   # Syntax reference
├── OOP/
│   ├── oop.md                      # OOP concepts and theory
│   └── classes.js                  # Example implementations
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
3. JavaScript Basics: syntax, data types, control flow
4. Asynchronous JavaScript: Promises, async/await, event loop
5. Object-Oriented Programming: prototypes, classes, modules
6. [[Data-Structures]] and [[Algorithms]] in JavaScript
7. [[Web-Development]] — frontend and backend applications

## See Also

- [[Programming-Languages]] — Language comparison and overview
- [[Data-Structures]] — JavaScript DS implementations
- [[Algorithms]] — Algorithm examples in JavaScript
- [[Web-Development]] — Frontend, backend, and frameworks
- [[Resources]] — Books, courses, and tools
