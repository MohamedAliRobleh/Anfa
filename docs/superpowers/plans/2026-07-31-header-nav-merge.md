# Header/Nav Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the header's two stacked bars into one premium single row (logo left, nav centered, actions right), enlarge the logo and stop it shrinking on scroll, and restyle nav links from underline to a pill-hover treatment.

**Architecture:** Pure presentational change confined to two existing components — [Header.jsx](../../../src/components/Header.jsx) (layout + logo sizing + `linkBase`/`navLinkClassName`) and [NavDropdown.jsx](../../../src/components/NavDropdown.jsx) (trigger button className, reusing the same `linkBase`/active convention). No new components, no new dependencies, no routing/data changes.

**Tech Stack:** React 18, react-router-dom v6, Tailwind CSS (existing tokens only: `sea-deep`, `sunlit`, `lavender.soft`, `mist`, `sand`, `ink`), Vitest + Testing Library.

## Global Constraints

- Use only existing Tailwind color tokens defined in [tailwind.config.js](../../../tailwind.config.js) — `sea`, `sea-deep`, `sunlit`, `lavender` (`DEFAULT`/`ink`/`soft`/`wash`), `mist`, `sand`, `ink`. No new tokens.
- Mobile (`<lg`) header/[MobileNav.jsx](../../../src/components/MobileNav.jsx) must not change — untouched by this plan.
- Existing scroll-triggered chrome (blur/shadow/border transition, padding tightening `py-4`→`py-2`) must keep working; only the logo's own height stops changing on scroll.
- Follow the existing test pattern in [Header.test.jsx](../../../src/components/Header.test.jsx): `render` inside `MemoryRouter` + `I18nProvider`.

---

### Task 1: Merge header into a single row and stop the logo shrinking on scroll

**Files:**
- Modify: `src/components/Header.jsx` (full `return` block, lines ~49-99)
- Test: `src/components/Header.test.jsx`

**Interfaces:**
- Consumes: existing `Logo`, `LanguageToggle`, `MobileNav`, `NavDropdown` components (unchanged props), `t()` from `useTranslation()`, `scrolled` state (unchanged).
- Produces: `Header` renders one `<header>` whose only direct child is a single row `<div>` (previously two: the top row `<div>` and the `border-t` wrapper `<div>`). Later Task 2 relies on `linkBase` and `navLinkClassName` still being exported the same way (unchanged in this task) and on the nav `<NavLink>`/`NavDropdown` elements living inside this same row.

- [ ] **Step 1: Write the failing tests**

Add to `src/components/Header.test.jsx` (below the existing test):

```jsx
test('renders as a single header row, not two stacked bars', () => {
  const { container } = render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const header = container.querySelector('header')
  expect(header.children).toHaveLength(1)
})

test('logo does not shrink when the page is scrolled', () => {
  const { container } = render(
    <MemoryRouter>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const logo = container.querySelector('img[src="/img/anfa-logo-full-color.svg"]')
  expect(logo).toHaveClass('h-24')

  Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
  window.dispatchEvent(new Event('scroll'))

  expect(logo).toHaveClass('h-24')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/Header.test.jsx`
Expected: FAIL — `header.children` has length 2 (not 1), and/or the logo lacks class `h-24` (it currently has `h-20`/`h-16`).

- [ ] **Step 3: Rewrite the Header `return` block**

Replace the entire `return (...)` block in `src/components/Header.jsx` (currently lines 49-99) with:

