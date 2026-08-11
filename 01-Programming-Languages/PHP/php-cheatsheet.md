---
layout: default
title: Php Cheatsheet
parent: PHP
nav_order: 1
---

# PHP Cheatsheet

> Server-side scripting language for the web. Runs on Zend Engine,
> powers much of the modern web including WordPress and Laravel.

## Core Syntax

### Variables ($variables)
```php
<?php
$name = "Alice";      // String
$age = 30;            // Integer
$pi = 3.14;           // Float
$active = true;       // Boolean
$items = array(1, 2); // Array
// All variables begin with $ and are case-sensitive.
?>
```

### echo / Output
```php
<?php
echo "Hello World";           // Fastest output
echo $name, " and ", $age;    // Multiple arguments
print "Hello";                // Returns 1, single argument
?>
```

### Types & Casting
```php
<?php
$n = "42";
$num = (int) $n;              // 42 (integer cast)
$str = (string) 42;           // "42"
$float = (float) "3.14";
?>
```

### Functions
```php
<?php
function add($a, $b = 0) {    // Default parameter
    return $a + $b;
}

function sum(...$nums) {      // Variadic arguments
    return array_sum($nums);
}

$fn = fn($x) => $x * 2;       // Arrow function (PHP 7.4+)
?>
```

### Loops
```php
<?php
for ($i = 0; $i < 5; $i++) { echo $i; }

foreach ($items as $item) { echo $item; }
foreach ($items as $key => $val) { echo "$key: $val"; }

$n = 0;
while ($n < 3) { $n++; }
?>
```

### Conditionals
```php
<?php
if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {     // Note: elseif (not else if)
    echo "B";
} else {
    echo "C";
}

$grade = $score >= 90 ? "A" : "B";   // Ternary
$msg = $user ?? "guest";             // Null coalescing
?>
```

## Data Structures & Collections

| Structure             | Syntax                          | Use Case                  |
|-----------------------|---------------------------------|---------------------------|
| Indexed array         | `$a = [1, 2, 3];`               | Ordered numeric list      |
| Associative array     | `$a = ["k" => "v"];`            | Key-value store (map)     |
| Multidimensional      | `$a = [["x" => 1], ["x" => 2]];`| Nested data / tables      |
| SplFixedArray         | `new SplFixedArray(10)`         | Fixed-size fast arrays    |

```php
<?php
$fruits = ["apple", "banana"];            // Short array syntax
$fruits[] = "cherry";                     // Append
echo $fruits[0];                          // apple

$user = ["name" => "Alice", "age" => 30]; // Associative
echo $user["name"];                       // Alice
$user["city"] = "Berlin";                 // Add key

sort($fruits);                  // Sort by value
ksort($user);                   // Sort by key
echo count($fruits);            // 3
in_array("apple", $fruits);     // true
?>
```

## String Handling

| Function            | Purpose                          |
|---------------------|----------------------------------|
| `strlen($s)`        | Byte length                      |
| `strtoupper($s)`    | Uppercase                        |
| `strtolower($s)`    | Lowercase                        |
| `strpos($s, $needle)`| Position or false                |
| `substr($s, $start)`| Extract substring                |
| `str_replace(a,b,s)`| Replace all                      |
| `explode(delim, $s)`| Split into array                 |
| `implode(glue, $a)` | Join array into string           |
| `trim($s)`          | Trim whitespace                  |
| `str_contains($s,x)`| Contains check (PHP 8+)          |

```php
<?php
$parts = explode(",", "a,b,c");    // ["a","b","c"]
$joined = implode("-", $parts);    // "a-b-c"
$msg = "Hello $name!";             // Double-quote interpolation
?>
```

> Single quotes (`'...'`) do NOT interpolate variables; double quotes
> do. Use single quotes when no interpolation is needed.

## OOP Notes

- Classes, properties, methods, and `extends` for inheritance.
- Visibility: `public`, `protected`, `private`.
- `self::` for static access inside class, `$this->` for instance.

```php
<?php
class Animal {
    public $name;

    public function __construct($name) {
        $this->name = $name;
    }

    public function speak() {
        return "{$this->name} makes a sound";
    }
}

class Dog extends Animal {
    public function __construct($name, public string $breed = "mutt") {
        parent::__construct($name);
    }

    public function speak() {
        return "{$this->name} barks";
    }
}

$dog = new Dog("Rex", "Labrador");
echo $dog->speak();
?>
```

- Interfaces (`interface`, `implements`) define contracts.
- Abstract classes (`abstract`) cannot be instantiated directly.
- PHP 8: constructor property promotion, enums, readonly classes.
- Namespaces (`namespace App;`) and `use` for imports.
- Traits (`trait`) reuse behavior across unrelated classes.

## Superglobals ($_GET / $_POST)

| Superglobal | Source                 | Purpose                     |
|-------------|------------------------|-----------------------------|
| `$_GET`     | URL query string       | Read-only parameters        |
| `$_POST`    | HTTP request body      | Form / API data             |
| `$_REQUEST` | GET + POST + COOKIE    | Combined (prefer specific)  |
| `$_SERVER`  | Web server info        | Headers, method, URI        |
| `$_SESSION` | Session store          | User state across requests  |
| `$_COOKIE`  | Cookie data            | Client-side state           |
| `$_FILES`   | Uploaded files         | File upload handling        |
| `$_ENV`     | Environment variables  | Configuration               |

