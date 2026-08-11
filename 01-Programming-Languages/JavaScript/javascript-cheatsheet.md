---
layout: default
title: Javascript Cheatsheet
parent: JavaScript
nav_order: 1
---

# JavaScript Cheatsheet

> Quick reference for the language of the web. Runs in every browser and
> server-side via Node.js. Single-threaded, event-driven, multi-paradigm.

## Core Syntax

### Variables
```javascript
let name = "Alice";    // Mutable, block-scoped
const age = 30;        // Immutable binding, block-scoped
// Prefer const, use let only when rebinding is needed.
// Avoid var (function-scoped, hoisted, older style).
```

### Types
```javascript
typeof 42            // "number"
typeof "hi"          // "string"
typeof null          // "object"  <- famous bug
typeof {}            // "object"
typeof []            // "object"  <- use Array.isArray(arr)
typeof (() => {})    // "function"
typeof 10n           // "bigint"
typeof Symbol()      // "symbol"
```

### Template Literals
```javascript
const name = "Bob";
const greeting = `Hello, ${name}!`;   // Backticks + ${} interpolation
const multi = `
  line 1
  line 2
`;
```

### Functions
```javascript
// Function declaration (hoisted)
function add(a, b) {
    return a + b;
}

// Arrow function (not hoisted, no own `this`)
const add2 = (a, b) => a + b;

// Default and rest parameters
function greet(name = "World", ...rest) {
    return `Hello ${name}`;
}
```

### Destructuring
```javascript
const [first, second] = [10, 20];        // Array destructuring
const { name, age } = person;            // Object destructuring
```

### Loops
```javascript
for (let i = 0; i < 5; i++) { /* ... */ }

for (const item of array) { /* ... */ }    // Iterates values

for (const key in obj) { /* ... */ }       // Iterates keys (be careful)

while (condition) { /* ... */ }
```

### Conditionals
```javascript
if (score >= 90) {
    console.log("A");
} else if (score >= 80) {
    console.log("B");
} else {
    console.log("C");
}

const grade = score >= 90 ? "A" : "B";     // Ternary operator
```

## Data Structures & Collections

| Structure  | Syntax                    | Use Case                          |
|------------|---------------------------|-----------------------------------|
| Array      | `[]`                      | Ordered list of values            |
| Object     | `{}`                      | Key-value store / record          |
| Map        | `new Map()`               | Keys of any type, insertion order |
| Set        | `new Set()`               | Unique values                     |
| WeakMap    | `new WeakMap()`           | Object keys, no memory leak       |
| WeakSet    | `new WeakSet()`           | Object-only unique values         |
| TypedArray | `new Uint8Array(n)`       | Binary data (buffers)             |

```javascript
const map = new Map();
map.set("key", 1);
map.get("key");              // 1
map.has("key");              // true
map.delete("key");

const set = new Set([1, 1, 2, 3]);
set.size;                    // 3  (duplicates removed)
set.has(2);                  // true
```

### ES6+ Array Methods (map / filter / reduce)
```javascript
const nums = [1, 2, 3, 4];

const doubled = nums.map((n) => n * 2);          // [2, 4, 6, 8]
const evens = nums.filter((n) => n % 2 === 0);   // [2, 4]
const sum = nums.reduce((acc, n) => acc + n, 0); // 10

const found = nums.find((n) => n > 2);           // 3
const sorted = nums.toSorted((a, b) => a - b);   // returns new array
```

## String Handling

| Method              | Purpose                       |
|---------------------|-------------------------------|
| `str.length`        | Character count               |
| `str.toUpperCase()` | Uppercase copy                |
| `str.includes(x)`   | Contains substring check      |
| `str.startsWith(x)` | Starts-with check             |
| `str.split(delim)`  | Split into array              |
| `arr.join(sep)`     | Join array into string        |
| `str.slice(a, b)`   | Extract substring by indices  |
| `str.replace(a, b)` | First match replacement       |
| `str.trim()`        | Remove surrounding whitespace |
| `str.padStart(n,c)` | Left-pad to length            |
| `str.match(re)`     | Regex match                   |

```javascript
"a,b,c".split(",");                 // ["a", "b", "c"]
"hello world".includes("world");    // true
`value: ${x}`;                      // interpolation
```

## OOP Notes

- Classes are syntactic sugar over prototype-based inheritance.
- `class` + `constructor`, `extends`, `super`, and `static` keywords.

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    speak() {
        return `${this.name} makes a sound`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);           // must call before using this
        this.breed = breed;
    }
    speak() {
        return `${this.name} barks`;
    }
}
```

- `this` binding differs in arrow vs regular functions: arrows capture
  lexical `this`, regular functions get it from the call site.

## Asynchronous Programming (Promises, async/await)

```javascript
// Promise basics
const p = new Promise((resolve, reject) => {
    // async work here
    resolve(42);
});

