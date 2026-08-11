# Low-Level Design Cheat Sheet

Quick reference for object-oriented design interviews: SOLID, class
diagrams, UML essentials, and classic design problems.

## Core Concepts

- **Low-level design (LLD)**: detail-level design of classes, objects,
  interfaces, and their interactions to solve one problem.
- **OOA (Object-Oriented Analysis)**: understand the domain, find nouns
  (candidates for classes) and verbs (candidates for methods).
- **OOD (Object-Oriented Design)**: decide classes, responsibilities,
  relationships, and patterns.
- **Steps**: read requirements -> identify entities -> assign
  responsibilities -> define relationships -> handle edge cases ->
  write code -> revisit constraints.

## OOA / OOD Steps in Practice

1. List every noun in the problem -> candidate classes + attributes.
2. List every verb -> candidate methods and their owning class.
3. Extract common behavior into base classes or interfaces.
4. Map relationships: has-a (composition/aggregation),
   is-a (inheritance), uses-a (dependency).
5. Apply SOLID; prefer composition over inheritance.
6. Write clean, readable, extensible code with tests in mind.

## SOLID Principles Quick Reference

| Principle | Name | Meaning | Red flag it fixes |
|-----------|------|---------|-------------------|
| S | Single Responsibility | A class has one reason to change | God objects |
| O | Open/Closed | Open for extension, closed for modification | Editing to add new types |
| L | Liskov Substitution | Subtypes replace base types | Broken inheritance |
| I | Interface Segregation | Small, focused interfaces | Fat interfaces |
| D | Dependency Inversion | Depend on abstractions, not concretions | Tight coupling |

### SOLID in One Line Each

- **S**: The `Invoice` class should not also print and email.
- **O**: Add a new payment method without touching existing ones
  (strategy/switch on type = violation).
- **L**: A `Square` should not inherit `Rectangle` if setWidth breaks
  invariants.
- **I**: Split `ParkingLotOps` into `Enterable` and `Payable` if
  clients need only one.
- **D**: `NotificationService` depends on an `Sender` interface, not
  on `EmailSender` directly.

## Class Diagram Basics (UML)

```
┌────────────────────────────┐
│        Vehicle             │       (abstract)
├────────────────────────────┤
│ - licensePlate: String     │
│ - owner: Person            │
├────────────────────────────┤
│ + parkIn(slot: Slot)       │
│ + chargePerHour(): double  │
└────────────────────────────┘
          ▲
          │ (is-a / generalisation)
   ┌──────┴──────┐
   │            │
┌─────────┐ ┌─────────┐
│  Car    │ │  Truck  │
└─────────┘ └─────────┘
```

- `+` = public, `-` = private, `#` = protected.
- Solid arrow: `is-a` (inheritance).
- Diamond + line: `has-a` (composition: solid, aggregation: hollow).
- Dashed arrow: `depends on` / `uses`.
- Arrow with triangle head points from subclass to superclass.

## UML Essentials

| UML element | Symbol | Meaning |
|-------------|--------|---------|
| Class | Rectangle, 3 sections | Name / attributes / methods |
| Interface | Name + `<<interface>>` | Contract of behavior |
| Inheritance | Solid line, hollow triangle | is-a |
| Composition | Filled diamond | owns, destroyed together |
| Aggregation | Hollow diamond | contains, shared lifecycle |
| Association | Plain line (multiplicity) | has-a, uses |
| Dependency | Dashed line, arrowhead | uses momentarily |
| Abstract class | Italic name | Cannot be instantiated |

> Always name multiplicity (1, 0..*, 1..*). A parking lot maps
> `1..*` slots, one vehicle per slot at a time.

## Classic Design Problems

### Parking Lot
- **Entities**: ParkingLot, Level, ParkingSpot, Vehicle, Ticket.
- **Flow**: vehicle enters -> assign nearest free spot by type ->
  issue ticket -> on exit compute fee by duration.
- **Extend**: spot types (compact/large), hourly rates, disabled.
- **Watch out**: full-lot handling, concurrent spot assignment.

```python
class ParkingLot:
    def __init__(self, floors):
        self.floors = floors
        self.spots = defaultdict(list)

    def park(self, vehicle):
        for spot in self.spots[vehicle.type]:
            if spot.is_free:
                spot.assign(vehicle)
                return spot
        raise LotFullError

    def leave(self, spot, hours):
        fee = spot.rate * hours
        spot.release()
        return fee
```

### Elevator
- **Entities**: Elevator, ElevatorController, Floor, Button, Request.
- **Core logic**: elevator direction, up/down request queues.
- **Algorithm**: nearest-car / shortest seek time; SCAN or LOOK.
- **Watch out**: overload, door timing, same-direction priority.

```python
class ElevatorController:
    def __init__(self):
        self.cars = [Elevator() for _ in range(3)]
        self.requests = []

    def request(self, floor, direction):
        best = min(self.cars,
                   key=lambda e: e.eta_for(floor, direction))
        best.add_stop(floor)
```

### Splitwise (bill splitting)
- **Entities**: User, Group, Expense, Split, Settlement.
- **Core logic**: expense split by equal/exact/percent.
- **Settle**: compute net balances, minimize transactions.
- **Watch out**: rounding, group vs global balances, currency.

```
Users: A, B, C   (50 / 25 / 25 of a $100 bill)
A paid  ->  B owes 25, C owes 25
After several expenses, net balance per user -> settle
with min transactions by pairing debtor with creditor.
```

### Movie Ticket Booking
- **Entities**: Movie, Show, Theater, Screen, Seat, Booking, User.
- **Flow**: pick show -> pick seat -> block -> pay -> confirm -> send.
- **Locking**: hold a seat for a TTL (5-10 min), release after timeout.
- **Watch out**: double booking (transactional lock), partial payment,
  2 seats adjacent constraint.

## Common Patterns in LLD Problems

| Pattern | Use when |
|---------|----------|
| Factory | Object type chosen at runtime (vehicle, payment) |
| Strategy | Swappable algorithms (fee calculation, parking strategy) |
| Observer | Notify on state change (booking -> email/SMS) |
| State | Object behavior changes with state (elevator, ticket) |
| Singleton | Single shared resource (config, logger, DB pool) |
| Decorator | Add behavior without altering object (seat add-ons) |
| Builder | Complex object construction (booking object) |

## Key Rules / Formulas

- Fee models: hourly, daily cap, block rate (half-day), free window.
- Rounding: always decide cents, taxes, and per-day boundaries.
- Booking hold TTL: block seat transparently or reserve + queue.
- Balance settlement: max transactions needed = creditors - 1.

## Common Pitfalls

- Starting to code before listing entities and their responsibilities.
- Making classes with multiple unrelated responsibilities (violates S).
- Modeling inheritance where composition fits better.
- Forgetting concurrency: multiple users claiming one seat/slot.
- Ignoring edge cases: full lot, end of day, refunds, off-hours.
- Over-engineering with patterns when a simple class suffices.

## Interview Tips

1. Ask clarifying questions: single user or multiuser? persistence?
2. Design classes with clean interfaces; delay implementation details.
3. State the relationships explicitly (composition vs inheritance).
4. Handle a concurrency angle; interviewers love it (seat locking).
5. Keep code readable: meaningful names, small methods, no magic numbers.
6. Prepare classic problems: parking lot, elevator, VendingMachine,
   Amazon cart, ATM, chess, snake-and-ladder, tic-tac-toe, LRU cache,
   restaurant table allocation, load balancer.