```jsx
  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? 'bg-sand/95 border-ink/5 shadow-[0_4px_24px_rgba(122,107,168,0.07)]'
          : 'bg-sand/80 border-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-[100rem] items-center gap-6 px-6 transition-[padding] duration-300 lg:px-8 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <NavLink
          to="/"
          aria-label="Anfa Counselling & Psychotherapy home"
          className="shrink-0 transition-transform duration-300 hover:scale-[1.02]"
        >
          <Logo variant="full-color" className="hidden h-24 lg:block" />
          <Logo variant="compact" className="lg:hidden h-14" />
        </NavLink>
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          <NavLink to="/" end className={navLinkClassName}>
            {t('common.nav.home')}
          </NavLink>
          <NavDropdown label={t('common.nav.about')} items={ABOUT_GROUP} linkBase={linkBase} itemLabel={itemLabel} />
          <NavDropdown label={t('common.nav.services')} items={SERVICES_GROUP} linkBase={linkBase} itemLabel={itemLabel} />
          <NavDropdown label={t('common.nav.learnMore')} items={LEARN_GROUP} linkBase={linkBase} itemLabel={itemLabel} />
          <NavLink to="/contact" className={navLinkClassName}>
            {t('common.nav.contact')}
          </NavLink>
        </nav>
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <LanguageToggle />
          <NavLink
            to="/booking"
            className="shrink-0 whitespace-nowrap rounded-full bg-sunlit px-6 py-2.5 text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(221,176,103,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(221,176,103,0.45)]"
          >
            {t('common.cta.bookFree')}
          </NavLink>
        </div>
        <MobileNav />
      </div>
    </header>
  )
```

This removes the second `border-t` wrapper `<div>` and its `<nav>` entirely — the nav now lives inside the single row `<div>`, between the logo and the actions group, using `flex-1 justify-center` to stay centered regardless of how wide the logo/actions groups are.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/components/Header.test.jsx`
Expected: PASS — all tests in the file, including the pre-existing "renders nav links and booking CTA" test.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/components/Header.test.jsx
git commit -m "feat: merge header into single row and stop logo shrinking on scroll"
```

---

### Task 2: Restyle nav links from underline to pill-hover

**Files:**
- Modify: `src/components/Header.jsx` (`linkBase` constant and `navLinkClassName` function, lines ~24-34)
- Modify: `src/components/NavDropdown.jsx` (trigger `<button>` className, lines ~51-55)
- Test: `src/components/Header.test.jsx`
- Test: `src/components/NavDropdown.test.jsx` (new file)

**Interfaces:**
- Consumes: `linkBase` (string) and `itemLabel`/`items` props already passed into `NavDropdown` from Task 1's JSX — unchanged signatures.
- Produces: `linkBase` becomes a plain pill-shaped base class string (no `after:` underline utilities). `navLinkClassName({ isActive })` returns `linkBase` plus `'bg-lavender-soft text-sea-deep'` when active, or `'text-ink/60 hover:bg-lavender-soft hover:text-sea-deep'` when inactive. `NavDropdown`'s trigger button uses the identical active/inactive class pair.

- [ ] **Step 1: Write the failing tests**

Add to `src/components/Header.test.jsx`:

```jsx
test('active nav link shows a solid pill, inactive links show pill on hover', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <I18nProvider><Header /></I18nProvider>
    </MemoryRouter>
  )
  const home = screen.getByRole('link', { name: 'Home' })
  const contact = screen.getByRole('link', { name: 'Contact' })

  expect(home).toHaveClass('bg-lavender-soft')
  expect(home).toHaveClass('text-sea-deep')
  expect(home).not.toHaveClass('after:w-full')

  expect(contact).toHaveClass('hover:bg-lavender-soft')
  expect(contact).not.toHaveClass('bg-lavender-soft')
})
```

Create `src/components/NavDropdown.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavDropdown } from './NavDropdown'

const linkBase = 'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-300'
const items = [['about', '/about'], ['approach', '/approach']]
const itemLabel = (key) => (key === 'about' ? 'About' : 'Our Approach')

test('inactive dropdown trigger shows pill on hover, not a solid pill at rest', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <NavDropdown label="About" items={items} linkBase={linkBase} itemLabel={itemLabel} />
    </MemoryRouter>
  )
  const trigger = screen.getByRole('button', { name: /About/ })
  expect(trigger).toHaveClass('hover:bg-lavender-soft')
  expect(trigger).not.toHaveClass('bg-lavender-soft')
})

test('active dropdown trigger shows a solid pill', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <NavDropdown label="About" items={items} linkBase={linkBase} itemLabel={itemLabel} />
    </MemoryRouter>
  )
  const trigger = screen.getByRole('button', { name: /About/ })
  expect(trigger).toHaveClass('bg-lavender-soft')
  expect(trigger).toHaveClass('text-sea-deep')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/components/Header.test.jsx src/components/NavDropdown.test.jsx`
