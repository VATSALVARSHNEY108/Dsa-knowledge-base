---
layout: default
title: Design Patterns Cheatsheet
parent: Design Patterns
nav_order: 3
---

# Design Patterns Cheat Sheet

Quick reference for the Gang of Four (GoF) patterns: creational,
structural, and behavioral, with Python snippets and when to use them.

## Core Concepts

- **Design pattern**: a reusable solution to a recurring design
  problem within a given context.
- **Creational**: how objects are created (decouple creation).
- **Structural**: how objects are composed into bigger structures.
- **Behavioral**: how objects communicate and divide responsibility.
- **Anti-pattern**: a common but bad solution; patterns fix these.

## Creational Patterns

| Pattern | Intent | Good example |
|---------|--------|--------------|
| Singleton | One instance, global access | Config, logger, DB pool |
| Factory Method | Create product in subclass | Payment factory |
| Abstract Factory | Families of related objects | UI themes |
| Builder | Step-by-step complex construction | HTTP request, booking |
| Prototype | Clone existing objects | Copy-on-write docs |

## Structural Patterns

| Pattern | Intent | Good example |
|---------|--------|--------------|
| Adapter | Convert interface to what client expects | Legacy API wrapper |
| Decorator | Add behavior dynamically | Stream buffering, add-ons |
| Facade | Simplified interface to a subsystem | REST facade to services |
| Proxy | Control access / lazy load / remote | Cache proxy, auth proxy |
| Composite | Treat leaf and group uniformly | File system tree |
| Bridge | Decouple abstraction from implementation | Remote-control per device |
| Flyweight | Share state to save memory | Character glyphs |

## Behavioral Patterns

| Pattern | Intent | Good example |
|---------|--------|--------------|
| Observer | Notify dependents on change | Event systems, pub-sub |
| Strategy | Swap algorithms at runtime | Sort, pricing, compress |
| Command | Encapsulate request as object | Undo/redo, task queues |
| State | Object changes behavior by state | Vending machine, elevator |
| Template Method | Skeleton with overridable steps | Data import pipeline |
| Iterator | Sequential access without exposing layout | Collections |
| Chain of Responsibility | Pass request along a chain | Log levels, handlers |
| Mediator | Centralize interactions | Chat room, UI controls |

> Classic catalog: 5 creational, 7 structural, 11 behavioral. For
> interviews, master Singleton, Factory, Observer, Strategy well.

## Singleton

```python
class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Config()
b = Config()
assert a is b
```

- **Pros**: global access, shared state.
- **Cons**: hidden dependency, hard to test (singleton but).
- Python gotcha: `__new__` gates instance creation, not `__init__`.

## Factory Method

```python
from abc import ABC, abstractmethod

class Payment(ABC):
    @abstractmethod
    def pay(self, amount):
        pass

class CreditPayment(Payment):
    def pay(self, amount):
        return f"credit {amount}"

class UpiPayment(Payment):
    def pay(self, amount):
        return f"upi {amount}"

def payment_factory(method):
    factories = {"credit": CreditPayment, "upi": UpiPayment}
    return factories[method]()

pay = payment_factory("upi")
print(pay.pay(100))
```

- **Use when**: the concrete type is chosen at runtime.
- **Pros**: open/closed; client depends on abstraction.
- **Cons**: one more layer; overuse adds boilerplate.

## Observer

```python
class Observable:
    def __init__(self):
        self._observers = []

    def subscribe(self, observer):
        self._observers.append(observer)

    def notify(self, *args):
        for obs in self._observers:
            obs.update(*args)

class EmailNotifier:
    def update(self, event):
        print(f"email: {event}")

order = Observable()
order.subscribe(EmailNotifier())
order.notify("order placed")    # email: order placed
```

- **Use when**: many objects react to one state change (pub/sub).
- **Pros**: loose coupling, easy to add listeners.
- **Cons**: notification storms, hard to trace order of updates.

## Strategy

```python
from abc import ABC, abstractmethod

class Pricing(ABC):
    @abstractmethod
    def calculate(self, hours):
        pass

class HourlyPricing(Pricing):
    def calculate(self, hours):
        return hours * 10

class DailyCapPricing(Pricing):
    def calculate(self, hours):
        return min(hours * 10, 50)

class ParkingSession:
    def __init__(self, pricing):
        self.pricing = pricing

    def total(self, hours):
        return self.pricing.calculate(hours)

session = ParkingSession(DailyCapPricing())
print(session.total(20))        # 50
```

- **Use when**: you want to swap algorithms without `if/else`.
- **Pros**: open/closed, testable, isolated algorithms.
- **Cons**: clients must know about strategies to pick one.

## When to Use Quick Guide

| If you notice... | Reach for... |
|------------------|--------------|
| Global config/log/db instance | Singleton |
| `if type == "x"` creation logic | Factory |
| One-to-many change notifications | Observer |
| Deep `if/elif` on algorithm type | Strategy |
| Objects that behave per state | State |
| Complex object construction | Builder |
| Add behavior to existing objects | Decorator |
| Ugly integration with a legacy API | Adapter |
| Too many direct object-to-object calls | Mediator |
| Repeated undo/redo need | Command |

## Real-World Examples

- **Spring/Jakarta**: `@Component` uses singletons and factories
  to assemble the dependency graph.
- **React / Node**: EventEmitter uses a form of Observer.
- **ORM query builders**: Builder pattern (SELECT/FROM/WHERE chain).
- **Streams in Java**: buffered streams are Decorators layered on
  file streams.
- **Payment integrations**: Factory + Strategy per provider.
- **Logging levels**: Chain of Responsibility across handlers.

## Common Pitfalls

- Applying patterns for their own sake; keep it simple first.
- Singleton as a global mutable state hidden across the codebase.
- Factory that returns god classes with too many responsibilities.
- Observer with memory leaks (unsubscribed listeners).
- Deep class explosion from decorating everything.
- Confusing Factory Method (subclass) with Abstract Factory (family).

## Interview Tips

1. Name the pattern's intent and give a concrete example.
2. Explain the tradeoff, not just the benefit.
3. Recognise when a pattern is unnecessary (over-engineering).
4. Map patterns to problems: "how do I notify many clients?"
   -> Observer.
5. In LLD rounds, mention Factory + Strategy for swappable business
   rules; State for machines; Builder for complex DTOs.