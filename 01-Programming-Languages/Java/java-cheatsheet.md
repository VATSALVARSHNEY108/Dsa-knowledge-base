---
layout: default
title: Java Cheatsheet
parent: Java
nav_order: 1
---

# Java Cheatsheet

Quick-reference for the Java programming language. Focuses on the `main`
method, primitives vs wrappers, core collections, strings, generics, OOP,
exceptions, and common libraries.

## Core Syntax

### main Method and Hello World
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Compile with `javac Main.java`, run with `java Main`. The class name must
match the file name.

### Primitives vs Wrappers

| Primitive | Size | Wrapper Class | Notes |
|-----------|------|---------------|-------|
| `byte` | 1 byte | `Byte` | -128 to 127 |
| `short` | 2 bytes | `Short` | -32,768 to 32,767 |
| `int` | 4 bytes | `Integer` | default for integers |
| `long` | 8 bytes | `Long` | suffix `L` |
| `float` | 4 bytes | `Float` | suffix `f` |
| `double` | 8 bytes | `Double` | default for decimals |
| `char` | 2 bytes | `Character` | UTF-16 code unit |
| `boolean` | 1 bit-ish | `Boolean` | true/false |

```java
int x = 42;
Integer xBoxed = x;              // autoboxing
int x2 = xBoxed;                 // unboxing
Integer.valueOf(42);             // explicit boxing (caches -128..127)
```

> Primitives hold values; wrappers hold objects (usable in collections).
> Autoboxing/unboxing happens automatically but has a cost.

### Variables and Control Flow
```java
int age = 30;
double price = 9.99;
boolean active = true;
String name = "Alice";           // String is a class
final int MAX = 100;             // constant

if (age >= 18) { ... } else { ... }

for (int i = 0; i < 5; i++) { ... }
for (String s : list) { ... }    // enhanced for
while (cond) { ... }

switch (day) {
  case 1: break;
  case 2: break;
  default: break;
}
```

### Methods
```java
public static int add(int a, int b) {
    return a + b;
}

// Varargs
public static void log(String... msgs) {
    for (String m : msgs) System.out.println(m);
}
```

## Data Structures and Collections

| Interface | Implementation | Property | Typical Complexity |
|-----------|---------------|----------|--------------------|
| `List` | `ArrayList` | dynamic array | O(1) get, amortized add |
| `List` | `LinkedList` | doubly linked | O(n) get, O(1) add/remove at ends |
| `Map` | `HashMap` | hash key-value | O(1) average get/put |
| `Map` | `TreeMap` | sorted key-value | O(log n) |
| `Set` | `HashSet` | hash unique | O(1) average |
| `Set` | `TreeSet` | sorted unique | O(log n) |
| `Queue` | `ArrayDeque` | double-ended | O(1) add/remove |
| `Queue` | `PriorityQueue` | heap | O(log n) poll/offer |

```java
import java.util.*;

// List
List<Integer> nums = new ArrayList<>();
nums.add(10);
nums.add(20);
nums.get(0);               // 10
nums.contains(20);         // true
Collections.sort(nums);    // ascending

// Map
Map<String, Integer> counts = new HashMap<>();
counts.put("apple", 3);
counts.get("apple");       // 3
counts.containsKey("apple");
counts.keySet();           // set of keys

// Set
Set<String> tags = new HashSet<>();
tags.add("java");
tags.contains("java");     // true

// Stack / Queue
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.peek();
stack.pop();

Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1);            // add
queue.poll();              // remove head

PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5);
pq.peek();                 // 5 (min-heap by default)
```

## String vs StringBuilder

| Feature | String | StringBuilder |
|---------|--------|---------------|
| Mutability | Immutable | Mutable |
| Concatenation cost | Creates new object | In-place, fast |
| Thread-safe | Yes (final) | No |
| Common use | Small fixed text | Building strings in loops |

