---
layout: default
title: Flashcards Cheatsheet
parent: Flashcards
nav_order: 3
---

# Flashcards Cheatsheet

Quick reference for using and creating flashcards to master CS,
DSA, and interview topics with spaced repetition.

## Why Flashcards Work

- **Active recall** — retrieving beats re-reading.
- **Spaced repetition** — reviews just before forgetting.
- **Interleaving** — mix topics to strengthen connections.
- **Metacognition** — you discover exactly what you don't know.

> Review schedule: day 1, 3, 7, 14, 30 — then monthly.

## Anatomy of a Good Flashcard

| Element | Bad Example | Good Example |
|---------|-------------|--------------|
| Front | "Linked list?" | "Time complexity of deleting a node at a known position?" |
| Back | "It's a list." | "O(1) — only the pointer is changed." |
| One fact | "Lists and trees." | "When to use a stack." |
| Concrete | "Hash map." | "Why is dict lookup O(1) average?" |

Rules: one fact per card, front = question, back = short answer,
add an example whenever possible.

## Creating Effective Cards

1. Write the card in YOUR words, not copied text.
2. Ask questions ("Why?", "When?", "How?") not definitions only.
3. Include a mini example on the back (code or diagram).
4. Tag cards by topic for targeted review.
5. Add cards immediately after learning something new.

## DSA Card Bank Ideas

- **Big-O**: worst/average/best of each data structure operation.
- **Patterns**: when to use two pointers, sliding window, heap,
  DFS vs BFS.
- **Recurrences**: master theorem cases with examples.
- **Algorithms**: Dijkstra works only on non-negative weights;
  BFS for unweighted shortest path.
- **Sorting**: which sorts are stable and why it matters.

```text
FRONT: When is Dijkstra's algorithm NOT correct?
BACK:  With negative edge weights — Bellman-Ford handles those.
```

## Systems / Interview Card Bank Ideas

- **OS**: difference between process and thread.
- **Networks**: TCP vs UDP, handshake steps.
- **SQL**: inner vs left join semantics.
- **System design**: when to shard, cache, or use a queue.
- **Behavioral**: STAR answers to common prompts.

## Spaced Repetition Schedule

```
New card learned  →  review next day
Day 1   review
Day 3   review
Day 7   review
Day 14  review
Day 30  review
Then monthly while you keep it "mastered"
```

Skip a card if you answer correctly; do it again today if wrong.

## Tools

| Tool | Best For |
|------|----------|
| Anki | Free, spaced repetition, huge community decks |
| Quizlet | Simple flashcard sets, app friendly |
| RemNote | Notes + flashcards in one |
| Notion | Custom databases with review status |
| Physical cards | Portability, no screen |

## Real-World Use Cases

- **Interview prep** — daily 15-minute DSA review.
- **Language learning** — syntax cards (e.g., "list.append in Python").
- **Certifications** — AWS/Azure service purpose cards.
- **New tech** — one card per new concept each day.

## Common Pitfalls

1. **Too many cards too fast** — review pile explodes.
2. **Copy-paste answers** — you won't truly recall them.
3. **Skipping failed cards** — failed = relearn now.
4. **No examples** — abstract cards don't stick.
5. **Ignoring tags** — can't target weak areas.

## Flashcard Workflow

```
1. Learn a concept today
2. Make 3-5 cards while it's fresh
3. Review daily using spaced repetition
4. Delete cards that feel obvious after 2 months
5. Add harder cards as you level up
```

> Consistency beats intensity: 10 cards daily for a month
> beats 300 cards in one weekend.