```php
<?php
$name = $_GET["name"] ?? "guest";      // Safe read with default
$email = $_POST["email"] ?? "";
echo $_SERVER["REQUEST_METHOD"];        // GET, POST, ...
session_start();                        // Enable sessions
$_SESSION["user"] = $user_id;           // Store session data
?>
```

> Always sanitize superglobal input with `filter_input` or prepared
> statements. Never trust raw `$_GET`/`$_POST` values.

## PDO Database Basics

```php
<?php
// Connection (DSN includes driver, host, dbname)
$pdo = new PDO(
    "mysql:host=localhost;dbname=app",
    "user",
    "pass",
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Prepared statement protects against SQL injection
$stmt = $pdo->prepare(
    "SELECT * FROM users WHERE email = ?"
);
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Insert with named placeholders
$pdo->prepare(
    "INSERT INTO users (name, email) VALUES (:name, :email)"
)->execute([":name" => $name, ":email" => $email]);
?>
```

> Use PDO prepared statements for ALL database queries - never
> concatenate user input into SQL strings.

## Error Handling (try/catch)

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=x", "u", "p");
    throw new Exception("something went wrong");
} catch (PDOException $e) {
    echo "DB error: " . $e->getMessage();
} catch (Exception $e) {
    echo "General: " . $e->getMessage();
} finally {
    echo "Always runs";
}

// Throw custom exceptions
function divide($a, $b) {
    if ($b === 0) {
        throw new InvalidArgumentException("Division by zero");
    }
    return $a / $b;
}
?>
```

## Composer Basics

- Composer is the PHP dependency manager (like npm for PHP).
- `composer.json` defines dependencies and PSR-4 autoloading.

```bash
composer init                    # Create composer.json
composer require monolog/monolog # Add a dependency
composer install                 # Install from lock file
composer update                  # Update within constraints
composer dump-autoload           # Regenerate autoloader
```

```php
<?php
require "vendor/autoload.php";   // Loads all dependencies
$log = new Monolog\Logger("app");
?>
```

## Common Built-ins / Standard Library

| Function group         | Examples                                  |
|------------------------|-------------------------------------------|
| Strings                | `strlen`, `strpos`, `substr`, `preg_*`    |
| Arrays                 | `array_map`, `array_filter`, `array_merge`|
| Math                   | `abs`, `round`, `rand`, `sqrt`            |
| Date/Time              | `date`, `time`, `strtotime`, `DateTime`   |
| Files                  | `file_get_contents`, `file_put_contents`  |
| JSON                   | `json_encode`, `json_decode`              |
| Type helpers           | `isset`, `empty`, `is_array`, `var_dump`  |
| HTTP                  | `header`, `http_response_code`            |

```php
<?php
$nums = [1, 2, 3, 4];
$doubled = array_map(fn($n) => $n * 2, $nums);   // [2,4,6,8]
$data = json_encode(["name" => "Alice"]);
$obj = json_decode($data, true);   // associative array
echo date("Y-m-d H:i:s");
?>
```

## Memory & Performance Notes

- PHP frees all variables at script end (per-request model).
- Keep scripts short; long requests hold memory and blocking time.
- `unset($bigArray)` releases memory early for large data.
- `foreach` copies arrays by value; use `&` reference to modify
  elements in place (then `unset($ref)` after the loop).
- OPcache caches compiled bytecode - enable it in production.
- `echo` multiple strings instead of concatenating with `.`.
- Each request is isolated: no shared state between requests unless
  you use sessions, databases, or caches.

## Real-World Use Cases

- Server-side web pages and dynamic websites.
- Web application frameworks: Laravel, Symfony, CodeIgniter.
- WordPress plugin and theme development.
- RESTful APIs and JSON backends.
- CLI tools, cron jobs, and E-commerce platforms.

## Common Pitfalls

- Loose comparisons: `0 == "foo"` is `true`; use `===` strictly.
- `strpos` returns `0` for a match at position 0, so check with
  `!== false` instead of truthiness.
- Missing `$` prefix on variables causes "undefined constant" errors.
- Single quotes do not interpolate; double quotes do.
- SQL injection when concatenating input into queries.
- `include` vs `require`: `require` fails hard on missing files.
- Assigning arrays `$a = $b` copies the array (value semantics).
- Headers already sent: any output before `header()` breaks it.

## Interview Tips

- Know the difference between `==` and `===`, `isset` vs `empty`.
- Be ready to write a secure login using PDO prepared statements.
- Understand PHP request lifecycle and superglobals.
- Explain OOP: visibility, inheritance, interfaces, traits, DI.
- Compare PHP 7 vs 8 features: typed properties, match, enums.
- Know composer, PSR-4 autoloading, and package management basics.
- Be able to identify SQL injection, XSS, and CSRF vulnerabilities
  and how to prevent them.
