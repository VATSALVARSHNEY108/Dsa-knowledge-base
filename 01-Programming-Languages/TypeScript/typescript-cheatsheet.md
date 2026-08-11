---
layout: default
title: Typescript Cheatsheet
parent: TypeScript
nav_order: 1
---

# TypeScript Cheatsheet

Quick-reference for TypeScript: a statically typed superset of
JavaScript that compiles to plain JS, popular in web frontend
and Node.js backends.

## Core Syntax

### Type Annotations

```typescript
// Variable annotations
let count: number = 10;
const name: string = "Ada";
let flag: boolean = true;
let anything: any = "could be anything";
let unknown: unknown = 42;   // safer than any

// Inference: annotation often optional
let inferred = "types";      // string
```

> TypeScript is a compile-time type system. Types disappear
> at runtime — it compiles to plain JavaScript.

### Control Flow

```typescript
let n = 10;
if (n > 5) {
  console.log("big");
} else if (n > 2) {
  console.log("mid");
} else {
  console.log("small");
}
```

### Loops

```typescript
// for...of over values
const items = [1, 2, 3];
for (const item of items) {
  console.log(item);
}

// Array iteration methods
items.forEach((v, idx) => console.log(idx, v));
```
```

### Functions

```typescript
function add(a: number, b: number): number {
  return a + b;
}

// Arrow functions
const square = (x: number): number => x * x;
const add2 = (a: number, b: number): number => a + b;

// Function types
type MathOp = (a: number, b: number) => number;
const op: MathOp = (a, b) => a + b;

// Rest params (optional/default params also supported)
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
```

## Interfaces vs Types

```typescript
// Interface: describes object shapes (can be merged/extended)
interface User {
  id: number;
  name: string;
  email?: string;        // optional
  readonly createdAt: Date;
}

// Type alias: unions, primitives, tuples, and more
type ID = string | number;
type Point = { x: number; y: number };

// Interfaces extend
interface Admin extends User {
  role: "admin";
}
```

> Use `interface` for object shapes that may be extended;
> use `type` for unions, tuples, and complex compositions.

## Union / Literal / Narrowing

```typescript
// Union types
let value: string | number = "x";
value = 42;   // ok

// Literal types
type Direction = "north" | "south" | "east" | "west";
let d: Direction = "north";   // "northwest" would error

// Discriminated unions + narrowing
interface Circle { kind: "circle"; radius: number }
interface Square { kind: "square"; side: number }
type Shape = Circle | Square;

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side * s.side;
  }
}
```

## Generics

```typescript
// Identity with type parameter
function identity<T>(value: T): T {
  return value;
}
const n = identity(5);        // number
const s = identity("hi");     // string

// Generic interfaces and types
interface Box<T> {
  value: T;
}
```

## String Handling

```typescript
const s = "Hello, TypeScript";
s.length                       // 17
s.toUpperCase()                // "HELLO, TYPESCRIPT"
s.includes("Type")             // true
s.startsWith("Hello")          // true
s.endsWith("Script")           // true
s.indexOf("e")                 // 1
s.slice(0, 5)                  // "Hello"
s.split(", ")                  // ["Hello", "TypeScript"]
s.replace("TypeScript", "JS")  // "Hello, JS"
s.trim()                       // trim whitespace
s.match(/[A-Z]+/g)             // regex match

// Template literals
const name = "Ada";
const age = 36;
const msg = `${name} is ${age}`;   // "Ada is 36"
const joined = ["a", "b", "c"].join("-");   // "a-b-c"
```

> Strings are immutable primitives; concatenation in a loop
> should use an array joined together for performance.

## Arrays, Tuples, Enums

```typescript
// Arrays
const nums: number[] = [1, 2, 3];

// Tuples: fixed length with per-position types
let tuple: [string, number, boolean] = ["Ada", 36, true];

// Enums
enum Status {
  Pending,    // 0
  Active,     // 1
  Done = 5,   // explicit value
}
```

> Prefer union literal types over enums when the set is small
> and simple; enums add runtime objects.

## Data Structures & Collections

| Type | Description | Common Methods |
|------|-------------|----------------|
| `Array<T>` | Ordered list | `push`, `pop`, `map`, `filter`, `reduce` |
| `Map<K,V>` | Key/value pairs | `set`, `get`, `has`, `delete`, `size` |
| `Set<T>` | Unique values | `add`, `has`, `delete`, `size` |
| `Record<K,V>` | Typed object map | `Object.keys`, `Object.values` |
| `Tuple` | Fixed-length array | destructure, index access |
| `Object` | Plain object | `keys`, `values`, `entries`, `assign` |

```typescript
// Array<T>
const nums: number[] = [1, 2, 3];
nums.push(4);
nums.map((n) => n * 2);          // [2, 4, 6, 8]
nums.filter((n) => n > 2);       // [3, 4]
nums.reduce((a, b) => a + b, 0); // 10
nums.find((n) => n === 3);       // 3 | undefined
nums.includes(2);                // true