```java
String s = "hello";
s += " world";                     // creates a new String each time
s.charAt(0);                       // 'h'
s.substring(1, 3);                 // "el"
s.contains("wor");
s.indexOf("llo");
s.trim();

StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);                  // efficient
}
String result = sb.toString();
```

> In hot loops use `StringBuilder`. `String` is immutable, which makes it
> safe for hash keys and concurrency.

## Generics

```java
List<String> names = new ArrayList<>();

// Generic class
class Box<T> {
    private T value;
    public void set(T v) { this.value = v; }
    public T get() { return this.value; }
}

// Bounded type parameter
public static <T extends Comparable<T>> T maxOf(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

## OOP

### Classes and Inheritance
```java
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void speak() {
        System.out.println(name + " makes a sound");
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);            // call parent constructor
    }

    @Override
    public void speak() {
        System.out.println(name + " barks");
    }
}
```

### Interfaces and Abstract Classes
```java
public interface Shape {
    double area();                    // implicitly public abstract
}

public abstract class Vehicle {
    abstract void start();            // must be implemented
    void stop() { System.out.println("stopped"); }
}
```

> A class can extend one class but implement many interfaces. Interfaces are
> the primary tool for abstraction and polymorphism.

### Modifiers Summary

| Modifier | Class | Method | Field | Meaning |
|----------|-------|--------|-------|---------|
| `public` | yes | yes | yes | accessible everywhere |
| `protected` | - | yes | yes | package + subclasses |
| (default) | yes | yes | yes | same package only |
| `private` | - | yes | yes | same class only |
| `static` | - | yes | yes | belongs to the class |
| `final` | yes | yes | yes | cannot extend/override/reassign |

## Exception Handling

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.err.println("Math error: " + e.getMessage());
} finally {
    System.out.println("Always runs");
}

// Try-with-resources (auto-close)
try (var reader = new BufferedReader(new FileReader("f.txt"))) {
    System.out.println(reader.readLine());
} catch (IOException e) {
    e.printStackTrace();
}
```

> Checked exceptions must be declared (`throws`) or caught; unchecked
> exceptions (subclasses of `RuntimeException`) are not required to be caught.

## Common Libraries

| Library | Purpose | Examples |
|---------|---------|----------|
| `java.lang` | core, auto-imported | String, Integer, Math, System |
| `java.util` | collections, date | ArrayList, HashMap, Scanner |
| `java.util.stream` | functional streams | map, filter, reduce |
| `java.nio.file` | modern file API | Files, Paths |
| `java.time` | date/time (modern) | LocalDate, Instant |

```java
import java.util.stream.*;

List<Integer> nums = List.of(1, 2, 3, 4);
int sum = nums.stream()
              .filter(n -> n % 2 == 0)
              .mapToInt(Integer::intValue)
              .sum();                       // 6
```

## Memory and Performance Notes

- JVM garbage collector manages memory; no manual free.
- Objects live on the heap; primitives can live on the stack.
- `String` interning: `"a" == "a"` is true, but use `.equals()` always.
- `ArrayList` grows by ~50%; presize with capacity if known.
- Streams add overhead; for hot loops use plain loops.

## Real-World Use Cases

- Enterprise web backends (Spring Boot).
- Android mobile apps.
- Big data processing (Apache Hadoop, Spark).
- Desktop tools and IDEs (IntelliJ, Eclipse).

## Common Pitfalls

- Comparing strings with `==` instead of `.equals()`.
- Forgetting `break;` in `switch` (fall-through).
- `ArrayIndexOutOfBoundsException` from off-by-one loops.
- Concurrent modification of a collection while iterating.
- Ignoring checked exceptions instead of handling them.
- Using `float`/`double` for money (use `BigDecimal`).

## Interview Tips

- Explain `==` vs `.equals()` and `hashCode()` contract.
- Contrast `ArrayList` and `LinkedList`, `HashMap` vs `TreeMap`.
- Understand `String` immutability and why `StringBuilder` is faster.
- Explain checked vs unchecked exceptions.
- Know generics, wildcards (`? extends` / `? super`) and type erasure.
