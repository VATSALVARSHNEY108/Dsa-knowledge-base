# Java

Java is a statically typed, class-based, object-oriented programming language designed
for portability ("write once, run anywhere"). It is the foundation of Android development
and a cornerstone of enterprise software.

## Overview

- **Typing:** Static, strong
- **Paradigms:** Object-oriented, functional (Java 8+)
- **Key Strengths:** Platform independence, mature ecosystem, memory safety, garbage collection
- **Best For:** Enterprise apps, Android, microservices, big data processing

## OOP in Java

Java is fundamentally OOP — every piece of code must reside inside a class:

- **Classes & Objects** — First-class support with constructors
- **Inheritance** — Single inheritance with `extends`, interfaces with `implements`
- **Encapsulation** — `private`, `protected`, `public` access modifiers
- **Polymorphism** — Method overriding and interface-based polymorphism
- **Abstract Classes & Interfaces** — Full support with default methods (Java 8+)
- **Generics** — Type parameterization for classes and methods
- **Records** (Java 16+) — Immutable data carriers

```java
class Animal {
    private final String name;

    Animal(String name) { this.name = name; }

    public String speak() {
        throw new UnsupportedOperationException();
    }
}

class Dog extends Animal {
    Dog(String name) { super(name); }

    @Override
    public String speak() { return "Woof!"; }
}
```

## Repository Content

The `01-Programming-Languages/Java/` folder contains:

```
Java/
├── README.md                       # Language overview and learning path
├── Basics/
│   ├── java-basics-tutorial.md     # Fundamentals tutorial
│   └── syntax.md                   # Syntax reference
├── OOP/
│   ├── oop.md                      # OOP concepts and theory
│   └── classes.java                # Example implementations
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
3. Java Basics: syntax, data types, control flow
4. Object-Oriented Programming: classes, inheritance, interfaces
5. Java Collections Framework and Generics
6. [[Data-Structures]] and [[Algorithms]] in Java
7. [[Problem-Solving]] and competitive programming

## See Also

- [[Programming-Languages]] — Language comparison and overview
- [[Data-Structures]] — Java DS implementations
- [[Algorithms]] — Algorithm examples in Java
- [[19-Java-Fundamentals]] — Core Java, collections, concurrency
- [[Resources]] — Books, courses, and tools
