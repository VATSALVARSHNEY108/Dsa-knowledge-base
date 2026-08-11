---
layout: default
title: C Cheatsheet
parent: C
nav_order: 1
---

# C Cheatsheet

Quick-reference for C programming. Focuses on pointers, arrays, structs,
memory management, and strings. Compile with `gcc file.c -o file`.

## Core Syntax

### Variables and Types

| Type | Size (typical) | Format Specifier | Example |
|------|---------------|-----------------|---------|
| `char` | 1 byte | `%c` | `char c = 'A';` |
| `int` | 4 bytes | `%d` | `int n = 42;` |
| `unsigned int` | 4 bytes | `%u` | `unsigned u = 7;` |
| `long` | 8 bytes | `%ld` | `long l = 100L;` |
| `float` | 4 bytes | `%f` | `float f = 3.14f;` |
| `double` | 8 bytes | `%lf` | `double d = 2.71;` |
| `_Bool` | 1 byte | `%d` | `_Bool b = 1;` |

### Constants
```c
#define MAX_SIZE 100              // preprocessor constant
const int DAYS = 7;               // const-qualified variable
enum Color { RED, GREEN, BLUE };  // enumerated constants
```

### Input/Output with printf and scanf
```c
#include <stdio.h>

int n;
printf("Enter a number: ");
scanf("%d", &n);          // note the & (address-of) operator
printf("You entered: %d\n", n);

char name[50];
scanf("%49s", name);      // limit width to prevent overflow
printf("Hello, %s\n", name);
```

> `printf`/`scanf` live in `<stdio.h>`. Always pass the address of a variable
> to `scanf` (except for arrays, which decay to pointers).

### Control Flow
```c
if (x > 0) { ... } else if (x == 0) { ... } else { ... }

switch (grade) {
  case 'A': break;
  case 'B': break;
  default:  break;
}

for (int i = 0; i < n; i++) { ... }
while (cond) { ... }
do { ... } while (cond);
```

## Pointers

A pointer stores a memory address.

```c
int x = 10;
int *p = &x;     // p holds the address of x
*p = 20;         // dereference: write to x
printf("%d\n", *p);   // 20

int *q = NULL;   // null pointer (safety)
```

Common uses: pass by reference, dynamic memory, function pointers, arrays.

```c
void swap(int *a, int *b) {
  int tmp = *a;
  *a = *b;
  *b = tmp;
}
```

### Arrays and Pointer Arithmetic
```c
int arr[5] = {1, 2, 3, 4, 5};
printf("%d\n", arr[0]);      // 1
printf("%d\n", *(arr + 1));  // 2, arr + 1 == &arr[1]
printf("%zu\n", sizeof(arr)); // 20 bytes (5 * 4)
```

### Pointer to Function
```c
int add(int a, int b) { return a + b; }
int (*fp)(int, int) = add;
printf("%d\n", fp(2, 3));    // 5
```

## Structs and Unions
```c
#include <string.h>

typedef struct {
  char name[50];
  int age;
  double gpa;
} Student;

Student s;
strcpy(s.name, "Alice");
s.age = 20;
s.gpa = 3.8;

Student *sp = &s;          // pointer to struct
sp->age = 21;              // arrow operator
```

`union` shares memory between members; size is the largest member.

## Memory Management (malloc/free)

Dynamic allocation lives in `<stdlib.h>`.

```c
#include <stdlib.h>

int *arr = malloc(10 * sizeof(int));   // allocate
if (arr == NULL) { return 1; }         // check failure!
for (int i = 0; i < 10; i++) arr[i] = i;
free(arr);                             // deallocate
arr = NULL;                            // avoid dangling pointer

int *more = calloc(10, sizeof(int));   // zero-initialized
more = realloc(more, 20 * sizeof(int)); // resize (may move)
free(more);
```

> Always check `malloc` return value and always pair every allocation with
> exactly one `free`. Freeing twice is a double-free bug.

