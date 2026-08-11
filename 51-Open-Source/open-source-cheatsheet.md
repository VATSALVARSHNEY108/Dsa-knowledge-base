# Open Source Cheat Sheet

Quick reference for contributing to open source: finding projects, the
contribution workflow, communication etiquette, and building a portfolio.

## Core Concepts

- **Open Source**: Source code anyone can view, use, modify, and share.
- **Maintainer**: Owner(s) who review and merge contributions.
- **Contributor Workflow**: Fork -> branch -> changes -> PR -> review.
- **Upstream**: The original repository you contribute back into.
- **Issue Label**: Tags like `good first issue` that mark entry points.
- **Code of Conduct (CoC)**: Community rules for respectful interaction.

> Open source is remote collaboration under public record. Act like
> you would at a professional job in a shared office.

## Quick Reference Tables

### Finding Projects

| Source | How to Use |
|--------|-----------|
| GitHub Explore | Browse by topic, language, stars |
| `good first issue` search | Filter issues by that label |
| `help wanted` search | Issues the project wants help on |
| Projects you use | Contribute to tools you already know |
| GSOC / Outreachy | Structured programs with mentor support |
| Awesome lists | Curated collections by language |

> Better to fix a bug in a tool you use daily than to add a feature to a
> random popular repo where you understand nothing.

### Contribution Workflow

| Step | Command / Action |
|------|------------------|
| Fork | Click Fork on GitHub |
| Clone | `git clone <your-fork-url>` |
| Branch | `git checkout -b fix/logging-bug` |
| Changes | Commit small, focused diffs |
| Push | `git push origin fix/logging-bug` |
| PR | Open pull request against upstream |

### Issue Labels Decoded

| Label | Meaning |
|-------|---------|
| `good first issue` | Beginner-friendly, low context needed |
| `help wanted` | Open to outside contributors |
| `bug` | Defect with defined expected behavior |
| `enhancement` | New or improved feature |
| `documentation` | Docs/tutorial work to improve |
| `needs-review` | Community/PR review in progress |
| `no-assigner` | Free to claim (confirm in comments) |

### Communication Etiquette

| Do | Don't |
|----|-------|
| Read CONTRIBUTING.md first | Ask questions answered in docs |
| Search for duplicates before filing | File the same issue twice |
| Comment intent on an issue before PR | Open a PR out of nowhere |
| Keep comments calm and specific | Tone-policing or personal attacks |
| Reference issue numbers in PRs | Leave PRs stale for weeks |
| Thank maintainers for feedback | Demand merges or unrealistic ETA |

> Maintainers are unpaid volunteers. A kind, specific message gets help
> faster than an entitled one. Always assume good faith.

## Code Snippets

### Fork and Prepare Locally

```bash
git clone https://github.com/<you>/<repo>.git
git remote add upstream https://github.com/<owner>/<repo>.git
git fetch upstream
git checkout -b fix/null-handling upstream/main
```

### Keep Fork in Sync

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main --tags
```

### Commit Message Style

```
fix: handle null user in profile render
feat: add dark mode toggle
docs: clarify setup steps in README
refactor: simplify auth middleware
```

## Building a Portfolio via OSS

- Small merged PRs > giant unmerged PRs. Merge count is social proof.
- Improve docs and tests — real value, low risk, high merge rate.
- Track your history: a commit graph is a live portfolio.
- Ask maintainers for review-specific help; then iterate patiently.
- Pick one or two projects and build a long-term track record.
- Mention your merged PRs on your resume with links.

> Ten merged one-line fixes across 3 repos tells an employer more about
> collaboration than one abandoned 5k-line PR.

## Real-World Application

- **Rookie path**: Fix a typo/doc bug (merge), then a `good first
  issue` bug, then an enhancement over 2-3 months.
- **Student GSOC**: Spend the summer implementing a feature with a
  mentor; your name lands in project credits.
- **Tool you use**: You depend on a library daily; a fix you need gets
  merged — now the code is better for everyone and you get credit.
- **Company sponsor**: Many companies pay engineers to upstream fixes,
  which looks great on your LinkedIn history.

## Common Pitfalls

- Forking, running, then never opening a PR (wasted fork).
- Copy-pasting a tutorial commit verbatim into a big project.
- Refactoring entire codebases uninvited — rejected instantly.
- Harassing maintainers for status updates or merge timelines.
- Opening PRs without tests or docs when project expects them.
- Filing duplicate issues without searching first.
- Not reading CONTRIBUTING.md and / or CLA requirements.
- Taking feedback personally instead of iterating on it.