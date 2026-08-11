---
layout: default
title: R Cheatsheet
parent: R
nav_order: 1
---

# R Cheatsheet

> Statistical programming language for data analysis, statistics, and
> visualization. Vectorized, functional, with an extensive CRAN ecosystem.

## Core Syntax

### Assignment & Types
```r
# Assignment operators (<- preferred, = also works)
x <- 42            # Numeric (double)
name <- "Alice"    # Character (string)
active <- TRUE     # Logical (TRUE/FALSE)
y <- 3.14          # Numeric
z <- 1L            # Integer (explicit L suffix)
f <- factor("a")   # Factor (categorical)
```

### Vectors (atomic, one type)
```r
v <- c(1, 2, 3, 4)          # Combine into numeric vector
w <- 1:10                    # Integer sequence
s <- seq(1, 10, by = 2)      # Sequence 1,3,5,7,9
r <- rep("x", 3)             # "x" "x" "x"
length(v)                    # 4
```

### Functions
```r
add <- function(a, b = 0) {   # Default argument
  a + b
}

mean_of <- function(x, na.rm = TRUE) {
  mean(x, na.rm = na.rm)
}
```

### Loops (vectorize when possible)
```r
for (i in 1:5) {
  print(i)
}

# Apply family (preferred over explicit loops)
lapply(list(1, 2, 3), sqrt)   # Returns list
sapply(list(1, 2, 3), sqrt)   # Simplifies to vector
vapply(v, sqrt, numeric(1))   # Typed, safer and faster
```

### Conditionals
```r
if (score >= 90) {
  print("A")
} else if (score >= 80) {
  print("B")
} else {
  print("C")
}

grade <- ifelse(score >= 90, "A", "B")   # Vectorized ternary
```

## Data Structures & Collections

| Structure | Build                    | Use Case                    |
|-----------|--------------------------|-----------------------------|
| Vector    | `c(1, 2, 3)`             | Single-type 1D data         |
| Matrix    | `matrix(1:9, nrow = 3)`  | 2D numeric data             |
| Array     | `array(1:8, dim = c(2,2,2))` | Multi-dimensional data  |
| List      | `list(a = 1, b = "x")`   | Mixed types / nested data   |
| Data frame| `data.frame(x = 1:3, y = c("a","b","c"))` | Tabular data |
| Tibble    | `tibble::tibble(...)`    | Modern tidy data frame      |

### Data Frames (the core structure)
```r
df <- data.frame(
  name = c("Alice", "Bob", "Cara"),
  age  = c(25, 30, 35),
  score = c(88, 92, 79)
)

df$name                      # Column via $
df[["age"]]                  # Column via name
df[1, 2]                     # Row 1, column 2
df[df$age > 28, ]            # Filter rows
head(df)                     # First 6 rows
summary(df)                  # Statistical summary
nrow(df); ncol(df)           # Dimensions
```

### Lists
```r
lst <- list(name = "Alice", scores = c(88, 92), meta = list(n = 1))
lst$name              # "Alice"
lst[["scores"]]       # 88 92
lst[1]                # sub-list containing element 1
lst[[1]]              # the element itself ("Alice")
```

## String Handling

| Function              | Purpose                       |
|-----------------------|-------------------------------|
| `paste(...)`          | Concatenate with sep          |
| `paste0(...)`         | Concatenate without sep       |
| `nchar(s)`            | Character count               |
| `toupper(s)` / `tolower(s)` | Case conversion         |
| `substr(s, start, stop)` | Extract substring          |
| `strsplit(s, split)`  | Split into character list     |
| `gsub(pattern, rep, s)`| Replace all matches           |
| `grepl(pattern, s)`   | Logical match test            |

```r
paste("a", "b", sep = "-")      # "a-b"
paste0("value_", 1:3)           # "value_1" "value_2" "value_3"
nchar("hello")                  # 5
strsplit("a,b,c", ",")          # list of "a" "b" "c"
gsub("[0-9]", "#", "a1b2")      # "a#b#"
```

## OOP Notes

- R has multiple OOP systems: S3 (simple), S4 (formal), R6 (reference).
- S3 is the default and pragmatic: generic + methods dispatched by class.

```r
# S3: class attribute on a list, dispatch by name
circle <- function(radius) {
  structure(list(radius = radius), class = "circle")
}

area <- function(obj) UseMethod("area")   # Generic

area.circle <- function(obj) {            # Method
  pi * obj$radius^2
}

c <- circle(2)
area(c)                       # 12.56637
class(c)                      # "circle"

print.circle <- function(obj) {           # Override print
  cat("Circle with radius", obj$radius, "\n")
}
```

- S4 uses `setClass`, `setMethod` with formal type checking.
- R6 uses reference semantics (mutate objects in place).
- For most data work S3 plus tidyverse is all you need.

## dplyr Basics (data manipulation)

