---
layout: default
title: OOP Cheatsheet
parent: Object Oriented Programming
nav_order: 1
---

# Object-Oriented Programming Cheat Sheet

Quick reference for the four pillars of OOP with Python examples,
class vs object, access modifiers, and common interview topics.

## Core Concepts

- **Class**: a blueprint or template defining state (attributes)
  and behavior (methods).
- **Object**: an instance of a class, holding concrete state.
- **Four pillars**: Encapsulation, Inheritance, Polymorphism,
  Abstraction.
- **Message passing**: objects interact by calling each other's methods.

## The Four Pillars

| Pillar | Idea | Looks like in code |
|--------|------|--------------------|
| Encapsulation | Hide internal state, expose a safe API | private fields + public methods |
| Inheritance | Reuse and extend existing behavior | class Dog(Animal) |
| Polymorphism | Same interface, many implementations | overriding, duck typing |
| Abstraction | Expose *what*, hide *how* | abstract classes, interfaces |

### 1. Encapsulation

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self._owner = owner
        self.__balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self.__balance += amount

    def balance(self):
        return self.__balance
```

### 2. Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

class Cat(Animal):
    def speak(self):
        return "Meow"
```

### 3. Polymorphism

```python
animals = [Dog("Rex"), Cat("Socks"), Animal("Ghost")]
for a in animals:
    print(a.speak())          # Woof, Meow, ...

def make_sound(animal):
    return animal.speak()     # works for any speak() object
```

### 4. Abstraction

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2
```

> Python has no true `private`: `_x` is a convention, `__x` triggers
> name mangling (`_ClassName__x`). Java has private/protected/public.

## Class vs Object

| | Class | Object |
|-----------|-------|--------|
| Nature | Blueprint, defined once | Concrete instance |
| Created by | `class` keyword | calling `ClassName()` |
| Memory | Shared template | Own storage for state |
| Example | `Car` | `my_car = Car("red")` |
| Count | One per design | Many at runtime |

## Access Modifiers

| Modifier | Python | Java | Access |
|----------|--------|------|--------|
| Public | `name` | `public` | Everyone |
| Protected | `_name` | `protected` | Class + subclasses |
| Private | `__name` | `private` | Same class only |

## Overloading vs Overriding

| | Overloading | Overriding |
|-----------|-------------|-------------|
| When | Compile time | Runtime |
| What | Same name, different parameters | Same signature, new body |
| Python | Not supported natively | Yes (methods) |
| Java/C++ | Yes | Yes |
| Purpose | Convenience per arg types | Change behavior in subclass |

> Python emulates overloading with default args, `*args`, or
> `@functools.singledispatch`.

## Composition vs Inheritance

| | Inheritance (is-a) | Composition (has-a) |
|-----------|---------------------|------------------------|
| Relation | `Dog` is an `Animal` | `Car` has an `Engine` |
| Coupling | Tight, inherits all | Loose, explicit parts |
| Change | Fragile hierarchies | Easy to swap parts |
| Reuse | Code reuse via base | Object reuse |
| Prefer | Strong subtype | Most other cases |

```python
# Prefer composition
class Engine:
    def start(self): return "engine on"

class Car:
    def __init__(self):
        self.engine = Engine()
```

## Real-World Examples

- Payment gateways: base `Payment`, subclasses credit/debit/UPI ->
  polymorphism in one handler.
- Shape renderer: `draw()` on circle, square, triangle.
- Logging framework: abstract `Logger`, console/file/cloud loggers.
- Game entities: `Character` base, `Player`/`NPC` subclasses.
- GUI framework: `Widget` base, `Button`/`Checkbox` subclasses.

## Key Rules / Formulas

- Cohesion high, coupling low.
- Program to interfaces, not implementations.
- Use inheritance only when `is-a` is genuinely true.
- Override `__repr__`/`__str__` for readable objects.
- `super().__init__()` chains base constructors correctly.
- Every instance method takes `self` in Python.

## Common Pitfalls

- Deep inheritance trees cause fragile `is-a` chains.
- Exposing internals makes refactoring painful.
- Setting attributes directly instead of validation methods.
- Forgetting `self` parameter in Python methods.
- Confusing overloading with overriding in interviews.

## Interview Questions

1. Explain each pillar with a real example.
2. When is inheritance better than composition?
3. How do you achieve multiple inheritance in Python vs Java?
4. What is duck typing? How does it differ from Java interfaces?
5. Can you override a private method? (Java: no, not inherited)
6. What happens when `__mro__` resolves a method in Python?
7. Design a class hierarchy for a vehicle and shape problem.
8. Difference between abstract class and interface (Python: ABC and
   protocol).