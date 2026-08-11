# Frontend Cheat Sheet

Quick reference for HTML5, CSS, JavaScript, DOM, async programming, and React.

> The frontend is what users see and touch. Master the DOM, layout, and state.

## Core Concepts

### HTML5 Essentials
- Semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- `<article>` for self-contained content, `<aside>` for side content
- Media: `<video>`, `<audio>`, `<picture>`, `<source>`
- Canvas vs SVG: Canvas is pixel-based, SVG is vector/XML-based
- Form inputs: `input`, `select`, `textarea`, `datalist`, `fieldset`
- Local Storage vs Session Storage: `localStorage` persists, `sessionStorage` per tab
- Accessibility: `aria-label`, `role`, `alt`, semantic tags
- Meta viewport: `<meta name="viewport" content="width=device-width">`

### HTML5 Boilerplate
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>Content goes here</main>
  <script src="app.js" defer></script>
</body>
</html>
```

### CSS Selectors Table

| Selector | Example | Matches |
|----------|---------|---------|
| Universal | `*` | All elements |
| Type | `p` | All `<p>` elements |
| Class | `.card` | Elements with class `card` |
| ID | `#header` | Element with id `header` |
| Descendant | `div p` | `<p>` inside a `<div>` |
| Child | `div > p` | Direct `<p>` child of div |
| Sibling | `h2 + p` | `<p>` immediately after h2 |
| Attribute | `input[type="text"]` | Inputs of that type |
| Pseudo-class | `a:hover`, `p:first-child` | State / position |
| Pseudo-element | `p::before`, `p::after` | Generated content |

### CSS Specificity Order
```
inline style  >  id  >  class / attr / pseudo-class  >  element / pseudo-element
   1,0,0,0       1,0,0,0         1,0,0                  1,0
```

### Flexbox Quick Reference
```
.container { display: flex; flex-direction: row; justify-content: center;
             align-items: center; flex-wrap: wrap; gap: 1rem; }
.item      { flex: 1 1 200px; }   /* grow shrink basis */
```
- `justify-content`: main axis (center, space-between, flex-start/end)
- `align-items`: cross axis (stretch, center, flex-start/end)
- `flex-wrap: wrap` to avoid overflow on small screens

### Grid Quick Reference
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
```
- `grid-template-areas` for named layout regions
- `grid-column: span 2` and `grid-row: span 2` for item placement
- `1fr` units share leftover space proportionally

## Quick Reference Tables

### JavaScript Data Types
| Type | Example | Notes |
|------|---------|-------|
| String | `"hi"` | Immutable |
| Number | `42`, `3.14` | IEEE 754 float |
| Boolean | `true` | |
| Null | `null` | Explicit nothing |
| Undefined | `undefined` | Not assigned |
| Object | `{}`, `[]` | Reference type |
| Symbol | `Symbol("id")` | Unique key |
| BigInt | `10n` | Arbitrary precision |

### Core JS Operators
```
== vs ===   Use === (strict, no coercion). == coerces types.
??          Nullish coalescing: falls back only on null/undefined
?.          Optional chaining: a?.b?.c (no throw on null)
??=, ||=    Logical assignment shorthands
...         Spread (arrays/objects) and rest (function params)
```

### Common DOM Methods
```javascript
document.getElementById('id')
document.querySelector('.card')
document.querySelectorAll('button')
document.createElement('div')
element.textContent        // raw text, safe
element.innerHTML          // parses HTML, XSS risk
element.classList.add('active')
element.addEventListener('click', handler)
element.setAttribute('disabled', 'true')
parent.appendChild(child)
parent.removeChild(child)
```

## Common Patterns / Snippets

### Promise
```javascript
fetch('/api/user')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### Async / Await
```javascript
async function loadUser() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch failed', err);
  }
}
```

### Promise.all vs Promise.allSettled
- `Promise.all`: rejects on first rejection
- `Promise.allSettled`: waits for all, never rejects
- `Promise.race`: resolves/rejects with first settled
- `Promise.any`: resolves with first fulfilled

### Debounce Pattern
```javascript
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
// Use for search inputs and resize handlers
```

### Event Delegation
```javascript
document.querySelector('ul').addEventListener('click', e => {
  if (e.target.matches('li')) {
    console.log('Clicked item', e.target.textContent);
  }
});
```

## React Basics

### Components
```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Hooks Table

| Hook | Purpose | Common Use |
|------|---------|------------|
| `useState` | Local state | Form inputs, toggles |
| `useEffect` | Side effects | Fetch data, subscriptions |
| `useContext` | Share data | Theme, auth, i18n |
| `useReducer` | Complex state | Forms, counters |
| `useMemo` | Memoize value | Expensive calculations |
| `useCallback` | Memoize function | Stable props to children |
| `useRef` | Mutable ref | DOM refs, timers |
| `useLayoutEffect` | Sync layout | Measure before paint |

### useEffect Patterns
```javascript
useEffect(() => { /* run on mount */ }, []);
useEffect(() => { /* run when dep changes */ }, [dep]);
useEffect(() => {
  return () => /* cleanup on unmount */;
}, []);
```

### State Management Types
| Approach | Best For | Notes |
|----------|----------|-------|
| Local state | Single component | `useState` |
| Lifted state | Parent-child | Props + callbacks |
| Context | Shared global data | Re-renders on value change |
| Redux / Zustand | Large apps | Predictable, devtools |
| React Query | Server state | Caching, retries, invalidation |

> Lifting state up: move shared state to the closest common ancestor.

## Performance Tips

- Use `React.memo` only when re-renders are costly
- Virtualize long lists (`react-window`)
- Lazy-load routes: `React.lazy(() => import('./Page'))`
- Debounce expensive handlers (search, resize)
- Reduce layout thrash: batch DOM writes, avoid reads in loops
- Use CSS `content-visibility: auto` for off-screen content
- Preload critical assets, defer non-critical scripts
- Minify assets, serve HTTP/2, use CDN for static files
- Avoid re-creating objects/arrays in render bodies
- Web Worker for CPU-heavy tasks; never block the main thread

## Real-World Application

- **E-commerce site**: React components (ProductCard), server data via
  React Query, cart in context, images lazy-loaded
- **Dashboard**: Aggregated charts with canvas, filters via debounced
  search, WebSocket updates pushed into state
- **SSR app** (Next.js): Server components for SEO, hydration on client,
  layouts via App Router

## Common Pitfalls

- Using `innerHTML` with user input -> XSS vulnerability
- Uncontrolled vs controlled inputs mixing when editing forms
- Mutating state directly in React (use spread or immutable updates)
- Missing dependency arrays in `useEffect` causing stale closures
- Blocking the main thread with heavy synchronous work
- Not removing event listeners -> memory leaks
- Ignoring reflow/repaint costs of inline styles in loops
- `==` instead of `===` causing unexpected coercion bugs

## Interview Tips

1. Know the difference between `===` and `==`, and explain coercion
2. Explain event delegation and its performance benefit
3. Walk through lifecycle of a fetch call with async/await
4. Explain stacked contexts: prop drilling vs context vs Redux
5. Describe the render/commit phases and why keys matter
6. Understand flexbox vs grid: 1D vs 2D layout
7. Be ready to write a debounce/throttle from scratch
8. Explain SSR vs CSR tradeoffs (SEO, TTI, bundle size)
9. Mention accessibility (semantic HTML, ARIA) unprompted
10. Show you know how React reconciles the virtual DOM

> Cheat sheet of a frontend engineer: components, state, and data flows.