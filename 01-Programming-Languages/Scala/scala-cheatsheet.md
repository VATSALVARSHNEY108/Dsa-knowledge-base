---
layout: default
title: Scala Cheatsheet
parent: Scala
nav_order: 1
---

# Scala Cheatsheet

Quick-reference for Scala: a language that fuses object-oriented
and functional programming on the JVM, famous for Spark and Big Data.

## Core Syntax

### Variables and Types

```scala
val x = 5              // immutable value (preferred)
var y = 10             // mutable variable (avoid when possible)
val name: String = "Ada"
val price: Double = 19.99
val flag: Boolean = true
val ch: Char = 'a'
val nothing: Unit = () // Unit ~ void
```

> `val` is immutable and thread-safe to reason about.
> Prefer `val` over `var` in functional style.

### Control Flow

```scala
val n = 10
if (n > 5) println("big") else println("small")

// if is an expression
val label = if (n > 5) "big" else "small"

// Pattern matching is the idiomatic switch
n match {
  case 0 => println("zero")
  case 1 | 2 => println("one or two")
  case x if x > 5 => println(s"$x is large")
  case _ => println("other")
}
```

### Loops

```scala
// for over ranges and collections
for (i <- 1 to 5) println(i)      // inclusive
for (i <- 1 until 5) println(i)   // exclusive
for (i <- 1 to 3; j <- 1 to 2) println(i + j)  // nested

// for-comprehensions return collections
val doubled = for (i <- 1 to 5) yield i * 2
// doubled: Vector(2, 4, 6, 8, 10)

// while loop
var i = 0
while (i < 5) {
  println(i)
  i += 1
}
```

> Prefer for-comprehensions and `map` over while loops in
> functional Scala.

### Functions

```scala
def add(a: Int, b: Int): Int = a + b

def greet(name: String, greeting: String = "Hello"): String =
  s"$greeting, $name!"

def sum(nums: Int*): Int = nums.sum   // varargs

// Anonymous functions (lambdas)
val square = (x: Int) => x * x
val triple: Int => Int = _ * 3        // placeholder syntax

// Higher-order function
def applyTwice(f: Int => Int, v: Int): Int = f(f(v))
applyTwice(square, 3)   // 81
```

### String Interpolation

```scala
val name = "Scala"
println(s"Learn $name")          // s interpolator
println(s"2 + 3 = ${2 + 3}")     // expressions
println(f"$name%10s")            // f interpolator (formatting)
val rawStr = raw"\n"             // raw, no escapes
```

> The `s` interpolator requires a leading `$`. Use `${}` for
> expressions and method calls.

## Data Structures & Collections

Scala's default collections are **immutable**; `mutable.*`
is opt-in.

| Type | Immutable | Mutable | Typical Use |
|------|-----------|---------|-------------|
| `List` | `List(1,2)` | `mutable.ListBuffer` | Linked list, fast prepend |
| `Vector` | `Vector(1,2)` | `ArrayBuffer` | Indexed access |
| `Map` | `Map("a" -> 1)` | `mutable.Map` | Key/value lookup |
| `Set` | `Set(1,2)` | `mutable.Set` | Unique values |
| `Seq` | `Seq(1,2)` | `ArraySeq` | Ordered sequence |
| `Array` | — | `Array(1,2)` | JVM array, mutable |
| `Option` | `Some(x)` / `None` | — | Nullable value |

```scala
// Lists: prepend is O(1), append is O(n)
val nums = List(1, 2, 3)
val head = nums.head          // 1
val tail = nums.tail          // List(2, 3)
val extended = 0 :: nums      // List(0, 1, 2, 3)

// Maps
val ages = Map("Ada" -> 36, "Alan" -> 41)
ages("Ada")                     // 36
ages.get("Grace")               // None (Option)
ages.getOrElse("Grace", 0)      // 0
val withNew = ages + ("Grace" -> 49)   // new map

// Sets
val evens = Set(2, 4, 6)
evens.contains(4)               // true
val union = Set(1,2) | Set(2,3) // Set(1,2,3)

// ArrayBuffer for mutable growing
import scala.collection.mutable.ArrayBuffer
val buf = ArrayBuffer(1, 2)
buf += 3
```

