---
layout: default
title: C++ Cheatsheet
parent: C++
nav_order: 1
---

# C++ Cheatsheet

Quick-reference for modern C++ (C++11/14/17). Focuses on the STL, iostream,
references, classes, smart pointers, `auto`, and lambdas.

## Core Syntax

### Variables and Types
```cpp
#include <iostream>
int main() {
  int n = 42;
  double d = 3.14;
  bool ok = true;
  char c = 'A';
  std::string s = "hello";     // std::string, not char*
  auto x = n + d;              // deduced as double
  const int LIMIT = 100;       // compile-time constant
  return 0;
}
```

### iostream Input/Output
```cpp
int age;
std::cout << "Enter age: ";
std::cin >> age;               // extraction
std::cout << "Age is " << age << "\n";  // insertion

std::string line;
std::getline(std::cin, line);  // whole line, keeps spaces
std::cerr << "error" << std::endl;
```

### Loops
```cpp
for (int i = 0; i < 5; i++) { }
for (auto v : vec) { }        // range-based for
while (cond) { }
do { } while (cond);
```

## References vs Pointers

| Feature | Reference (`&`) | Pointer (`*`) |
|---------|----------------|---------------|
| Can be null | No | Yes |
| Can be reseated | No | Yes |
| Auto-dereference | Yes | No (use `*`) |
| Syntax | `int &r = x;` | `int *p = &x;` |

```cpp
void byValue(int a)  { a = 0; }        // copy
void byRef(int &a)   { a = 0; }        // alias, modifies caller
void byPtr(int *a)   { *a = 0; }       // pointer version

const int &cr = n;                     // read-only reference
```

> Prefer references over pointers by default. Use pointers when "no value" is
> a real possibility or when reseating is required.

## STL Containers

| Container | Header | Property | Key Ops |
|-----------|--------|----------|---------|
| `vector<T>` | `<vector>` | dynamic array | push_back, [], at |
| `map<K,V>` | `<map>` | ordered key-value | `[]`, find, insert |
| `unordered_map<K,V>` | `<unordered_map>` | hash key-value | O(1) average |
| `set<T>` | `<set>` | ordered unique | insert, find, count |
| `unordered_set<T>` | `<unordered_set>` | hash unique | O(1) average |
| `stack<T>` | `<stack>` | LIFO | push, pop, top |
| `queue<T>` | `<queue>` | FIFO | push, pop, front |
| `priority_queue<T>` | `<queue>` | max-heap | push, pop, top |
| `deque<T>` | `<deque>` | double-ended | push_front/back |

```cpp
#include <vector>
#include <map>
#include <unordered_map>
#include <set>
#include <stack>
#include <queue>

std::vector<int> v = {1, 2, 3};
v.push_back(4);               // {1,2,3,4}
v.pop_back();
v[0];                         // unchecked; v.at(0) checks bounds

std::map<std::string, int> m;
m["apple"] = 3;               // inserts or overwrites
m.count("apple");             // 1
m.find("pear") != m.end();    // membership test

std::unordered_map<int, int> u;
u[10] = 100;

std::set<int> s = {3, 1, 2};
s.insert(1);                  // no duplicate
s.count(2);                   // 1

std::stack<int> st;
st.push(1); st.top(); st.pop();

std::queue<int> q;
q.push(1); q.front(); q.pop();

std::priority_queue<int> pq;  // max at top
pq.push(5); pq.push(1); pq.top();   // 5
```

### Iterators and Algorithms
```cpp
#include <algorithm>

std::sort(v.begin(), v.end());
auto it = std::find(v.begin(), v.end(), 3);
int total = std::accumulate(v.begin(), v.end(), 0);
int mx = *std::max_element(v.begin(), v.end());
std::reverse(v.begin(), v.end());
```

## Strings

```cpp
#include <string>

std::string s = "hello";
s += " world";                // append
s.size();                     // length
s[0];                         // 'h'
s.substr(1, 3);               // "ell"
s.find("ell");                // index or std::string::npos
std::to_string(42);           // "42"
std::stoi("42");              // 42
```

## Functions and Lambdas

```cpp
int add(int a, int b) { return a + b; }

auto mul = [](int a, int b) { return a * b; };   // lambda
auto sumAll = [](int total, int n) { return total + n; };

std::sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); // descending
```

## OOP: Classes

```cpp
class Animal {
 public:
  Animal(std::string n) : name_(n) {}      // constructor + init list
  virtual void speak() const {             // virtual for override
    std::cout << name_ << " makes a sound\n";
  }
  virtual ~Animal() = default;             // virtual destructor
 protected:
  std::string name_;
};

class Dog : public Animal {
 public:
  using Animal::Animal;                    // inherit constructors
  void speak() const override {            // override
    std::cout << name_ << " barks\n";
  }
};
```

### Smart Pointers
```cpp
#include <memory>

auto p = std::make_unique<int>(5);        // unique_ptr, not copyable
auto sp = std::make_shared<int>(10);      // shared_ptr, ref-counted
std::weak_ptr<int> wp = sp;               // weak observer, no ownership
```

> `std::unique_ptr` for exclusive ownership, `std::shared_ptr` for shared
> ownership. Avoid raw `new`/`delete` in modern code.

## Memory and Performance Notes

- Pass heavy objects by `const &` to avoid copies.
- Reserve capacity before many push_backs: `v.reserve(1000);`.
- Prefer `std::array` for fixed-size data (stack allocated).
- Move semantics: returning by value is cheap with RVO/moves.
- Strings: `std::string` vs `string_view` (non-owning view).

## Standard Library Highlights

| Library | Purpose |
|---------|---------|
| `<iostream>` | cin/cout/cerr |
| `<vector>`, `<map>`, etc. | containers |
| `<algorithm>` | sort, find, reverse, accumulate |
| `<string>` | std::string |
| `<memory>` | smart pointers |
| `<thread>` | multithreading |
| `<chrono>` | time and clocks |
| `<functional>` | std::function, bind |
| `<cmath>` | sqrt, pow, fabs |

## Real-World Use Cases

- Game engines and high-performance graphics.
- Trading systems and financial software.
- Web browsers (rendering, V8-like engines use C++).
- Operating systems, drivers, embedded systems.
- Database engines (e.g., ClickHouse, RocksDB).

## Common Pitfalls

- `vector` reallocation invalidates references/pointers to elements.
- `[]` on map inserts a default element; use `find`/`count` to test.
- Mixing `std::cin` with `std::getline` (leftover newline).
- Forgetting to override destructors in base classes as virtual.
- Copying large objects instead of moving or passing by reference.
- Integer division truncation: `7 / 2 == 3`.
- `unordered_map` iteration order is not defined; use `map` for ordering.
- Using `using namespace std;` in headers (pollutes global namespace).

## Interview Tips

- Know when to use `vector` vs `deque` vs `list`.
- Compare `map` (ordered, O(log n)) with `unordered_map` (hashed, O(1)).
- Explain `unique_ptr` vs `shared_ptr` and reference counting.
- Implement a lambda that captures by value `[=]` vs reference `[&]`.
- Explain move semantics and why `std::move` is needed.
- Be comfortable doing two-pointer and sliding-window problems on vectors.
- Know how to use `priority_queue` as a heap (min-heap via comparator).
