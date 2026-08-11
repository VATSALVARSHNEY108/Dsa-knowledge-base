---
layout: default
title: Kotlin Cheatsheet
parent: Kotlin
nav_order: 1
---

# Kotlin Cheatsheet

> Modern JVM language from JetBrains. Statically typed, concise, safe from
> null pointer exceptions. Runs on JVM, Android, JS, and native targets.

## Core Syntax

### Variables (val / var)
```kotlin
val name = "Alice"       // Immutable reference (read-only)
var age = 30             // Mutable variable
val x: Int = 5           // Explicit type annotation

// age = 31   // OK
// name = "B" // ERROR: val cannot be reassigned
```

### Types
```kotlin
val i: Int = 42
val d: Double = 3.14
val f: Float = 1.5f
val l: Long = 100L
val b: Boolean = true
val c: Char = 'A'
val s: String = "hello"
```

### Strings (template literals)
```kotlin
val name = "Bob"
val greeting = "Hello, $name!"        // Simple template
val math = "Sum: ${1 + 2}"            // Expression template
val raw = """Multi-line
    string with "quotes"""            // Raw string
```

### Functions
```kotlin
// Standard function
fun add(a: Int, b: Int): Int {
    return a + b
}

// Expression body
fun addShort(a: Int, b: Int) = a + b

// Default and named arguments
fun greet(name: String = "World") = "Hello $name"
greet()                 // "Hello World"
```

### Loops
```kotlin
for (i in 1..5) println(i)              // Range 1..5 inclusive
for (i in 1 until 5) println(i)         // 1..4 exclusive
for (i in 5 downTo 1 step 2) println(i) // 5, 3, 1
for (item in list) println(item)        // Iterate collection
repeat(3) { println("hi") }             // Repeat block

var n = 0
while (n < 3) { n++ }
```

### Conditionals (if is an expression)
```kotlin
val grade = if (score >= 90) "A" else "B"

when (grade) {
    "A" -> println("Excellent")
    "B" -> println("Good")
    else -> println("Keep going")
}
```

### Null Safety (? and ?:)
```kotlin
var maybe: String? = null          // Nullable type
val len = maybe?.length            // Safe call -> null if maybe is null
val l2 = maybe?.length ?: 0        // Elvis operator, default on null
val l3 = maybe!!.length            // Not-null assertion (throws NPE)
```

> Prefer safe calls (`?.`) and Elvis (`?:`) over `!!`. The compiler
> enforces null checks - a core Kotlin safety feature.

## Data Structures & Collections

| Structure | Constructors                     | Notes                              |
|-----------|----------------------------------|------------------------------------|
| List      | `listOf(1, 2, 3)` (immutable)    | Ordered, indexed access             |
| List      | `mutableListOf(...)`             | Growable, mutable                   |
| Set       | `setOf(1, 2, 2, 3)`              | Unique elements, insertion order    |
| Map       | `mapOf("a" to 1, "b" to 2)`      | Key-value pairs                     |
| Array     | `arrayOf(1, 2, 3)`               | Fixed-size primitive-like           |

```kotlin
val list = listOf(1, 2, 3, 4)
val doubled = list.map { it * 2 }        // [2, 4, 6, 8]
val evens = list.filter { it % 2 == 0 }  // [2, 4]
val sum = list.reduce { acc, n -> acc + n } // 10

val map = mapOf("a" to 1, "b" to 2)
map["a"]                       // 1
map.getOrDefault("c", 0)       // 0

val set = setOf(1, 2, 2, 3)    // {1, 2, 3}
```

### Lambdas & Higher-Order Functions
```kotlin
val square: (Int) -> Int = { it * it }   // it = implicit single param

fun operate(x: Int, y: Int, fn: (Int, Int) -> Int): Int = fn(x, y)
operate(3, 4) { a, b -> a * b }          // 12 (trailing lambda)
```

## String Handling

| Method            | Purpose                         |
|-------------------|---------------------------------|
| `s.length`        | Character count                 |
| `s.uppercase()`   | Uppercase copy                  |
| `s.lowercase()`   | Lowercase copy                  |
| `s.contains(x)`   | Substring check                 |
| `s.startsWith(x)` | Starts-with check               |
| `s.split(delim)`  | Split into List                 |
| `s.trim()`        | Trim whitespace                 |
| `s.replace(a, b)` | Replace all occurrences         |
| `s.substring(a,b)`| Extract substring by indices    |

```kotlin
"a,b,c".split(",")                    // [a, b, c]
"hello".uppercase()                   // HELLO
```

## OOP Notes

- Kotlin classes are final by default; use `open` to allow subclassing.
- Data classes auto-generate `equals`, `hashCode`, `toString`, `copy`.

