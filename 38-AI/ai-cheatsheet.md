---
layout: default
title: AI Cheatsheet
parent: AI
nav_order: 2
---

# AI Cheat Sheet

Quick reference for Artificial Intelligence concepts: the AI landscape,
agents and search, knowledge representation, problem types, and evaluation.

## Core Concepts

- **AI (Artificial Intelligence):** Machines mimicking human cognition.
  The umbrella term for everything below.
- **ML (Machine Learning):** Subset of AI. Systems learn patterns from
  data instead of following hard-coded rules.
- **DL (Deep Learning):** Subset of ML. Uses multi-layer neural networks
  to learn hierarchical representations.
- **DS (Data Science):** Broader field covering statistics, data analysis,
  ML, and visualization to extract insights from data.
- **LLM (Large Language Model):** Huge neural networks (Transformer-based)
  trained on massive text corpora; power ChatGPT, Claude, Gemini.
- **GenAI (Generative AI):** Models that create new content (text, image,
  code, audio) from prompts.
- **Agent:** A system that perceives its environment, decides, and acts
  toward a goal (often with tools, memory, planning).

### AI vs ML vs DL vs DS

| Term | Scope | Example |
|------|-------|---------|
| AI | Broadest umbrella | Chess engines, robotics |
| ML | Learns from data | Spam email filter |
| DL | Neural nets, big data | Self-driving perception |
| DS | Insights from data | Sales forecasting dashboards |

```python
# Rule-based (classic AI) vs ML (learned) approach
import random

# 1. Classic AI: explicit rules
def rule_based_agent(hand):
    if "pair" in hand:
        return "call"
    return "fold"

# 2. ML: learned policy from data
def ml_agent(hand, model):
    return model.predict(hand)  # trained weights, not rules
```

## Search Algorithms (Classical AI)

| Algorithm | Type | Completeness | Optimal | Use When |
|-----------|------|--------------|---------|----------|
| BFS | Uninformed | Yes | Yes (unweighted) | Uniform cost edges |
| DFS | Uninformed | No* | No | Deep solution, low memory |
| IDDFS | Uninformed | Yes | Yes (unweighted) | Large state space |
| Uniform Cost | Uninformed | Yes | Yes (weighted) | Positive costs |
| Greedy Best-First | Informed | No | No | Fast heuristic estimate |
| A* | Informed | Yes | Yes | Admissible heuristic known |
| Hill Climbing | Local | No | No | Optimization, no optimality need |
| Simulated Annealing | Local | No | Approx | Escapes local minima |

\* DFS is complete only on finite graphs.

### A* Recap

```
f(n) = g(n) + h(n)

g(n) = cost from start to node n
h(n) = heuristic estimate from n to goal
```

- A* is optimal if h(n) is admissible (never overestimates).
- Faster than Uniform Cost Search when h is informative.

```python
def astar(start, goal, neighbors, heuristic):
    import heapq
    open_set = [(heuristic(start), 0, start)]
    came_from = {}
    g_score = {start: 0}

    while open_set:
        _, g, current = heapq.heappop(open_set)
        if current == goal:
            return reconstruct(came_from, current)
        for nxt, cost in neighbors(current):
            tentative = g + cost
            if tentative < g_score.get(nxt, float("inf")):
                g_score[nxt] = tentative
                came_from[nxt] = current
                heapq.heappush(open_set,
                               (tentative + heuristic(nxt), tentative, nxt))
    return None
```

## Knowledge Representation

| Method | Idea | Pitfall |
|--------|------|---------|
| Logic (FOL) | Symbols + rules, provable | Rigid, hard to scale |
| Production Rules | IF-THEN rules | Overlap, conflicts |
| Semantic Networks | Graph of concepts/relations | Ambiguity |
| Frames | Object-like structures with slots | Limited reasoning |
| Ontologies | Formal, shared vocab + taxonomy | Expensive to build |
| Knowledge Graphs | Entities + typed relations | Incomplete, stale |
| Embeddings | Dense vectors capturing meaning | Opaque, needs training |

