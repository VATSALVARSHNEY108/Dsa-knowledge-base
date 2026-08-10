# C++

C++ is a high-performance, statically typed, general-purpose language that extends C with
object-oriented, generic, and functional programming features. It is widely used in systems
programming, game engines, and competitive programming.

## Overview

- **Typing:** Static, strong
- **Paradigms:** Procedural, object-oriented, generic, functional
- **Key Strengths:** Maximum performance, fine-grained memory control, templates (STL)
- **Best For:** Game engines, high-frequency trading, competitive programming, OS

## OOP in C++

C++ offers a rich OOP model with zero-cost abstractions:

- **Classes & Objects** — With constructors, destructors, and RAII
- **Inheritance** — Single, multiple, and virtual inheritance
- **Encapsulation** — `public`, `protected`, `private` access specifiers
- **Polymorphism** — Virtual functions and vtable-based dispatch
- **Templates** — Compile-time generics (also enable generic programming)
- **Move Semantics** (C++11) — Efficient resource transfers
- **Smart Pointers** — `unique_ptr`, `shared_ptr`, `weak_ptr`

```cpp
#include <string>

class Animal {
protected:
    std::string name;
public:
    explicit Animal(const std::string& n) : name(n) {}
    virtual ~Animal() = default;
    virtual std::string speak() const = 0;
};

class Dog : public Animal {
public:
    explicit Dog(const std::string& n) : Animal(n) {}
    std::string speak() const override { return "Woof!"; }
};
```

## Repository Content

The `01-Programming-Languages/C++/` folder contains:

```
C++/
├── README.md                       # Language overview and learning path
├── cpp-introduction.md             # Getting started guide
├── Basics/
│   ├── cpp-basics-tutorial.md      # Fundamentals tutorial
│   └── syntax.md                   # Syntax reference
├── OOP/
│   ├── oop.md                      # OOP concepts and theory
│   └── classes.cpp                 # Example implementations
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
3. C++ Basics: syntax, data types, pointers
4. Object-Oriented Programming: classes, inheritance, polymorphism
5. Standard Template Library (STL): vectors, maps, sets, algorithms
6. [[Data-Structures]] and [[Algorithms]] in C++
7. [[Problem-Solving]] and competitive programming

## See Also

- [[Programming-Languages]] — Language comparison and overview
- [[Data-Structures]] — C++ DS implementations
- [[Algorithms]] — Algorithm examples in C++
- [[Time-Complexity]] — Big-O analysis
- [[Resources]] — Books, courses, and tools