Expected: FAIL — current classes are the underline (`after:...`) variants, not `bg-lavender-soft`/`hover:bg-lavender-soft`.

- [ ] **Step 3: Update `linkBase` and `navLinkClassName` in Header.jsx**

Replace lines 24-34 in `src/components/Header.jsx`:

```jsx
const linkBase =
  'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-wide transition-colors duration-300'

function navLinkClassName({ isActive }) {
  return [
    linkBase,
    isActive
      ? 'bg-lavender-soft text-sea-deep'
      : 'text-ink/60 hover:bg-lavender-soft hover:text-sea-deep',
  ].join(' ')
}
```

- [ ] **Step 4: Update the trigger button in NavDropdown.jsx**

Replace lines 51-55 in `src/components/NavDropdown.jsx`:

```jsx
        className={[
          linkBase,
          'inline-flex items-center gap-1',
          isActive
            ? 'bg-lavender-soft text-sea-deep'
            : 'text-ink/60 hover:bg-lavender-soft hover:text-sea-deep',
        ].join(' ')}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- src/components/Header.test.jsx src/components/NavDropdown.test.jsx`
Expected: PASS — all tests in both files.

- [ ] **Step 6: Run the full test suite to check for regressions**

Run: `npm test`
Expected: PASS — no other test (e.g. any page snapshot/DOM-shape assertions) depends on the old underline classes.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.jsx src/components/NavDropdown.jsx src/components/Header.test.jsx src/components/NavDropdown.test.jsx
git commit -m "feat: restyle nav links and dropdown trigger from underline to pill-hover"
```

---

### Task 3: Visual verification in the browser

**Files:** none (verification only)

**Interfaces:** none — this task consumes the finished header from Tasks 1-2 and produces no code.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Check the home page header at desktop width (≥1024px)**

Confirm visually:
- Logo, nav links, and FR toggle/CTA all sit in one row with no visible seam/border splitting logo from nav.
- Logo reads clearly larger than before.
- Scrolling the page down: header gets the blur/shadow/tighter-padding treatment, but the logo itself stays the same size.
- Hovering an inactive nav link (e.g. Contact) shows a soft pill background fade in; the active link (Home on `/`) shows a persistent pill, no underline.
- Opening a dropdown (About/Services/Learn More) still shows the existing white dropdown panel correctly positioned under the trigger.

- [ ] **Step 3: Check mobile width (<1024px)**

Confirm the hamburger menu (`MobileNav`) still opens/closes and lists all nav items exactly as before — no visual change expected here.

- [ ] **Step 4: Stop the dev server**

Stop the `npm run dev` process once verification is complete.

---

## Self-Review Notes

- **Spec coverage:** Single-row layout → Task 1. Logo bigger + no scroll-shrink → Task 1. Pill nav style (links + dropdown trigger) → Task 2. Spacing/padding adjustments → included in Task 1's row `gap-6` and Task 2's nav `gap-1`. Colors constrained to existing tokens → enforced in Global Constraints and used throughout (`lavender-soft`, `sea-deep`, `sunlit`, `sand`). Mobile out of scope → explicitly untouched, confirmed in Task 3 Step 3.
- **Placeholder scan:** none found — every step has concrete code or an exact command.
- **Type/name consistency:** `linkBase` and `navLinkClassName` names and call sites match between Header.jsx and NavDropdown.jsx across both tasks; `NavDropdown` props (`label`, `items`, `linkBase`, `itemLabel`) unchanged from current signature, verified against the existing `src/components/NavDropdown.jsx` source.
