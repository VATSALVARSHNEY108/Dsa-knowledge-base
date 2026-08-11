---
layout: default
title: Python Cheatsheet
parent: Python
nav_order: 1
---

# Python Cheatsheet

> General-purpose, dynamically typed language. Emphasizes readability.
> Used for web, data science, scripting, AI, and automation.

## Core Syntax

### Variables (dynamic typing)
```python
name = "Alice"       # String
age = 30             # Integer
pi = 3.14            # Float
active = True        # Boolean (capital T)
items = [1, 2, 3]    # List
# No type declarations - type is inferred at runtime.
```

### Types
```python
i = 42               # int (arbitrary precision)
f = 3.14             # float (double precision)
c = 1 + 2j           # complex
s = "text"           # str (immutable)
b = b"bytes"         # bytes
t = (1, 2)           # tuple (immutable sequence)
l = [1, 2]           # list (mutable sequence)
d = {"k": "v"}       # dict (mutable mapping)
s = {1, 2, 3}        # set (unique values)
```

### Functions
```python
def add(a, b=0):             # Default argument
    """Docstring explaining the function."""
    return a + b

def total(*args, **kwargs):  # *args tuple, **kwargs dict
    return sum(args) + sum(kwargs.values())

square = lambda x: x * x     # Lambda (single expression)

def type_hint(x: int) -> int:
    return x * 2
```

### Loops
```python
for i in range(5):        # 0..4
    print(i)

for i, item in enumerate(items):   # index + value
    print(i, item)

for k, v in d.items():    # iterate dict pairs
    print(k, v)

n = 0
while n < 3:
    n += 1

# List comprehension
evens = [x * 2 for x in range(10) if x % 2 == 0]
```

### Conditionals
```python
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")

grade = "A" if score >= 90 else "B"   # Ternary
```

## Data Structures & Collections

| Structure | Syntax            | Mutable | Notes                        |
|-----------|-------------------|---------|------------------------------|
| list      | `[1, 2, 3]`       | Yes     | Ordered, allows duplicates   |
| tuple     | `(1, 2, 3)`       | No      | Ordered, hashable, fast      |
| dict      | `{"a": 1}`        | Yes     | Key-value, insertion-ordered |
| set       | `{1, 2, 3}`       | Yes     | Unique, unordered            |
| frozenset | `frozenset([1])`  | No      | Immutable set, hashable      |
| str       | `"text"`          | No      | Immutable character sequence |
| bytes     | `b"text"`         | No      | Immutable byte sequence      |

```python
l = [3, 1, 2]
l.append(4)                  # [3, 1, 2, 4]
l.sort()                     # [1, 2, 3, 4] (in place)

d = {"a": 1, "b": 2}
d.get("c", 0)                # 0 (no KeyError)
d.setdefault("b", 99)        # keeps existing 2
d["c"] = 3                   # add or update

s = {1, 2, 3}
s.add(4)
s.union({5})                 # {1,2,3,4,5}
s.intersection({2, 3, 9})    # {2, 3}
```

### Comprehensions
```python
sq = [x * x for x in range(5)]              # [0,1,4,9,16]
evens = [x for x in range(10) if x % 2 == 0]
sq_dict = {x: x * x for x in range(5)}      # dict comp
sq_set = {x % 3 for x in range(6)}          # set comp
gen = (x * x for x in range(5))             # generator (lazy)
```

## String Handling

| Method             | Purpose                       |
|--------------------|-------------------------------|
| `s.lower()`        | Lowercase copy                |
| `s.upper()`        | Uppercase copy                |
| `s.strip()`        | Trim whitespace               |
| `s.split(delim)`   | Split into list               |
| `"sep".join(list)` | Join list into string         |
| `s.replace(a, b)`  | Replace all occurrences       |
| `s.startswith(x)`  | Starts-with check             |
| `s.endswith(x)`    | Ends-with check               |
| `s.find(x)`        | Index or -1                   |
| `s.count(x)`       | Occurrence count              |
| `f"{x} and {y}"`   | f-string interpolation        |

```python
"a,b,c".split(",")              # ['a', 'b', 'c']
"-".join(["a", "b"])            # 'a-b'
name = "Alice"
f"Hello {name}, you are {age}"  # f-string (Python 3.6+)
s[::-1]                         # reversed string (slicing)
```

> Strings are immutable - every operation returns a new object.
> For heavy string building use a list plus `join()` or
> `io.StringIO`, not repeated `+=`.

## OOP Notes

- Everything is an object; classes use `class` keyword.
- Dunder (magic) methods control language behaviors.
- Single inheritance model, multiple inheritance allowed.

