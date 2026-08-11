# Projects Cheat Sheet

Quick reference for planning, building, documenting, and presenting
portfolio projects that impress recruiters.

## Core Concepts

- **Portfolio Project**: A finished piece of work that demonstrates
  skills in a realistic context.
- **MVP**: Minimum Viable Product — the smallest version that delivers
  core value and can be shown.
- **Intentional Scope**: Pick projects that match your target role, not
  just your interests.
- **Show, Don't Tell**: A working demo and clean README beat a long
  wishlist of features.
- **Ownership**: Be able to explain every design decision confidently.

> One polished project that works beats five half-finished repos in an
> interview. Depth over breadth.

## Quick Reference Tables

### Project Selection Criteria

| Criterion | Ask Yourself |
|-----------|--------------|
| Relevance | Does it use the stack of my target role? |
| Story | Does it tell a clear problem-solution arc? |
| Scope | Can I finish a working MVP in 2-4 weeks? |
| Unique | What's interesting about it vs the 100 clones? |
| Data | Does it exercise real data / APIs / modeling? |
| Depth | Is there a hard problem I can explain? |

### Planning Steps

| Step | Action |
|------|--------|
| 1 | Define the problem and target user |
| 2 | Scope an MVP with 1-3 core features |
| 3 | Pick the tech stack matching resume goals |
| 4 | Sketch the architecture (diagram in README) |
| 5 | Build in vertical slices, commit daily |
| 6 | Write tests for the critical paths |
| 7 | Deploy publicly; add live demo + README |
| 8 | Polish: error handling, docs, one key metric |

### Tech Stack Choices by Goal

| Goal | Recommended Stack |
|------|--------------------|
| Frontend | React + TypeScript + Vite, deployed to Vercel |
| Full-stack | Next.js + Postgres + Prisma, deploy on Railway |
| Backend / API | FastAPI or Node/Express + Postgres + Docker |
| ML | Python, sklearn/pytorch + FastAPI serving + MLflow |
| Data Engineering | Airflow + dbt + Spark on cloud (BigQuery/S3) |
| Mobile | Flutter or React Native + Firebase |

> Use the stack recruiters list for your role. A React data-viz project
> signals frontend; a Kafka pipeline signals data engineering.

### MVP Approach

- Start with the single riskiest/most interesting feature.
- Kill features that do not make the demo impressive.
- Ship a "boring but working" version first, then refine.
- Deploy early; demos beat screenshots.
- Add polish last: auth, error states, empty states, loading.

## README & Documentation

| README Section | Content |
|----------------|---------|
| Title + one-liner | What it is, in one sentence |
| Demo | Video/GIF link or live URL first |
| Tech stack | Bullet list of tools used |
| Architecture diagram | ASCII or image of system flow |
| Setup | Exact commands to install and run |
| Features | What works, what is planned |
| Tests | How to run them |
| Challenges | Hard problems and how you solved them |

```markdown
# dealflow
Real-time deal tracker for startups. Built with Next.js + Postgres.

## Live demo
https://dealflow.example.com

## Stack
- Next.js 14, TypeScript, Tailwind
- Postgres + Prisma, deployed on Railway

## Run locally
npm ci && npm run dev
```

### Presentation in Portfolio

- Deploy it: broken links read as unprofessional.
- Have a 2-minute demo script rehearsed.
- In interviews, drive: problem -> architecture -> one hard problem
  -> one metric -> lesson.
- Add it to your resume in 2 strong bullet lines with metrics.

## Real-World Application

- **Just-for-me tool**: personal finance tracker proves SQL + auth care.
- **Replication of famous app (Trello, Airbnb clone)**: shows breadth.
- **Touching real data**: public-API dashboard (weather, crypto, GitHub)
  shows data skills.
- **Open-source contribution**: fixing a real bug in an OSS tool often
  beats a greenfield toy project.
- **Solves a pain you had**: genuine motivation survives interviews.

## Common Pitfalls

- Chasing features forever and never deploying the MVP.
- Copying a tutorial end-to-end without real changes.
- No README, no tests, no live demo — unverifiable claims.
- Wildly broad scope that runs out of time.
- Not matching the stack of the jobs you are targeting.
- Over-engineering with services you cannot explain.
- Failing to articulate the "why" and trade-offs made.
- Cramming 10 unrelated techs into one tiny project.

## Project Ideas Table

| Domain | Idea | Key Skills Shown |
|--------|------|------------------|
| Web | Expense tracker with budget alerts | CRUD, auth, charts |
| Data | Covid/weather/crypto analytics dashboard | API, SQL, viz |
| Automation | Resume keyword checker | Scripting, parsing |
| ML | House-price predictor with API | Modeling, MLOps lite |
| Ops | URL shortener with Docker + CI | Docker, CI/CD |
| Mobile | Habit tracker with local storage | Mobile patterns |
| E-commerce | Product review sentiment tool | Scraping, NLP