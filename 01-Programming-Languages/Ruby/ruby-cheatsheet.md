---
layout: default
title: Ruby Cheatsheet
parent: Ruby
nav_order: 1
---

# Ruby Cheatsheet

Quick-reference for Ruby: an elegant, object-oriented, dynamically
typed language best known for Rails web development and scripting.

## Core Syntax

### Variables and Types

```ruby
# Everything is an object; types are dynamic
name = "Ruby"        # String
count = 42           # Integer
price = 19.99        # Float
flag = true          # TrueClass / FalseClass
value = nil          # NilClass (no null)
sym = :status        # Symbol (immutable, interned)

# Constants start with an uppercase letter
MAX_RETRIES = 3

# Parallel assignment
a, b = 1, 2
```

> Ruby is duck typed: methods are matched by name, not type.

### Conditional Logic

```ruby
if count > 10
  puts "large"
elsif count > 5
  puts "medium"
else
  puts "small"
end

puts "hot" if count > 10        # inline modifier
puts "cold" unless count > 10   # unless is inverted if

case count
when 0 then puts "zero"
when 1..5 then puts "tiny"
when 6..10 then puts "small"
else puts "big"
end
```

### Loops

```ruby
# while / until
i = 0
while i < 5
  puts i
  i += 1
end

# Integer#times
3.times { |i| puts i }

# Range + each
(1..5).each { |n| puts n }     # inclusive
(1...5).each { |n| puts n }    # exclusive of 5

# each with index
["a", "b"].each_with_index { |v, i| puts "#{i}: #{v}" }
```

### Methods

```ruby
def greet(name, greeting = "Hello")
  "#{greeting}, #{name}!"
end

def add(a, b)
  a + b          # implicit return of last expression
end

def total(*nums) # splat collects args
  nums.sum
end

greet("Ada")            # => "Hello, Ada!"
```

### String Interpolation

```ruby
name = "Ruby"
puts "Learn #{name}"          # => Learn Ruby
puts "#{2 + 3} languages"     # => 5 languages
```

> Always use double quotes for interpolation and escapes;
> single quotes are literal.

## Data Structures & Collections

| Structure | Literal | Common Methods |
|-----------|---------|----------------|
| Array | `[1, 2, 3]` | `push`, `pop`, `shift`, `unshift`, `map` |
| Hash | `{ a: 1 }` | `[]`, `keys`, `values`, `fetch`, `merge` |
| Set (stdlib) | `Set.new([1, 2])` | `add`, `include?`, `union`, `intersect` |
| Range | `(1..5)` | `each`, `to_a`, `include?`, `step` |
| Symbol | `:foo` | `to_s`, `to_proc`, comparison |

```ruby
# Array quick reference
nums = [3, 1, 2]
nums << 4                       # append
nums.push(5)                    # append
nums.pop                        # remove last
nums.sort                       # => [1, 2, 3, 4, 5]
nums.include?(2)                # true
nums.first, nums.last           # 3 and 5

# Hash quick reference
h = { name: "Ada", age: 36 }
h[:name]                        # "Ada"
h[:age] = 37                    # update
h.fetch(:missing, "default")    # safe lookup
h.keys                          # [:name, :age]
h.merge({ city: "London" })     # new hash
```

## Blocks & Procs

```ruby
# Blocks are the core iteration abstraction
[1, 2, 3].each { |n| puts n }

# Multi-line block with do/end
[1, 2, 3].each do |n|
  puts n * 2
end

# Procs and lambdas are callable objects
double = proc { |x| x * 2 }
double.call(5)                  # => 10

square = ->(x) { x * x }        # lambda (strict arity)
square[4]                       # => 16

# Pass a block to a method
def repeat(times, &block)
  times.times(&block)
end
repeat(2) { puts "hi" }
```

> Blocks use `{}` for one-liners and `do/end` for multiple lines.
> Lambdas check arity; procs do not. This matters in interviews.

### Enumerable Methods

```ruby
nums = [1, 2, 3, 4, 5]
nums.map { |n| n * 2 }       # => [2, 4, 6, 8, 10]
nums.select(&:even?)         # => [2, 4]  (symbol to proc)
nums.reject { |n| n < 3 }    # => [3, 4, 5]
nums.reduce(0) { |acc, n| acc + n }  # => 15 (aka inject)
nums.any? { |n| n > 4 }      # true
nums.all? { |n| n > 0 }      # true
nums.max, nums.min           # 5 and 1
nums.sum                     # 15
```

## OOP Notes

```ruby
# Class with accessors
class Person
  attr_reader :name            # getter
  attr_writer :age             # setter
  attr_accessor :city          # both

  def initialize(name, age)
    @name = name
    @age = age
  end

  def introduce
    "Hi, I'm #{@name}"
  end
end

p = Person.new("Ada", 36)
p.name       # "Ada"

# Inheritance
class Developer < Person
  def initialize(name, age, language)
    super(name, age)
    @language = language
  end
end
```

### Modules & Mixins

```ruby
module Swimmable
  def swim
    "#{@name} swims"
  end
end

# Mixin: include adds instance methods, extend adds class methods
class Fish
  include Swimmable
end

# A module can also act as a namespace
module MathTools
  module_function
  def cube(x) = x**3
end
MathTools.cube(3)   # => 27
```

> Ruby has single inheritance. Modules (mixins) provide
> multiple-inheritance-like behavior and are used heavily
> by Rails (e.g., `include ActiveModel::Validations`).

## String Handling