```r
library(dplyr)

df %>%
  filter(age > 28) %>%            # Keep rows by condition
  select(name, score) %>%         # Keep columns
  mutate(grade = ifelse(score >= 90, "A", "B")) %>%  # New column
  arrange(desc(score)) %>%        # Sort
  summarise(avg = mean(score), n = n())   # Aggregate

# group_by + summarise for grouped stats
df %>%
  group_by(grade) %>%
  summarise(avg_score = mean(score), count = n())

# More dplyr verbs
slice(df, 1:2)            # Rows by position
distinct(df, name)        # Unique rows
rename(df, age_new = age) # Rename columns
count(df, grade)          # Frequency table
```

> The pipe `%>%` (magrittr) or native `|>` passes the left side as the
> first argument of the right-side function. Tidyverse verbs all take
> a data frame first - they compose naturally.

## ggplot2 Basics (visualization)

```r
library(ggplot2)

# Data + aesthetics + geometry layers
ggplot(df, aes(x = age, y = score)) +
  geom_point() +                       # Scatter plot
  geom_smooth(method = "lm") +         # Trend line
  labs(title = "Score vs Age",
       x = "Age", y = "Score") +
  theme_minimal()

# Bar chart and histogram
ggplot(df, aes(x = name, y = score)) + geom_col()
ggplot(df, aes(x = score)) + geom_histogram(bins = 10)

# Boxplot by group
ggplot(df, aes(x = grade, y = score)) + geom_boxplot()
```

- `aes()` maps variables to aesthetics (x, y, color, fill).
- Geometries: `geom_point`, `geom_line`, `geom_col`, `geom_boxplot`.
- Scales control legends/axes; themes control overall look.
- `ggsave("plot.png")` saves the last plot.

## Statistical Functions

```r
x <- c(2, 4, 6, 8, 10)

mean(x); median(x)            # Center
sd(x); var(x)                 # Spread
summary(x)                    # Five-number summary + mean

cor(df$age, df$score)         # Correlation

# Linear regression
model <- lm(score ~ age, data = df)
summary(model)                # Coefficients, p-values, R-squared

# Hypothesis test
t.test(x, mu = 5)             # One-sample t-test
chisq.test(table(df$grade, df$name))  # Independence test

# Random numbers and distributions
set.seed(42)                  # Reproducibility
rnorm(100, mean = 0, sd = 1)  # Normal samples
runif(10)                     # Uniform samples
```

## CRAN Packages

- CRAN is the central R package repository (20,000+ packages).
- Install once, load every session with `library()`.

```r
install.packages("dplyr")     # Install from CRAN
install.packages(c("ggplot2", "tidyr"))  # Multiple packages
install.packages("tidyverse") # The whole tidyverse at once

library(dplyr)                # Load package
library(ggplot2)

# Reading data files (readr)
read.csv("data.csv")
read_csv("data.csv")          # readr - faster, tibble output

# stringr: consistent string functions
library(stringr)
str_detect(df$name, "^A")     # Logical vector
```

- Other essential packages: `data.table` (fast large data),
  `lubridate` (dates/times), `tidyr` (reshaping), `purrr` (functional).

## Memory & Performance Notes

- Base R copies on assignment; large objects can double memory.
- Vectorize with `*`, `+`, functions - avoid element-wise loops.
- `vapply` > `sapply` for speed and type safety.
- `data.table` (`:=`, `setDT`) is much faster on large data.
- Pre-allocate results (e.g., `numeric(n)`) instead of growing.
- `NA` propagates in arithmetic; use `na.rm = TRUE` in summaries.
- Use `readr`/`data.table::fread` for huge files.

## Real-World Use Cases

- Statistical analysis and hypothesis testing.
- Data exploration and cleaning (tidyverse workflow).
- Data visualization for reports and dashboards.
- Machine learning (caret, tidymodels) and time series.
- Shiny interactive web applications.
- Biostatistics, econometrics, and academic research.

## Common Pitfalls

- R is 1-indexed: `v[1]` is the first element, not `v[0]`.
- Vectors hold one type - mixing coerces (e.g., `c(1, "a")` makes
  all characters).
- `==` returns a vector; use `identical` for full equality.
- `NA` comparisons return `NA`; filter with `is.na(x)`.
- Data frame `[` with one argument drops to a vector by default;
  use `df[, c("a", "b")]` to keep structure.
- `factor` silent coercion can reorder levels alphabetically.
- Forgetting `library()` after `install.packages()`.
- `:` vs `seq`: `1:10` includes 10; `seq` has explicit `by`.

## Interview Tips

- Distinguish vector, list, matrix, data frame, and tibble.
- Know `[`, `[[`, and `$` subsetting semantics precisely.
- Explain the apply family and when to use each member.
- Be ready to write a dplyr pipeline: filter, select, mutate,
  group_by, summarise, arrange.
- Know `NA`, `NULL`, `NaN`, and `Inf` differences.
- Explain vectorization and why loops are slow in base R.
- Show the ggplot2 layering model (data + aes + geoms).
- Understand factors vs characters and when levels matter.