> Immutable updates return new collections while sharing
> structure — cheap and safe.

## String Handling

```scala
val s = "Hello, Scala"
s.length                          // 12
s.toUpperCase                     // "HELLO, SCALA"
s.toLowerCase                     // "hello, scala"
s.charAt(1)                       // 'e'
s.substring(0, 5)                 // "Hello"
s.split(", ")                     // Array("Hello", "Scala")
s.replace("Scala", "World")       // "Hello, World"
s.contains("Scala")               // true
s.startsWith("Hello")             // true
s.trim                            // trim whitespace

// Interpolation is the idiomatic builder
val name = "Ada"
val greeting = s"Hello, $name"    // "Hello, Ada"
val formatted = f"$name%10s"      // padded via f-interpolator

// Strings are immutable; builders for heavy concatenation
val sb = new StringBuilder
sb ++= "a" ; sb ++= "b" ; sb.toString()   // "ab"

// Conversions
"42".toInt                          // 42
42.toString                         // "42"
```

> Scala strings are Java strings underneath, but the standard
> library and interpolators make them much nicer to work with.

## Pattern Matching & Case Classes

```scala
// Case classes: immutable value objects with auto equals/hashCode
case class Point(x: Int, y: Int)

// Sealed trait limits subtypes to this file
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rect(width: Double, height: Double) extends Shape

def area(s: Shape): Double = s match {
  case Circle(r) => math.Pi * r * r
  case Rect(w, h) => w * h
}

area(Circle(2))   // 12.566370614359172

// Case class copy and destructuring
val p = Point(1, 2)
val p2 = p.copy(y = 10)
val Point(a, b) = p2   // a = 1, b = 10

// Option pattern matching
def describe(maybe: Option[Int]): String = maybe match {
  case Some(v) => s"value $v"
  case None => "no value"
}
```

> Pattern matching + case classes = the idiomatic way to
> destructure data and dispatch logic.

## Higher-Order Functions

```scala
val nums = List(1, 2, 3, 4, 5)
nums.map(_ * 2)                          // List(2,4,6,8,10)
nums.filter(_ % 2 == 0)                  // List(2,4)
nums.foldLeft(0)(_ + _)                  // 15
nums.foldRight(0)((x, acc) => x + acc)   // 15
nums.reduce(_ + _)                       // 15
nums.flatMap(x => List(x, x * 10))       // List(1,10,2,20,...)
nums.groupBy(_ % 2)                      // Map(0 -> List(2,4), 1 -> List(1,3,5))
nums.take(3) / nums.drop(2)
nums.mkString(", ")                      // "1, 2, 3, 4, 5"
nums.sorted / nums.reverse
nums.count(_ > 3)                        // 2
nums.exists(_ > 4) / nums.forall(_ > 0)
```

## OOP Notes

Scala is object-oriented: every value is an object, every
operation a method call.

```scala
class Counter(start: Int) {
  private var count = start
  def increment(): Unit = count += 1
  def current: Int = count     // val-style accessor, no parens
}

val c = new Counter(10)
c.increment()
c.current   // 11

// Inheritance
class Animal(val name: String)
class Dog(name: String) extends Animal(name)

// Traits provide mixin composition
trait Flying {
  def fly(): String = "flying"
}
class Bird(name: String) extends Animal(name) with Flying

// Companion object holds static-like members
class MathUtils
object MathUtils {
  def square(x: Int): Int = x * x
}
MathUtils.square(4)   // 16
```

> Scala mixes OOP and FP: classes, traits, and companion
> objects work alongside immutable values and pure functions.

## Common Built-ins / Standard Library

- `Predef` — `println`, `require`, `assert`, `implicitly`.
- `scala.collection.immutable` — `List`, `Vector`, `Map`, `Set`, `Seq`.
- `scala.collection.mutable` — `ArrayBuffer`, `ListBuffer`, `mutable.Map`.
- `Option` / `Some` / `None` — null-safe optional values.
- `Either[L, R]` — result that can carry an error type.
- `Try[T]` — `Success`/`Failure` for exception wrapping.
- `Future[T]` — asynchronous computation (scala.concurrent).
- `math` — `math.sqrt`, `math.max`, `math.Pi`, `math.abs`.
- `Range` — `1 to 10`, `10 to 1 by -1`.
- `String` ops — `interpolator`, `split`, `trim`, `toInt`, `mkString`.
- `Tuple` — `("a", 1)`, destructure as `(x, y)`.

