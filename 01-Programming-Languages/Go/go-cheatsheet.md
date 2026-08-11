---
layout: default
title: GO Cheatsheet
parent: Go
nav_order: 1
---

# Go Cheatsheet

Quick-reference for the Go programming language. Focuses on packages, slices,
maps, structs, goroutines, channels, interfaces, and error handling.

## Core Syntax

### Package and main
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```

Every Go file belongs to a package. `main` is the program entry point. Run
with `go run main.go`; build with `go build`.

### Variables: var and :=
```go
var name string = "Alice"   // explicit type
var age = 30                // inferred
city := "New York"          // short declaration (inside functions only)
const pi = 3.14             // constant

var a, b int = 1, 2         // multiple
var x, y = 1, "two"         // mixed types
var zero int                // zero value: 0, "", false, nil
```

> `:=` cannot be used outside a function. It declares and assigns in one step.

### Types
| Type | Description |
|------|-------------|
| `int`, `int8`...`int64` | signed integers |
| `uint`, `uint8`...`uint64` | unsigned integers |
| `float32`, `float64` | floating point |
| `bool` | true/false |
| `string` | immutable UTF-8 text |
| `byte` = `uint8` | single byte |
| `rune` = `int32` | Unicode code point |

### Control Flow
```go
if x > 0 {
	fmt.Println("positive")
} else if x < 0 {
	fmt.Println("negative")
} else {
	fmt.Println("zero")
}

// for is the only loop keyword
for i := 0; i < 5; i++ { }
for _, v := range nums { }   // slice/map iteration
for { }                      // infinite loop

switch x {
case 1:
	fmt.Println("one")
default:
	fmt.Println("other")
}
```

### Functions
```go
func add(a, b int) int {
	return a + b
}

// Multiple return values (common for errors)
func divide(a, b int) (int, error) {
	if b == 0 {
		return 0, fmt.Errorf("division by zero")
	}
	return a / b, nil
}

// Function as a value
func main() {
	f := add
	fmt.Println(f(2, 3))
}
```

## Slices vs Arrays

| Feature | Array | Slice |
|---------|-------|-------|
| Size | Fixed at compile time | Dynamic |
| Declaration | `[3]int` | `[]int` |
| Passed by | Value (copy) | Reference to backing array |
| Common usage | Rare | Everywhere |

```go
arr := [3]int{1, 2, 3}      // array, fixed length
slice := []int{1, 2, 3}     // slice, dynamic

slice = append(slice, 4)    // grows as needed
slice = append(slice, 5, 6)

sub := slice[1:3]           // slicing: [2, 3]

// make with capacity
s := make([]int, 0, 10)     // length 0, capacity 10
```

> Slices share the same backing array. Modifying a sub-slice modifies the
> parent. `append` may reallocate; always reassign the result.

## Maps

```go
m := map[string]int{"apple": 1, "pear": 2}
m["banana"] = 3             // insert/update
delete(m, "apple")          // delete key

v, ok := m["pear"]          // ok == true if key exists

for k, v := range m {
	fmt.Println(k, v)       // iteration order is random
}
```

## Structs

```go
type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{Name: "Bob", Age: 25}
	p2 := Person{"Alice", 30}   // positional (order matters)
	p.Age = 26                  // modify field
	fmt.Println(p.Name)

	pp := &p                    // pointer to struct
	pp.Age = 27                 // auto-dereference
}
```

### Methods and Struct Tags
```go
func (p Person) Describe() string {
	return fmt.Sprintf("%s is %d", p.Name, p.Age)
}

type User struct {
	ID   int    `json:"id"`     // struct tags for encoding
	Role string `json:"role"`
}
```

## Goroutines and Channels

```go
go func() {            // goroutine: concurrent execution
	fmt.Println("running")
}()

// Buffered vs unbuffered channels
ch := make(chan int)           // unbuffered (synchronous)
buffered := make(chan int, 5)  // buffered (async up to 5)

ch <- 42          // send
v := <-ch         // receive

// Closing and ranging
close(ch)
for value := range ch { ... }
```

> Use `sync.WaitGroup` to wait for goroutines. Use `select` to wait on
> multiple channels. Avoid sharing memory; communicate via channels.

```go
import "sync"

var wg sync.WaitGroup
wg.Add(1)
go func() {
	defer wg.Done()
	fmt.Println("done")
}()
wg.Wait()
```

## Interfaces

```go
type Shape interface {
	Area() float64
}

type Circle struct{ R float64 }
func (c Circle) Area() float64 { return 3.14 * c.R * c.R }

type Rect struct{ W, H float64 }
func (r Rect) Area() float64 { return r.W * r.H }

func printArea(s Shape) {
	fmt.Println(s.Area())
}
```

> Go interfaces are satisfied implicitly; no `implements` keyword. An empty
> interface `interface{}` (or `any`) accepts any type.

## Error Handling

```go
f, err := os.Open("file.txt")
if err != nil {
	fmt.Println("Error:", err)
	return
}
defer f.Close()    // runs when the function returns

// Custom errors
errors.New("something went wrong")
fmt.Errorf("value %d invalid", n)
```

> Go has no exceptions. Errors are values. Always check `err != nil`.

## defer, panic, recover

```go
func main() {
	defer fmt.Println("cleanup")   // runs last, LIFO order
	fmt.Println("work")
}
```

`panic` aborts the program; `recover` inside a deferred function catches it.
Use sparingly; prefer error returns.

## Standard Library Highlights

| Package | Purpose | Examples |
|---------|---------|----------|
| `fmt` | formatting | Println, Sprintf, Fprintf |
| `strings` | string helpers | Contains, Split, Join, ToUpper |
| `strconv` | conversions | Atoi, Itoa, ParseFloat |
| `sort` | sorting | sort.Ints, sort.Slice |
| `os` | OS operations | Open, ReadFile, Env |
| `encoding/json` | JSON | Marshal, Unmarshal |

```go
import (
	"sort"
	"strings"
)

s := []int{3, 1, 2}
sort.Ints(s)                    // [1, 2, 3]
strings.Contains("golang", "go")  // true
str := strings.Join([]string{"a", "b"}, "-")  // "a-b"
```

## Memory and Performance Notes

- Go is garbage-collected; no manual free.
- Slices share backing arrays; watch for unintended aliasing.
- `go test` runs benchmarks with `go test -bench=.`.
- Prefer value receivers for small structs, pointer receivers to mutate.
- Use `sync.Mutex`/`sync.RWMutex` to protect shared state.

## Real-World Use Cases

- Cloud services and microservices (Docker, Kubernetes).
- Network servers and proxies.
- CLI tools (hugo, gh).
- High-concurrency backend APIs.

## Common Pitfalls

- `:=` used outside a function (undefined for package scope).
- Modifying a slice from `range` without `index` assignment.
- Goroutine leaks from unbuffered sends with no receiver.
- Copying a `sync.Mutex` (contains a copy of the lock).
- Iterating a map while modifying it (undefined behavior).
- Shadowing variables with `:=` in nested scopes.
- Comparing slices/maps with `==` (compile error; use `slices.Equal`).

## Interview Tips

- Explain the difference between arrays and slices and `append` semantics.
- Describe goroutine vs thread: goroutines are cheap, multiplexed, grow.
- Know channel send/receive blocking behavior and `select`.
- Explain how interfaces are implicitly satisfied.
- Be ready to implement a worker pool with channels.
- Understand `defer` LIFO execution order.