// Map<K,V> and Set<T>
const scores = new Map<string, number>();
scores.set("Ada", 36);
scores.get("Ada");               // 36
const seen = new Set<number>([1, 2, 3]);
seen.add(4);
seen.has(2);                     // true
```

> Use `Map`/`Set` over plain objects when keys are dynamic
> or you need insertion-order guarantees and `.size`.

## Classes & Access Modifiers

```typescript
class Animal {
  public name: string;         // default: public
  private secret = "hidden";
  protected kind = "mammal";
  readonly id: number;         // assign once

  constructor(name: string, id = 0) {
    this.name = name;
    this.id = id;
  }

  speak(): string {
    return `${this.name} makes a sound`;
  }
}

// Inheritance
class Dog extends Animal {
  override speak(): string {
    return `${this.name} barks`;
  }
}

// Abstract classes + implements
abstract class Shape {
  abstract area(): number;
}
class Circle implements Shape {
  constructor(private radius: number) {}
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

> `public`, `private`, `protected`, `readonly`, `abstract`,
> and `implements` bring structured OOP to JS.

## tsconfig Essentials

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

```bash
npm install -g typescript
tsc --init                # generate tsconfig.json
tsc                       # compile all files
tsc --noEmit              # type-check only
```

> `strict: true` enables strict null checks and stricter
> inference — the single most valuable setting.

## Compile to JS

> `tsc` (or bundlers like Vite/tsup) erases types and emits
> JavaScript. Source with types compiles to plain JS:

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

## Common Built-ins / Standard Library

- `string` — `length`, `toUpperCase`, `includes`, `split`,
  `replace`, `startsWith`, `trim`.
- `number` — `toFixed`, `parseInt`, `Number()`, `isNaN`,
  `Math.*` (floor, ceil, round, max, min, random).
- `Array<T>` — `push`, `pop`, `map`, `filter`, `reduce`,
  `find`, `some`, `every`, `sort`, `includes`.
- `Map<K, V>` — `set`, `get`, `has`, `delete`, `size`.
- `Set<T>` — `add`, `has`, `delete`, `size`.
- `Promise<T>` — `then`, `catch`, `finally`, `async`/`await`.
- `Object` — `keys`, `values`, `entries`, `assign`.
- `JSON` — `parse`, `stringify`.
- Type helpers — `Record<K, V>`, `Partial<T>`, `Pick<T, K>`,
  `Omit<T, K>`, `Readonly<T>`, `ReturnType<T>`.

## Memory & Performance Notes

- Same engine as JS: V8 garbage collection, JIT compilation.
- Types vanish at compile time — no runtime overhead.
- Avoid `any`; it disables all type safety.
- Prefer `const` and value semantics for predictable behavior.
- `as const` gives literal inference for config objects.
- Use `--noEmit` in CI to type-check quickly without emitting.

> TypeScript is a superset: any valid JS is valid TS. Adopt
> gradually; strict mode catches real bugs early.

## Real-World Use Cases

- Frontend frameworks: React, Angular, Vue, Svelte.
- Full-stack apps with Node.js + Express/NestJS/Fastify.
- Design systems and component libraries.
- Large codebases needing refactoring safety.
- GraphQL schemas and typed API clients.
- Mobile via React Native and Ionic.
- Desktop via Electron.
- Tooling and CLI development (tsx, ts-node).

## Common Pitfalls

1. **Overusing `any`** — silently disables type safety.
2. **`null` vs `undefined`** — strict mode treats them
   separately; handle both.
3. **`===` vs `==`** — use `===`; `==` does coercion.
4. **Type assertions vs casting** — `as` does not change
   runtime value; it only tells the compiler.
5. **Union narrowing surprises** — check with `typeof`,
   `in`, or discriminated `kind`.
6. **Mutation after readonly** — `readonly` is compile-time
   only; `as const` helps.
7. **Enum numeric values change** — prefer string enums or
   literal unions for stability.
8. **`this` binding** — arrow functions capture `this`
   lexically; method references need binding.
9. **Import type vs value** — with `verbatimModuleSyntax`,
   use `import type` for type-only imports.
10. **Empty function returns** — `void` vs `undefined`
    mismatch in callbacks.

## Interview Tips

1. Explain the value of static typing and when TS beats JS.
2. Know `interface` vs `type` trade-offs by heart.
3. Be fluent with generics and utility types
   (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`).
4. Practice discriminated unions for state machines.
5. Explain strict mode and `strictNullChecks`.
6. Know how compilation erases types and works with JS.
7. Understand `unknown` vs `any` and when to use each.
8. Be ready to type a React component (props interface).
9. Mention `as const`, `satisfies`, and literal inference.
10. Practice mapping `interface` + `type` patterns for
    API responses and configuration objects.