```python
class Animal:
    species = "animal"          # Class attribute

    def __init__(self, name):   # Constructor
        self.name = name        # Instance attribute

    def speak(self):
        return f"{self.name} makes a sound"

    def __repr__(self):         # Dunder: developer display
        return f"Animal({self.name!r})"

    def __str__(self):          # Dunder: user display
        return self.name

    def __len__(self):          # Enables len(obj)
        return len(self.name)

    @staticmethod               # No self or cls
    def info():
        return "I am an animal"

    @classmethod
    def create(cls, name):      # Takes cls, factory method
        return cls(name)


class Dog(Animal):
    def speak(self):            # Method override
        return f"{self.name} barks"
```

- Properties via `@property`, `@setter` for computed attributes.
- Common dunders: `__eq__`, `__lt__`, `__call__`, `__getitem__`,
  `__add__`, `__enter__`/`__exit__` (context managers).

## Modules & Imports

```python
import math
from collections import Counter, defaultdict
from datetime import datetime
import os
import sys

# Use __name__ guard for runnable scripts
if __name__ == "__main__":
    main()
```

### Virtual Environments & pip

```bash
python -m venv .venv        # Create environment
.venv\Scripts\activate      # Windows activation
source .venv/bin/activate   # macOS/Linux activation
pip install requests        # Install a package
pip install -r requirements.txt
pip freeze > requirements.txt  # Snapshot dependencies
pip list                    # Show installed packages
deactivate                  # Leave the environment
```

## Common Built-ins / Standard Library

### Standard Modules

| Module          | Key features                         |
|-----------------|--------------------------------------|
| `collections`   | `Counter`, `defaultdict`, `deque`    |
| `itertools`     | `chain`, `product`, `combinations`   |
| `math`          | `sqrt`, `floor`, `factorial`, `gcd`  |
| `os`            | `path`, `getcwd`, `listdir`, `env`   |
| `sys`           | `argv`, `path`, `exit`               |
| `json`          | `dumps`, `loads`                     |
| `re`            | `search`, `findall`, `sub`           |
| `datetime`      | `datetime`, `timedelta`, `strftime`  |
| `random`        | `random`, `choice`, `shuffle`, `seed`|
| `functools`     | `reduce`, `lru_cache`, `partial`     |

```python
from collections import Counter, defaultdict
from itertools import chain, combinations
import math, os, json

c = Counter("abracadabra")        # Count occurrences
d = defaultdict(list)             # Auto-default on missing key
d["a"].append(1)

list(chain([1, 2], [3, 4]))       # [1, 2, 3, 4]

math.sqrt(16)                     # 4.0
json.dumps({"a": 1})              # '{"a": 1}'
```

### Common Built-in Functions
```python
len(x), type(x), range(n), enumerate(xs)
sorted(xs, reverse=True), reversed(xs)
sum(xs), min(xs), max(xs), abs(x)
zip(a, b), any(cond), all(cond)
map(fn, xs), filter(fn, xs), reduce(fn, xs)
print, input, open, isinstance(x, int), id(x)
```

## Memory & Performance Notes

- Garbage-collected via reference counting + cycle detection.
- Use tuples for fixed-size data (less memory than lists).
- `set`/`dict` give O(1) membership/lookup; lists are O(n).
- For big numeric work, use NumPy (vectorized C operations).
- Generators (`yield`) compute lazily - good for huge sequences.
- `lru_cache` memoizes function results to avoid recomputation.
- Prefer `is None` checks over `== None`.
- Be aware of GIL: CPU-bound threads do not run in parallel;
  use `multiprocessing` for true parallelism.

## Real-World Use Cases

- Web backends: Django, Flask, FastAPI.
- Data science and machine learning: pandas, NumPy, PyTorch.
- Scripting and automation: file processing, cron jobs, scrapers.
- DevOps tooling: Ansible, Terraform providers, CI scripts.
- CLI tools, system administration, and testing frameworks.

## Common Pitfalls

- `=` assigns, `==` compares; `is` checks identity not value.
- Mutable default arguments are shared:
  `def f(xs=[]):` is a bug - use `xs=None` and create inside.
- Indentation defines blocks - mixing tabs/spaces breaks code.
- `list.sort()` mutates and returns None; `sorted()` returns new.
- Integer vs float division: `/` is float, `//` is floor.
- `range` excludes the stop value: `range(5)` is 0..4.
- Late binding in closures captures variables by reference.
- `is` vs `==` on strings works for small interned strings only.
- `import *` pollutes the namespace; import specific names.

## Interview Tips

- Explain GIL and when threading vs multiprocessing matter.
- Know time/space complexity of list/dict/set operations.
- Be fluent with comprehensions, generators, and `*args/**kwargs`.
- Explain mutable vs immutable and how to copy (`.copy()`,
  `copy.deepcopy`).
- Know dunder methods and when they are invoked.
- Understand `is` vs `==`, truthiness, and falsy values
  (`None`, `0`, `""`, `[]`, `{}`, `set()` are all falsy).
- Be ready to walk through decorators, context managers,
  and error handling with `try/except/finally`.
