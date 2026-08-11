---
layout: default
title: Automation Testing Cheatsheet
parent: Automation Testing
nav_order: 5
---

# Automation Testing Cheat Sheet

Quick reference for test automation: what to automate, framework types,
tool selection, page object model, CI integration, and flaky tests.

## Core Concepts

- **Test Automation**: Executing tests with scripts instead of humans.
- **Framework**: A set of rules and helpers (locators, runners, reports)
  that structure automated tests.
- **Test Runner**: Tool that discovers, runs, and reports tests.
- **Locator**: A way to identify an element (ID, CSS, XPath).
- **Fixtures/Setup**: Code that prepares state before tests run.
- **Flaky Test**: A test that fails intermittently without code changes.

> Automation replaces repetitive *checking*, not exploratory *thinking*.
> It is code: it needs design, review, and maintenance.

## Quick Reference Tables

### Automate vs Not

| Automate | Do NOT Automate |
|----------|-----------------|
| Runs often (regression, smoke) | One-off, throwaway checks |
| Stable, existing features | Rapidly changing UI |
| High volume of data cases | Tests needing human judgment |
| Critical paths | Usability / visual taste |
| Repetitive, tedious steps | Complex setup best done manually |

> Rule of thumb: if you would run it more than ~5 times a release, automate.

### Framework Types

| Type | How Tests Are Defined | Best For |
|------|----------------------|----------|
| Linear (record/playback) | Recorded steps in order | Demo, smoke of a single flow |
| Data-driven | Same steps, many datasets | Login, forms, CSV-driven |
| Keyword-driven | Reusable action keywords | Non-programming teams |
| BDD | Given/When/Then stories | Shared business language |
| Modular / Hybrid | Loosely coupled page functions | Large, long-lived suites |

### Tool Comparison

| Tool | Language | Best For | Notes |
|------|----------|----------|-------|
| Selenium WebDriver | Java, Python, etc. | Cross-browser E2E | Mature, slow, high maintenance |
| Cypress | JavaScript | E2E in browser | Great DX, auto-waiting, single browser focus |
| Playwright | JS/Python/Java/C# | Modern E2E, multi-browser | Auto-wait, network control |
| pytest | Python | API + unit + small UI | Fixtures, plugins, great reports |
| JUnit/TestNG | Java | Unit + integration | JUnit5 = Jupiter, TestNG has groups |
| Appium | JS/Python/Java | Mobile (iOS/Android) | Uses WebDriver protocol |

> Playwright (or Cypress) for new web E2E; Selenium only if you need
> legacy browser matrix depth.

## Common Patterns / Snippets

### Page Object Model (Python + Playwright)

```python
class LoginPage:
    def __init__(self, page):
        self.page = page
        self.email = page.get_by_label("Email")
        self.password = page.get_by_label("Password")
        self.submit = page.get_by_role("button", name="Sign in")

    def login(self, email, password):
        self.email.fill(email)
        self.password.fill(password)
        self.submit.click()


def test_login_success(page):
    login = LoginPage(page)
    login.login("demo@example.com", "secret")
    expect(page).to_have_url("**/dashboard")
```

> Page Object Model separates locators logic from test flows, so UI
> changes break in one place.

### Simple pytest Fixture

```python
import pytest

@pytest.fixture
def api_client():
    client = APIClient(base_url="https://staging.example.com")
    client.login("tester", "pass")
    yield client          # run test
    client.logout()       # teardown

def test_create_order(api_client):
    resp = api_client.post("/orders", json={"qty": 2})
    assert resp.status_code == 201
```

### CI Integration (GitHub Actions)

```yaml
name: e2e
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Best Practices

- Write tests against user-visible behavior, not internals.
- Use accessible locators (roles, labels) over brittle XPath.
- Keep tests independent and order-free.
- Add explicit waits only where needed; prefer auto-waiting tools.
- Run the smoke tier on every commit, full suite in nightly/CI.
- Retry only infrastructure races; hunt down real flakiness.
- Version test code with the app code it tests.
- Report results as artifacts (HTML, screenshots, traces).

## Handling Flaky Tests

- Add screenshots and video on failure to debug.
- Use `page.wait_for` instead of fixed `sleep()`.
- Pin test data; don't reuse shared mutable records.
- Isolate state per test (fresh DB, seeded fixtures).
- When flaky, disable + file a ticket; never shrug it off.

> A flaky test is a lie. Everyone learns to ignore red builds, and real
> regressions slip through.

## Real-World Application

- **E-commerce**: Playwright smoke suite runs on every deploy; pytest
  API suite covers checkout edge cases data-driven.
- **Fintech**: Data-driven pytest validates hundreds of account rules;
  nightly parallel run reports in CI artifacts.
- **Mobile app**: Appium suite covers signup/camera flows on device farm,
  triggered per release candidate.
- **SAAS dashboard**: Cypress E2E guards the top 5 user journeys while
  unit tests handle the rest of the pyramid.

## Common Pitfalls

- Automating a brand-new UI that still changes weekly.
- Record-and-playback suites nobody can maintain.
- Over-nesting locators: slow, brittle, and hard to fix.
- Tests sharing state and failing in random order.
- `sleep(5)` everywhere: slow suites, mystery failures.
- No CI: automation that only "runs on my machine".
- Ignoring flakes until the suite is red constantly.