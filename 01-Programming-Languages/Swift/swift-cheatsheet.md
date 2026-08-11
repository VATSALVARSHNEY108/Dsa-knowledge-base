---
layout: default
title: Swift Cheatsheet
parent: Swift
nav_order: 1
---

# Swift Cheatsheet

Quick-reference for Swift: Apple's modern, type-safe language for
iOS, macOS, watchOS, and tvOS development.

## Core Syntax

### Variables and Types

```swift
var count = 10          // mutable
let name = "Swift"      // immutable constant (preferred)
let max: Int = 100
let price: Double = 19.99
let flag: Bool = true
let ch: Character = "a"
```

> `let` is for constants, `var` for variables. Prefer `let`.

### Control Flow

```swift
let n = 10
if n > 5 {
    print("big")
} else if n > 2 {
    print("mid")
} else {
    print("small")
}

// switch must be exhaustive
switch n {
case 0:
    print("zero")
case 1...5:
    print("small")
case 6..<10:
    print("mid")
default:
    print("big")
}
```

### Loops

```swift
// for over a range
for i in 0..<5 {          // 0..4
    print(i)
}

// for over a collection
let fruits = ["apple", "banana", "cherry"]
for fruit in fruits {
    print(fruit)
}
for (index, fruit) in fruits.enumerated() {
    print("\(index): \(fruit)")
}

// while / repeat-while
var i = 0
while i < 5 { i += 1 }
```

### Functions

```swift
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}

// Argument labels
func greet(person name: String) -> String {
    "Hello, \(name)!"
}
greet(person: "Ada")

// Defaults and variadic params
func sum(_ nums: Int...) -> Int {
    nums.reduce(0, +)
}
sum(1, 2, 3)   // 6
```

### String Interpolation

```swift
let name = "Swift"
let version = 6
print("Learn \(name) \(version)")
print("Sum: \(2 + 3)")
let multi = """
Multi-line
string literal
"""
```

## Optionals

```swift
var maybe: Int? = 5       // optional Int
maybe = nil               // can hold nil

// if let binding
if let value = maybe {
    print("has value \(value)")
} else {
    print("is nil")
}

// guard let for early exit
func process(_ input: Int?) {
    guard let v = input else {
        print("nil input, returning early")
        return
    }
    print("processing \(v)")
}

// nil-coalescing
let result = maybe ?? 0

// force unwrap (risky!)
let forced = maybe!

// optional chaining
let length = maybe?.description.count
```

> `Optional<T>` is an enum: `.some(T)` or `.none`.
> Prefer `guard let` in functions; the compiler enforces nil-handling.

## String Handling

```swift
let s = "Hello, Swift"
s.count                       // 12 (Character count, not bytes)
s.isEmpty                     // false
s.uppercased()                // "HELLO, SWIFT"
s.lowercased()                // "hello, swift"
s.hasPrefix("Hello")          // true
s.hasSuffix("Swift")          // true
s.contains("Sw")              // true
s.split(separator: ",")       // [Substring]
s.replacingOccurrences(of: "Swift", with: "World")

// String indices are Character-based
let first = s.first            // Optional("H")
let nth = s[s.index(s.startIndex, offsetBy: 4)]   // "o"

// Interpolation
let name = "Ada"
let age = 36
let msg = "\(name) is \(age)"   // "Ada is 36"
```

> Swift `String` is a collection of `Character` (grapheme
> clusters), so `count` and indexing differ from other languages.

## Data Structures & Collections

| Type | Description | Common Methods |
|------|-------------|----------------|
| `Array<T>` | Ordered collection | `append`, `count`, `first`, `map`, `filter` |
| `Dictionary<K,V>` | Key/value pairs | `updateValue`, `keys`, `values`, `count` |
| `Set<T>` | Unique, unordered | `insert`, `contains`, `remove`, `union` |
| `String` | Character sequence | `count`, `lowercased`, `split`, `hasPrefix` |
| `Tuple` | Lightweight group | `(x, y)`, destructure in place |
| `Optional<T>` | `T` or `nil` | `map`, `flatMap`, `??` |

```swift
// Arrays
var nums = [1, 2, 3]
nums.append(4)
nums.count                // 4
nums[0]                   // 1
nums.contains(3)          // true
let doubled = nums.map { $0 * 2 }

// Dictionaries
var scores = ["Ada": 36, "Alan": 41]
scores["Grace"] = 49
let ada = scores["Ada"]           // Int? = 36
let missing = scores["Bob"] ?? 0  // 0
scores.keys                        // Array<String>

// Sets
var seen: Set<String> = ["a", "b"]
seen.insert("c")
seen.contains("b")        // true

// Tuples
let point = (x: 1, y: 2)
point.x                    // 1
let (a, b) = (10, 20)      // destructuring
```

## Closures

```swift
// Closures are first-class functions
let square = { (x: Int) -> Int in x * x }
square(4)   // 16

// Shorthand with $0, $1
let names = ["Zoe", "Amy", "Bea"]
let sorted = names.sorted { $0 < $1 }

// Capturing values
func makeCounter() -> () -> Int {
    var total = 0
    return {
        total += 1
        return total
    }
}
let counter = makeCounter()
counter()  // 1
```

