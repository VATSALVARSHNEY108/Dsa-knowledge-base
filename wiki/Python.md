# Python

Python is a high-level, dynamically typed, interpreted programming language known for
its readability and versatility. It is one of the most widely used languages for data
science, machine learning, automation, and rapid prototyping.

## Overview

- **Typing:** Dynamic, strong
- **Paradigms:** Object-oriented, functional, procedural
- **Key Strengths:** Readability, extensive standard library, huge ecosystem (pip)
- **Best For:** Data science, ML/AI, scripting, automation, web backends

## OOP in Python

Python supports full class-based object-oriented programming:

- **Classes & Objects** — Defined with the `class` keyword, constructors via `__init__`
- **Inheritance** — Single and multiple inheritance
- **Encapsulation** — Convention-based (underscore prefixes); no true private members
- **Polymorphism** — Duck typing; methods resolved at runtime
- **Magic Methods** — `__init__`, `__str__`, `__repr__`, `__add__`, etc.
- **Abstract Base Classes** — Via the `abc` module
- **Properties** — `@property` for computed/guarded attributes

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return "Woof!"
```

## Repository Content

The `01-Programming-Languages/Python/` folder contains:

```
Python/
├── README.md                       # Language overview and learning path
├── Basics/
│   ├── basics.md                   # Quick reference
│   ├── syntax.md                   # Complete syntax guide
│   ├── file-handling.md            # File I/O operations
│   ├── error-handling.md           # Exception handling
│   ├── comprehensions.md           # List/dict/set comprehensions
│   ├── decorators.md               # Decorators and closures
│   └── generators.md               # Generators and iterators
├── OOP/
│   ├── oop.md                      # OOP concepts and theory
│   └── classes.py                  # Example implementations
├── Data-Structures/
│   ├── python-introduction.md      # Python overview and setup
│   ├── LinkedList/  Stack/  Queue/
│   ├── Tree/  HashTable/  Heap/
└── Algorithms/
    ├── Array/  String/  Sorting/  Searching/
    ├── Intervals/  DynamicProgramming/  Graph/  Recursion/
```

## Learning Path

1. [[Getting-Started]]
2. [[Programming-Languages]]
3. Python Basics: syntax, data types, control flow
4. Advanced Basics: comprehensions, decorators, generators, file & error handling
5. Object-Oriented Programming: classes, inheritance, polymorphism
6. [[Data-Structures]] and [[Algorithms]] in Python
7. [[Problem-Solving]] on platforms like LeetCode, Codeforces
8. [[AI-ML]] and data science applications

## See Also

- [[Programming-Languages]] — Language comparison and overview
- [[Data-Structures]] — Python DS implementations
- [[Algorithms]] — Algorithm examples in Python
- [[Time-Complexity]] — Big-O analysis for Python operations
- [[Resources]] — Books, courses, and tools