```kotlin
class Animal(val name: String) {
    fun speak() = "$name makes a sound"
}

open class Vehicle(val wheels: Int)

class Car(wheels: Int) : Vehicle(wheels) {
    override fun toString() = "Car($wheels wheels)"
}

// Data class
data class User(val id: Int, val name: String)

val u1 = User(1, "Alice")
val u2 = u1.copy(name = "Bob")         // copy with modified field
```

### object, companion, singleton
```kotlin
object Config {                        // Singleton
    val version = "1.0"
}

class MathUtils {
    companion object {                 // Static-like members
        fun max(a: Int, b: Int) = if (a > b) a else b
    }
}

// Usage
Config.version
MathUtils.max(3, 5)
```

### Interfaces & Abstract Classes
```kotlin
interface Drawable {
    fun draw()                        // Abstract method
}

abstract class Shape {
    abstract fun area(): Double
}

class Circle(val r: Double) : Shape(), Drawable {
    override fun area() = Math.PI * r * r
    override fun draw() = println("drawing circle")
}
```

## Standard Functions (let, apply, run)

| Function | Receiver | Return   | Typical use                          |
|----------|----------|----------|--------------------------------------|
| `let`    | `it`     | last expr| Null checks + transform               |
| `apply`  | `this`   | receiver | Configure object, return it          |
| `run`    | `this`   | last expr| Compute + config                      |
| `with`   | `this`   | last expr| Operate on existing object           |
| `also`   | `it`     | receiver| Side effects (logging)               |
| `takeIf` | -        | receiver|null | Return value if predicate true  |

```kotlin
// let with safe call
user?.let { println(it.name) }

// apply builds and returns the object
val user = User(0, "").apply {
    id = 1        // "this" is implied
    name = "Sam"
}

// run: config + result
val len = "abc".run {
    println(length)
    length * 2    // returns 6
}
```

## Coroutines (Basics)

```kotlin
// Requires kotlinx-coroutines-core dependency
import kotlinx.coroutines.*

suspend fun fetchUser(): String {
    delay(1000)                    // Non-blocking wait
    return "user-data"
}

fun main() = runBlocking {
    launch { println("async task") }          // Fire-and-forget
    val data = async { fetchUser() }.await()  // Get a result
    println(data)
}
```

- `suspend` functions can be paused without blocking the thread.
- `runBlocking` bridges blocking and suspending code (main/tests).
- `launch` starts a coroutine; `async` returns a `Deferred` result.
- Coroutines are lightweight - thousands can run on a few threads.

## Common Built-ins / Standard Library

| API               | Purpose                            |
|-------------------|------------------------------------|
| `kotlin.math`     | `sqrt`, `abs`, `max`, `min`        |
| `kotlin.collections` | `map`, `filter`, `sorted`, `groupBy` |
| `kotlin.io`       | `readLine`, file read/write helpers|
| `kotlin.text`     | Regex, string builders             |
| `String` / `StringBuilder` | Efficient concatenation     |
| `Char`            | Char classification and conversion |
| `Pair` / `Triple` | Lightweight tuples                 |

```kotlin
val list = listOf(3, 1, 2)
list.sorted()                    // [1, 2, 3]
list.groupBy { it % 2 }          // Map<Int, List<Int>>
```

## Memory & Performance Notes

- JVM garbage-collected; no manual memory management.
- Use `IntArray`/primitive arrays over `List<Int>` for hot loops.
- Prefer immutable collections - thread-safe and shareable.
- `String` is immutable; repeated `+` is fine for small strings,
  use `StringBuilder` in loops.
- Coroutines are cheaper than threads; avoid raw thread-per-task.

## Real-World Use Cases

- Android app development (first-class language).
- Server-side backend services (Ktor, Spring Boot, Vert.x).
- Multiplatform projects (Kotlin Multiplatform sharing code).
- Data science and scientific computing (kmath, KotlinDL).
- Scripts and CLI tools compiled to JVM or native.

## Common Pitfalls

- `==` compares structural equality, `===` compares references.
- Forgetting `open` makes a class/function not overridable.
- Overusing `!!` reintroduces NPEs; prefer safe calls.
- `listOf` returns an immutable list; calling `add` fails at runtime.
- `val` holds a reference, not a value - objects stay mutable.

## Interview Tips

- Explain null safety: safe calls, Elvis operator, smart casts.
- Know `val` vs `var`, immutability, and `data class` benefits.
- Compare Kotlin vs Java: conciseness, null safety, coroutines.
- Be fluent with the standard function library (`let`, `apply`,
  `run`, `with`, `also`) and when to use each.
- Understand coroutine scopes, `Dispatchers`, and structured
  concurrency vs classic threads.
- Know the collection conversion functions (`map`, `filter`,
  `groupBy`, `associate`, `zip`).