```ruby
s = " hello, world "
s.length               # => 14
s.strip                # "hello, world"
s.upcase / s.downcase
s.capitalize           # "Hello, world"
s.split(", ")          # ["hello", "world"]
"a,b,c".split(",")     # ["a", "b", "c"]
s.chars                # array of chars
s.reverse
s.include?("hello")    # true
s.start_with?("hel")   # true
s.gsub("o", "0")       # "hell0, w0rld"
s.tr("eo", "EO")       # translate chars
"42".to_i              # => 42
s.to_sym               # :" hello, world " (avoid this)
"words".join(" ")      # no - join is for arrays
["a", "b"].join(" - ") # "a - b"
```

> Ruby strings are mutable. Prefix with `frozen_string_literal:
> true` in modern apps to make them immutable and faster.

## Common Built-ins / Standard Library

- `Kernel` — `puts`, `p`, `print`, `gets`, `require`, `loop`.
- `Object` — `nil?`, `class`, `methods`, `send`, `tap`, `instance_of?`.
- `Integer` / `Float` — `even?`, `abs`, `gcd`, `lcm`, `round`, `floor`, `ceil`.
- `Comparable` mixin — `==`, `<`, `<=>` (spaceship), sortable classes.
- `Math` — `Math.sqrt`, `Math.max`, `Math.log`, `Math::PI`.
- `Time` — `Time.now`, `Time.at`, formatting via `strftime`.
- `File` / `Dir` — read/write files, list directories.
- `JSON` — `require "json"`, `JSON.parse`, `JSON.generate`.
- `Regexp` — `/pattern/`, `=~`, `match?`, captures.
- `Struct` — light value objects: `Point = Struct.new(:x, :y)`.

### Gems and Bundler

```bash
gem install rails              # install a gem
bundle init                    # create Gemfile
bundle add rspec               # add dependency
bundle install                 # install from Gemfile.lock
bundle exec rspec              # run with locked versions
```

```ruby
# Gemfile
source "https://rubygems.org"
gem "rails", "~> 7.1"
gem "pg", ">= 1.0"
group :development, :test do
  gem "rspec-rails"
end
```

> Bundler pins exact versions in `Gemfile.lock`, ensuring
> reproducible builds. Always use `bundle exec` in scripts.

## Memory & Performance Notes

- Garbage collected (GC) — no manual memory management.
- Symbols are immutable and interned; reusing them is cheap,
  but creating many dynamic symbols leaks memory.
- Strings are mutable and allocate; prefer symbols for keys.
- Big-O is important: `Array#include?` is O(n); use a Set for O(1).
- `Hash#fetch` is safer than `[]` and avoids `nil` surprises.
- `map` creates a new array; `each` does not — choose deliberately.
- Use `frozen_string_literal: true` to reduce allocations.
- MRI Ruby has a GIL; threads share CPU for pure-Ruby work.
- Ruby is slower than compiled languages — offload hot loops
  or use C extensions (native gems) when needed.

> Ruby's priority is developer happiness and readability,
> not raw speed. Benchmark before optimizing.

## Real-World Use Cases

- Web applications via Ruby on Rails (full-stack MVC framework).
- API servers and JSON backends (Sinatra, Rails API mode).
- Scripting, automation, and dev tooling.
- DevOps tools (Chef, Puppet, Vagrant).
- Data scraping and ETL pipelines (Nokogiri, ActiveRecord).
- DSLs and configuration (Rake, Capistrano, Fastlane).
- Static site generation (Jekyll, used by GitHub Pages).

## Common Pitfalls

1. **`and`/`or` vs `&&`/`||`** — they differ in precedence;
   prefer `&&`/`||` for boolean logic.
2. **`==` vs `eql?` vs `equal?`** — `==` is value equality,
   `eql?` adds type strictness, `equal?` is identity.
3. **Mutable default arguments** — `def f(a = [])` reuses one
   array across calls; build a new one inside the body.
4. **Symbol vs String keys** — `h[:a]` and `h["a"]` are different
   lookups in the same hash.
5. **Modifying while iterating** — deleting from an Array inside
   `each` skips elements; collect first then delete.
6. **`puts` vs `return`** — `puts` prints; it does not return
   the value. The last expression is the implicit return.
7. **Missing `require`** — stdlib classes like `Set`, `JSON`,
   and `FileUtils` need explicit `require`.
8. **Global variables (`$x`)** — avoid; they leak state everywhere.
9. **String interpolation with single quotes** — `'#{x}'` is literal.
10. **`nil` calls** — `nil.some_method` raises NoMethodError;
    use `&.` safe navigation (`user&.name`).

## Interview Tips

1. Be fluent with Enumerable: `each`, `map`, `select`, `reduce`,
   `group_by`, `tally`, `chunk`.
2. Know `attr_accessor` vs `attr_reader` vs `attr_writer`.
3. Explain blocks, procs, and lambdas and when each is used.
4. Understand Ruby's object model: every value is an object,
   classes are objects, methods live in modules.
5. Practice `sort_by` with a block: `arr.sort_by { |x| x.size }`.
6. Use `Hash.new(0)` for counting, `Hash.new { |h,k| h[k] = [] }`
   for grouping — common interview patterns.
7. Know when to reach for `tap`, `yield`, `send`, and `to_proc`.
8. Mention Rails philosophy: convention over configuration and
   its active record patterns if discussing web work.
9. For whitespace-sensitive one-liners, remember `{}` vs `do/end`
   precedence: `do/end` binds looser than `{}`.
10. Practice FizzBuzz, word count, and reverse-a-string in Ruby;
    they exercise symbols, hashes, and Enumerable.