> **Key note:** Modern systems lean toward knowledge graphs +
> embeddings. LLMs struggle with factuality, so combine memory (RAG)
> with vector search.

### Classic Search "Chinese Room" Debate

- Strong AI holds machines can truly understand.
- Weak AI treats machines as tools simulating behavior.

## Problem Types

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Classification | Predict a category | Spam or not |
| Regression | Predict a continuous value | House price |
| Clustering | Group similar items | Customer segments |
| Ranking | Order items by relevance | Search results |
| Generation | Create new content | Write an email |
| Planning | Sequence actions for a goal | Robot path |
| Constraint Satisfaction | Assign values obeying rules | Sudoku |
| Recommendation | Suggest relevant items | Movie picks |
| Anomaly Detection | Flag unusual data | Fraud |

## Solving Techniques

- **Search (classical):** BFS, DFS, A* for well-defined problems.
- **Optimization:** Genetic algorithms, simulated annealing, hill climbing.
- **Game playing:** Minimax with alpha-beta pruning (zero-sum games).
- **Logic/reasoning:** Rule engines, Prolog, constraint solvers.
- **Machine learning:** Learn patterns directly from example data.
- **Reinforcement learning:** Learn by trial and error via rewards.

### Minimax (2-player game)

```
value = min_or_max over children of (leaf utility / opponent move)
Alpha-beta pruning skips branches that cannot affect the result.
```

## Evaluation in AI

| Question | Metric / Method |
|----------|-----------------|
| Is the ML model good? | accuracy, precision, recall, F1, AUC |
| Is the rule/knowledge-base consistent? | logical consistency checks |
| Does the agent win? | win rate, expected value, Elo |
| Is the planner efficient? | run time, nodes expanded |
| Is the generator good? | BLEU, ROUGE, human evals |
| General reasoning quality | benchmarks (MMLU, GSM8K, SWE-bench) |

## Common Patterns / Snippets

### Typical ML quick start

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
print("accuracy:", accuracy_score(y_test, model.predict(X_test)))
```

### RAG pattern (LLM + knowledge base)

```python
# 1. Embed the user question
q_vec = embed(question)
# 2. Retrieve top-k relevant chunks via vector similarity
chunks = vector_db.search(q_vec, top_k=3)
# 3. Stuff chunks into the prompt and call the LLM
answer = llm(f"{context}\n\nQuestion: {question}")
```

## Real-World Applications

| Domain | Application |
|--------|-------------|
| Healthcare | Diagnosis support, drug discovery |
| Finance | Fraud detection, algorithmic trading |
| Transport | Self-driving cars, route optimization |
| E-commerce | Product recommendations, pricing |
| Customer service | Chatbots, ticket triage |
| Education | Adaptive quizzes, automated grading |
| Cybersecurity | Intrusion detection, threat triage |
| Media | Content moderation, deepfake detection |

## Common Pitfalls

1. **Confusing AI and ML** — ML is one branch of AI, not its synonym.
2. **Garbage in, garbage out** — Bad data beats a clever algorithm.
3. **Forgetting evaluation** — An unmeasured system is unvalidated.
4. **Overengineering** — Rule-based or simple ML often beats a neural net.
5. **Ignoring bias** — Models amplify biases present in training data.
6. **Chasing AGI** — Most real tasks are narrow, focused problems.
7. **Skipping explainability** — Opaque models hurt trust and compliance.

## Interview Tips

1. Define the problem type BEFORE choosing an approach.
2. Know when to search (A*) vs when to learn (ML).
3. Be able to derive complexity of search algorithms (O(b^d) for BFS).
4. Say "admissible heuristic" when discussing A* optimality.
5. Compare classic AI and ML trade-offs: interpretable vs flexible.
6. Walk through a real product: input, model, evaluation, deployment.
7. For GenAI roles, understand RAG, prompting, and hallucination control.

> **Parting note:** Interviews reward breadth — map a question to its
> problem type, then reason about an appropriate tool.