> Closures capture surrounding values. Use `[weak self]`
> capture lists in classes to avoid retain cycles.

## OOP Notes

```swift
// Class (reference type, inheritance)
class Animal {
    let name: String
    init(name: String) { self.name = name }
    func speak() -> String { "\(name) makes a sound" }
}

class Dog: Animal {
    override func speak() -> String { "\(name) barks" }
}

// Struct (value type, no inheritance)
struct Point {
    var x: Double
    var y: Double
    func dist() -> Double { (x*x + y*y).squareRoot() }
}

// Protocol (interface)
protocol Flyable {
    var name: String { get }
    func fly() -> String
}
struct Bird: Flyable {
    let name: String
    func fly() -> String { "\(name) is flying" }
}
```

> Structs are copied on assignment, classes are shared.
> Swift prefers structs + protocols + value semantics.

### guard / if let Recap

```swift
if let v = optionalValue { use(v) }

guard let v = optionalValue else { return }
use(v)   // v available after guard
```

## Async / Await

```swift
// Mark long-running work as async
func fetchData() async throws -> String {
    let url = URL(string: "https://example.com")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return String(decoding: data, as: UTF8.self)
}

// Call from async context
Task {
    do {
        let body = try await fetchData()
        print(body)
    } catch {
        print("error: \(error)")
    }
}
```

> `async` marks a function; `await` suspends until the work
> completes. Structured concurrency keeps it safe.

## Common Built-ins / Standard Library

- `Array`, `Dictionary`, `Set`, `String` — core collections.
- `map`, `filter`, `reduce`, `flatMap`, `compactMap`, `sorted`.
- `min()` / `max()`, `zip`, `contains`, `allSatisfy`.
- `Optional` — `map`, `flatMap`, `??`, `if let`, `guard let`.
- `Int`/`Double` — `abs`, `min`, `max`, `Int.random(in:)`.
- `Result<T, Error>` — `.success` / `.failure`.
- Foundation — `Date`, `Data`, `URL`, `JSONDecoder`/`JSONEncoder`.
- `Collection`, `Sequence`, `Equatable`, `Codable` protocols.

> Codable (`struct X: Codable`) makes JSON encode/decode a
> one-liner — a staple in iOS apps.

## Memory & Performance Notes

- ARC (Automatic Reference Counting) for classes, not a GC.
- Value types (structs, arrays, dictionaries) are stack-based
  and copied on assignment — fast and thread-safe.
- Watch for strong reference cycles; use `weak`/`unowned`.
- `[weak self]` in closures to avoid retaining view controllers.
- `lazy var` defers expensive initialization.
- Copy-on-write: Arrays/Dictionaries only copy when mutated.
- Build optimized with `-O`; Release uses whole-module optimization.
- Measure with Instruments (Time Profiler, Allocations).
- `@escaping` marks closures that outlive the function.

> Understanding value vs reference semantics is the key to
> predictable Swift performance and behavior.

## Real-World Use Cases

- iOS, iPadOS, macOS, watchOS, and tvOS apps.
- SwiftUI declarative UI and Combine reactive streams.
- Server-side Swift (Vapor, Hummingbird).
- Command-line tools and scripting on Apple platforms.
- Cross-platform via Swift on Linux and embedded systems.
- Core ML and Vision for on-device machine learning.
- Gaming and graphics (Metal, SpriteKit, SceneKit).
- System utilities bundled into Apple platforms.

## Common Pitfalls

1. **Force unwrap `!`** — crashes on nil; prefer `guard let`
   or `??`.
2. **Class vs struct confusion** — classes share references,
   structs copy. Choosing wrong causes subtle bugs.
3. **Strong reference cycles** — delegate patterns and closures
   need `weak`/`[weak self]`.
4. **Mutating in a `let` struct** — mark methods `mutating`.
5. **`Int` overflow** — use `&+` or `addingReportingOverflow`.
6. **String indexing** — `String` uses Character not Int indices;
   use `string.index(...)` or arrays of characters.
7. **Forgetting `override`** — the compiler enforces it; keep
   signatures exact.
8. **Unused `return` with single-expression bodies** — implicit
   return works, but mind the type.
9. **Optionals in `switch`** — match `case let v?` or use
   `.some`/`.none`.
10. **Main thread blocking** — network calls must go off the
    main thread or the app freezes.

## Interview Tips

1. Explain optionals and all unwrap strategies: `if let`,
   `guard let`, `??`, force unwrap.
2. Know the difference between `class` (reference) and `struct`
   (value) and when to use each.
3. Be fluent with `map`, `filter`, `reduce`, `compactMap`,
   and closure shorthand.
4. Understand `guard` vs `if let` and early-exit style.
5. Describe ARC, retain cycles, and `weak`/`unowned`.
6. Know `Codable` and how to decode JSON.
7. Be comfortable with `async`/`await` and `Task`.
8. Understand protocol-oriented programming (POP).
9. Explain `@escaping`, `@autoclosure`, and `inout`.
10. Mention SwiftUI vs UIKit briefly to show iOS awareness.