## Strings (char*)

C strings are null-terminated `char` arrays. Use `<string.h>`.

| Function | Purpose | Example |
|----------|---------|---------|
| `strlen(s)` | length (no null) | `strlen("hi") == 2` |
| `strcpy(d, s)` | copy (unsafe) | `strcpy(dst, src);` |
| `strncpy(d, s, n)` | bounded copy | `strncpy(dst, src, 49);` |
| `strcat(d, s)` | append | `strcat(dst, src);` |
| `strcmp(a, b)` | compare, 0 if equal | `strcmp(a, b) == 0` |
| `strchr(s, c)` | find char | `strchr(s, 'x')` |
| `sprintf(buf, fmt, ...)` | format into buffer | `sprintf(buf, "%d", n);` |

```c
char msg[64];
strcpy(msg, "Hello ");
strcat(msg, "World");
printf("%s (len %zu)\n", msg, strlen(msg));
```

String literals are read-only: `char *s = "fixed";` is constant memory.

## Standard Library Highlights

| Header | Contents |
|--------|----------|
| `<stdio.h>` | printf, scanf, fopen, fread, fwrite |
| `<stdlib.h>` | malloc, free, atoi, qsort, rand |
| `<string.h>` | strlen, strcpy, strcmp, memcpy |
| `<math.h>` | sqrt, pow, fabs, floor, ceil |
| `<ctype.h>` | isdigit, isalpha, tolower, toupper |
| `<time.h>` | time, clock, difftime |

```c
#include <stdlib.h>
int cmp(const void *a, const void *b) {
  return (*(int *)a - *(int *)b);
}
int nums[] = {5, 2, 9, 1};
qsort(nums, 4, sizeof(int), cmp);   // {1, 2, 5, 9}
```

## Data Structures and Collections

C has no built-in collections; you build them.

| Structure | Implementation | Typical Complexity |
|-----------|---------------|--------------------|
| Dynamic array | struct + malloc/realloc | O(1) amortized append |
| Linked list | struct node { data; next; } | O(n) traversal |
| Stack | array or linked list | O(1) push/pop |
| Queue | ring buffer or list | O(1) enqueue/dequeue |
| Hash table | open addressing / chaining | O(1) average lookup |
| Binary tree | struct node { left; right; } | O(log n) average search |

## Memory and Performance Notes

- Arrays are contiguous in memory; cache-friendly.
- Structs may have padding: use `sizeof` rather than summing fields.
- Pass large structs by pointer to avoid copying.
- Prefer `memcpy`/`memmove` for raw blocks; `memmove` handles overlap.
- Stack allocations are fast; heap (`malloc`) is slower but flexible.
- Enable optimizations: `gcc -O2 -Wall -Wextra`.

## Real-World Use Cases

- Operating system kernels and device drivers.
- Embedded systems and firmware.
- Compilers and interpreters.
- Database engines and network stacks.
- Game engines and real-time systems.

## Common Pitfalls

- **Buffer overflow**: `gets()` is banned; always bound your strings.
- Forgetting `&` in `scanf` (segfaults on input).
- Off-by-one errors: arrays are 0-indexed, and strings need `+1` for `\0`.
- Using `= NULL` vs `*p = NULL` (assign to pointer, not the pointee).
- Forgetting `break;` in `switch` cases.
- Memory leaks: malloc without matching free.
- Using uninitialized pointers and variables.
- Comparing floats directly with `==`.
- Forgetting `return 0;` at the end of `main`.

## Interview Tips

- Know the exact size of built-in types (typically `char`=1, `int`=4).
- Explain the difference between `arr[i]`, `*(arr + i)`, and pointer decay.
- Be ready to implement linked lists, stacks, and reversed strings.
- Understand the stack vs heap distinction and why it matters.
- Know `strncpy`/`snprintf` as safe alternatives to `strcpy`/`sprintf`.
- Always mention checking `malloc` failures and freeing resources.