p.then((val) => console.log(val))
 .catch((err) => console.error(err))
 .finally(() => console.log("done"));

// async/await (preferred)
async function fetchData() {
    try {
        const res = await fetch("https://api.example.com/data");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Request failed:", err);
    }
}
```

- `Promise.all([...])` runs promises concurrently and waits for all.
- `Promise.allSettled([...])` waits even if some reject.
- `Promise.race([...])` settles with the first settled promise.
- `await` is only valid inside an `async` function.

## JSON

```javascript
const obj = { name: "Alice", age: 30 };
const json = JSON.stringify(obj);     // '{"name":"Alice","age":30}'
const back = JSON.parse(json);        // { name: "Alice", age: 30 }
```

- JSON keys must be double-quoted; no trailing commas or comments.

## DOM Basics

```javascript
document.querySelector("#app");       // first match (CSS selector)
document.querySelectorAll(".item");   // NodeList of matches
document.getElementById("app");       // by id

el.textContent = "Hello";             // set text
el.innerHTML = "<b>HTML</b>";         // set HTML (XSS risk if untrusted)
el.classList.add("active");           // toggle CSS classes
el.addEventListener("click", handler);

const newEl = document.createElement("div");
parent.appendChild(newEl);
```

> Never use `innerHTML` with untrusted/user input - use `textContent`.

## Node.js Basics

```javascript
// Node.js modules (CommonJS)
const fs = require("node:fs");        // or import fs from "node:fs"
const http = require("node:http");

fs.readFileSync("file.txt", "utf8");  // sync read
fs.readFile("file.txt", "utf8", cb);  // async read

// Minimal HTTP server
const server = http.createServer((req, res) => {
    res.end("Hello from Node");
});
server.listen(3000);
```

- npm is the package manager: `npm init`, `npm install <pkg>`.

## Common Built-ins / Standard Library

| Built-in     | Purpose                                  |
|--------------|------------------------------------------|
| `Math`       | `max`, `min`, `floor`, `random`          |
| `Date`       | `new Date()`, `getTime()`, `toISOString` |
| `JSON`       | `stringify`, `parse`                     |
| `console`    | `log`, `warn`, `error`, `table`          |
| `Object`     | `keys`, `values`, `entries`, `assign`    |
| `Array`      | `map`, `filter`, `reduce`, `find`        |
| `Number`     | `isInteger`, `parseInt`, `toFixed`       |
| `RegExp`     | `test`, `match`, `replace`               |
| `globalThis`     | Global object across environments        |

## Memory & Performance Notes

- JS is garbage-collected; you cannot manually free memory.
- V8 optimizes hot functions (JIT), but dynamic code slows JIT.
- Watch for memory leaks: event listeners never removed, `setInterval`
  not cleared, closures holding large references, growing caches.
- `WeakMap`/`WeakSet` let the GC collect entries when keys are unreachable.
- Avoid blocking the event loop with heavy synchronous work.

## Real-World Use Cases

- Frontend SPAs and web apps (React, Vue, Angular).
- Backend APIs and servers (Node.js, Express, NestJS).
- Mobile apps (React Native) and desktop apps (Electron).
- Browser automation, web scraping, and build tooling.
- Full-stack development with a single language.

## Common Pitfalls

- `==` does type coercion; `0 == false` is `true`. Use `===` always.
- Comparing objects by `===` checks reference, not contents.
- `Array.sort()` converts to strings by default, so sort numbers
  with a comparator: `arr.sort((a, b) => a - b)`.
- Mutable method confusion: `push`, `sort`, `reverse` mutate in place;
  `map`, `filter`, `reduce`, `concat` return new arrays.
- Async code: forgetting `await` returns a pending Promise.
- `var` hoisting and function-scoping lead to subtle bugs.

## Interview Tips

- Know `let` vs `const` vs `var`, hoisting, and temporal dead zone.
- Be able to explain the event loop: call stack, microtasks,
  macrotasks, and how Promises and async/await schedule work.
- Practice closures, `this` binding, and debouncing/throttling.
- Master `map`/`filter`/`reduce` - a favorite question topic.
- Know the difference between prototypal and classical inheritance.
- Explain debouncing, throttling, memoization, and deep vs shallow copy.
- Be ready to trace `Promise.all`, race conditions, and error handling.
