---
layout: default
title: Dart Cheatsheet
parent: Dart
nav_order: 1
---

# Dart Cheatsheet

Quick-reference for the Dart programming language (Flutter's language). Focuses
on variables, collections, null safety, async/await, and OOP.

## Core Syntax

### Variables: var, final, const
```dart
var name = 'Alice';          // type inferred: String
int age = 30;
double pi = 3.14;
bool active = true;

final city = 'New York';     // runtime constant, assigned once
const maxItems = 100;        // compile-time constant

String? maybeNull;           // nullable type
late int lazy;               // initialized later before use
```

> Dart is null-safe: types are non-nullable by default. Use `?` for nullable
> values, `!` to assert non-null, and `??` for a fallback.

### Control Flow
```dart
if (age >= 18) { ... } else { ... }

switch (grade) {
  case 'A': break;
  case 'B': break;
  default: break;
}

for (int i = 0; i < 5; i++) { ... }
for (var item in items) { ... }
while (cond) { ... }
do { ... } while (cond);
```

### Functions
```dart
int add(int a, int b) => a + b;      // arrow function

void greet(String name, {String? title}) {
  print('Hello $title $name');       // string interpolation
}

// Named and optional parameters
void log(String msg, {int level = 1, bool verbose = false}) { }
log('hi', level: 2);

// Anonymous / arrow functions
items.forEach((item) => print(item));
var nums = [1, 2, 3].map((n) => n * 2).toList();
```

## Data Structures and Collections

| Type | Description | Key Methods |
|------|-------------|-------------|
| `List<T>` | ordered, indexable | add, addAll, removeAt, length |
| `Map<K,V>` | key-value pairs | `[]`, putIfAbsent, containsKey |
| `Set<T>` | unique elements | add, remove, contains |
| `Iterable<T>` | lazy sequence | map, where, reduce, fold |

```dart
var list = <int>[1, 2, 3];
list.add(4);
list.removeAt(0);
print(list.length);            // 3
list.forEach(print);

var map = <String, int>{'one': 1, 'two': 2};
map['three'] = 3;              // add or update
map.containsKey('one');        // true
map.forEach((k, v) => print('$k -> $v'));

var set = <int>{1, 2, 2, 3};  // {1, 2, 3}, duplicates dropped
set.contains(2);               // true

// Functional style
var evens = [1, 2, 3, 4].where((n) => n.isEven).toList();  // [2, 4]
var doubled = [1, 2, 3].map((n) => n * 2).toList();        // [2, 4, 6]
var sum = [1, 2, 3].reduce((a, b) => a + b);                // 6
```

## Null Safety

```dart
String? name = maybeGetName();
name = name ?? 'Guest';        // fallback if null
int len = name!.length;        // bang operator, asserts non-null

// Null-aware operators
var result = obj?.method();    // null if obj is null
var value = nullable ?? 0;

// Pattern matching (Dart 3)
switch (nullable) {
  case final String s: print('Has value $s');
  case null: print('Null');
}
```

## Async / Await / Future

```dart
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 1));
  return 'data';
}

Future<int> fetchAge() async => 30;

void main() async {
  print(await fetchData());     // wait for the Future
}

// Parallel execution
var results = await Future.wait([fetchData(), fetchAge()]);

// Manual Future (rarely needed)
Future<String> future = Future.value('immediate');
```

> `Future` is a single value that arrives later. For streams of values use
> `Stream`. Never `await` a Future synchronously inside a non-async function.

## OOP

### Classes
```dart
class Person {
  String name;
  int age;

  Person(this.name, {this.age = 0});   // constructor with initializing params

  String describe() => '$name is $age years old';
}

var p = Person('Bob', age: 25);
print(p.describe());
```

### Inheritance and Interfaces
```dart
class Animal {
  void speak() => print('...');
}

class Dog extends Animal {
  @override
  void speak() => print('Woof');
}

// Implicit interfaces: any class is an interface
class Swimmer {
  void swim() => print('swimming');
}

class Duck extends Animal implements Swimmer {
  @override
  void swim() => print('Duck swims');
}
```

### Abstract Classes and Mixins
```dart
abstract class Shape {
  double area();
}

class Circle extends Shape {
  double radius;
  Circle(this.radius);
  @override
  double area() => 3.14159 * radius * radius;
}

mixin CanFly {
  void fly() => print('flying');
}

class Bird with CanFly { }
var b = Bird()..fly();           // cascade operator
```

### Getters, Setters, Operators
```dart
class Temperature {
  double celsius;
  Temperature(this.celsius);

  double get fahrenheit => celsius * 9 / 5 + 32;
  set fahrenheit(double f) => celsius = (f - 32) * 5 / 9;

  @override
  String toString() => '${celsius}C';
}
```

## Common Built-ins

| Library | Purpose | Examples |
|---------|---------|----------|
| `dart:core` | basics, auto-imported | String, List, int, print |
| `dart:collection` | advanced collections | HashMap, Queue, LinkedList |
| `dart:math` | math functions | sqrt, max, min, Random |
| `dart:async` | async programming | Future, Stream, Completer |
| `dart:convert` | encoding | jsonEncode, jsonDecode |
| `dart:io` | file/network I/O | File, HttpClient |

```dart
import 'dart:math';
import 'dart:convert';

void main() {
  print(sqrt(16));                          // 4.0
  var json = jsonEncode({'a': 1});          // '{"a":1}'
  var decoded = jsonDecode(json) as Map;    // {'a': 1}
}
```

## Memory and Performance Notes

- Dart uses a generational garbage collector; no manual free needed.
- Strings are immutable; building with many concatenations creates garbage.
  Prefer `StringBuffer` in loops.
- Use `const` constructors to enable compile-time canonicalization.
- Lazy collections (`Iterable`) defer work until consumed.
- `List` is a dynamic array; pre-sizing helps in hot loops.

## Real-World Use Cases

- Cross-platform mobile apps with Flutter.
- Desktop and web apps via Flutter.
- Server-side backends (dart_frog, shelf).
- Command-line tools and scripts.
- Google-developed internal tooling.

## Common Pitfalls

- Using a variable before assigning a nullable value (compile error).
- Forgetting `await` on a `Future`, getting a `Future<...>` instead.
- Using `[]` on a `Map` that may not contain the key; use `containsKey`.
- In `List`, `remove` removes by value, `removeAt` by index.
- Modifying a collection while iterating it (copy first).
- Forgetting `@override` on interface/mixin method implementations.
- Confusing `final` (assign once) with `const` (compile-time).
- Calling `!` on a null value throws a runtime error.

## Interview Tips

- Explain null safety and the difference between `?`, `!`, and `??`.
- Contrast `final`, `const`, and `var`.
- Know how `Future` and `await` work and the event loop.
- Compare `List`, `Set`, and `Map` and their common operations.
- Explain mixins versus interfaces in Dart.
- Use `StringBuffer` for string-heavy loops.
- Practice stream handling and async error handling (`try`/`catch`).