### sbt Basics

```bash
sbt new scala/hello-world.g8   # scaffold a project
sbt compile                    # compile
sbt run                        # run main
sbt test                       # run tests
sbt console                    # REPL
```

```scala
// build.sbt
ThisBuild / scalaVersion := "3.3.1"
ThisBuild / version := "0.1.0"

lazy val root = (project in file("."))
  .settings(
    name := "my-app",
    libraryDependencies +=
      "org.scalameta" %% "munit" % "1.0.0" % Test
  )
```

> Scala 3 syntax (`:=`, indentation-based) is now standard.
> sbt uses `%%` for Scala-version-aware dependencies.

## Memory & Performance Notes

- Runs on the JVM: JIT compilation, garbage collection.
- Immutable collections share structure; updates are cheap.
- `List` prepend O(1) but random access O(n); `Vector` is O(log n).
- Avoid `+` on `List` (append) in hot loops — build with `::`
  then `reverse`.
- Watch out for `String` concatenation in loops; use `StringBuilder`.
- `lazy val` defers evaluation until first access.
- Recursion can blow the stack; use tail-recursive forms
  (`@tailrec`) or `foldLeft`.
- Use `-Xlint` and `-Wunused` compiler flags to catch issues.
- Parallelize with `.par` (parallel collections) when safe.

> The JVM gives Scala solid performance, but Big Data usage
> (Spark) is where it truly shines at scale.

## Real-World Use Cases

- Big Data processing with Apache Spark (written in Scala).
- Data pipelines, streaming (Akka Streams, Apache Flink).
- Backend microservices (Akka HTTP, Play, http4s, Finagle).
- Functional programming in production (ZIO, Cats Effect).
- High-concurrency systems via the Actor model (Akka).
- Domain modeling with case classes and sealed traits.
- Trading systems and other latency-sensitive JVM services.
- Android via Scala Native / Scaloid; browser via Scala.js.

## Common Pitfalls

1. **`==` is value equality** in Scala — safe for collections
   and case classes; `eq` is reference identity.
2. **`+` on List appends** — O(n); use `::` prepend instead.
3. **Varargs are `Seq`** — `def f(xs: Int*)`; pass an array
   with `xs: _*`.
4. **Integer division** — `5 / 2 == 2`; use `5.0 / 2`.
5. **Return keyword** — `return` breaks functional style and
   type inference; rely on the last expression.
6. **Mutable vs immutable confusion** — default to immutable;
   import `scala.collection.mutable` explicitly.
7. **`null` usage** — avoid; use `Option`. Interop with Java
   libraries may still return `null`.
8. **Forgetting `Unit`** — methods without `=` return `Unit`,
   silently discarding the result.
9. **O(n) `last`/`init` on List** — be mindful on large lists.
10. **Pattern matching non-exhaustive** — the compiler warns;
    add a catch-all `case _` or use sealed hierarchies.

## Interview Tips

1. Master the collections API: `map`, `filter`, `foldLeft`,
   `flatMap`, `groupBy`, `partition`.
2. Explain why immutable collections are preferred and how
   structural sharing works.
3. Practice pattern matching with `Option`, sealed traits,
   and tuples.
4. Know the difference between `val`, `var`, `lazy val`,
   and `def`.
5. Be ready to talk about `foldLeft` vs `foldRight` and
   their order.
6. Understand case classes: `equals`, `hashCode`, `copy`,
   and pattern matching.
7. Mention tail-recursion (`@tailrec`) for deep recursion.
8. Know Spark's connection: RDDs, DataFrames, and lazy
   transformations.
9. Be fluent with `sbt` build basics and dependency syntax.
10. Practice writing pure functions with no side effects —
    the hallmark of idiomatic Scala.
