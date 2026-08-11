# Software Testing Cheat Sheet

Quick reference for software testing: the testing pyramid, levels and
types of testing, test cases, bug life cycle, and documentation.

## Core Concepts

- **Testing**: Executing software to find defects and verify it meets
  requirements.
- **Verification** ("are we building it right?") vs **Validation**
  ("are we building the right thing?").
- **Test Case**: Inputs, execution steps, and expected results.
- **Bug / Defect**: Deviation between expected and actual behavior.
- **Coverage**: Proportion of code or requirements exercised by tests.
- **Quality** is a property of the whole process, not the tester alone.

> Testing can prove the presence of bugs, never their absence. Make tests
> fast, deterministic, and run often.

## Quick Reference Tables

### The Testing Pyramid

| Layer | Purpose | Speed | Count | Examples |
|-------|---------|-------|-------|----------|
| Unit | Smallest pieces | Fast | Many | Functions, classes |
| Integration | Interactions | Medium | Medium | API, DB, services |
| E2E / UI | Full user flow | Slow | Few | Login, checkout |

> Keep the base wide: many unit tests, few brittle E2E tests.

### Levels of Testing

| Level | Verifies | Performer | Outcome |
|-------|----------|-----------|---------|
| Unit | One function/module | Developer | Early defect catch |
| Integration | Modules together | Developer | Interface contracts |
| System | Whole app | QA | End-to-end behavior |
| Acceptance (UAT) | Business needs | Business/User | Go / No-Go decision |

### Types of Functional Testing

| Type | Focus | Example |
|------|-------|---------|
| Smoke | Critical path works | Login then dashboard renders |
| Sanity | New feature behaves | New filter returns results |
| Regression | Nothing broke | Old features still pass |
| Re-testing | Specific bug fixed | Defect no longer occurs |
| Exploratory | Unscripted discovery | Tester hunts edge cases |
| Usability | User experience | Flow is intuitive |

### Non-Functional Testing

| Type | Measures | Goal |
|------|----------|------|
| Performance | Speed, throughput | Within response limits |
| Load | Behavior under load | Handle N concurrent users |
| Stress | Beyond limits | Find breaking point |
| Security | Vulnerabilities | Protect data and access |
| Compatibility | Across env/device | Works everywhere |

### Bug Severity vs Priority

| Severity | Impact | Example |
|----------|--------|---------|
| Critical | Blocks release | Data loss, app crash |
| Major | Core feature broken | Checkout fails |
| Minor | Inconvenient | Misaligned button |
| Trivial | Cosmetic | Typo, spacing |

| Priority | Meaning |
|----------|---------|
| P0 | Fix immediately (severity may be Low, e.g. legal issue) |
| P1 | Fix this sprint |
| P2 | Fix when time allows |
| P3 | Backlog / wishlist |

> Severity measures impact, priority measures urgency. A trivial issue can
> still be P0 if it blocks a compliance deadline.

## Common Patterns / Snippets

### Sample Test Case

| Field | Value |
|-------|-------|
| ID | TC-101 |
| Title | Login with valid credentials |
| Preconditions | User registered, app running |
| Steps | 1) Open login page 2) Enter email 3) Enter password 4) Submit |
| Expected | Redirect to dashboard, greeting shown |
| Priority | P1 |
| Automation | Yes - Selenium smoke test |

### BDD Test Case (Gherkin)

```gherkin
Feature: Login
  Scenario: Successful login
    Given a registered user with a valid password
    When the user submits the login form
    Then the user is redirected to the dashboard
    And a success message is displayed

  Scenario Outline: Failed login
    Given a registered user
    When the user submits credentials "<email>" and "<password>"
    Then the login error is shown
    Examples:
      | email          | password  |
      | wrong@mail.com | secret123 |
```

### Critical Path Smoke Test (Python + pytest)

```python
import pytest

@pytest.mark.smoke
def test_login_then_dashboard():
    page.login("demo@example.com", "pass")
    assert page.dashboard.is_visible()
```

## Bug Life Cycle

```
New -> Assigned -> In Progress
                 -> Fixed -> Verify (Retest)
                             - pass -> Closed
                             - fail -> Reopen -> Assigned
                 -> Duplicate / Won't Fix / Deferred
```

### Bug Report Should Include

- Clear, repeatable title and summary
- Environment (OS, browser, version, build)
- Steps to reproduce
- Actual result vs expected result
- Severity and priority
- Screenshots, logs, stack traces

## Test Documentation

| Artifact | Contains |
|----------|----------|
| Test Plan | Scope, strategy, resources, schedule |
| Test Cases | Steps, data, expected results |
| Test Report | Results, defects, coverage, conclusion |
| Traceability Matrix | Requirements -> test cases mapping |
| Defect Report | Details of each found bug |

## Best Practices

- Start tests early; shift testing left into development.
- Follow the pyramid: favor fast, reliable unit tests.
- One test = one scenario. Avoid mega-tests.
- Use independent test data; never depend on test order.
- Name tests by behavior, not implementation.
- Automate regression and smoke; keep exploratory testing manual.
- Report bugs with intent: how to reproduce, expected vs actual.
- Prioritize by severity AND priority, not just count.

## Real-World Application

- **E-commerce release**: Smoke suite runs post-deploy; regression suite
  in CI catches a broken cart before users see it.
- **Fintech**: Security and data-validation tests block high-risk defects
  and satisfy compliance gates.
- **Travel booking**: Load tests prove the checkout handles a flash sale
  of 50k concurrent users without timing out.
- **SaaS**: Exploratory testing before each sprint review surfaces UX
  issues a scripted suite would miss.

## Common Pitfalls

- Automating everything: brittle UI tests become a maintenance tax.
- No test data strategy: tests share mutating records and flake.
- Only happy paths: edge cases and error paths are left untested.
- Testing the implementation instead of the behavior.
- Ignoring test results: red builds merged anyway.
- Bug reports without repro steps waste developer time.
- Zero coverage measurement until release week surprises.