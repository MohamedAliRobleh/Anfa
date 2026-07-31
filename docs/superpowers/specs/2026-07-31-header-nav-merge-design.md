# Header/Nav Merge — Premium Single-Row Header

## Problem

The header currently renders as two stacked bars: a top row (logo, FR toggle, CTA) and a second full-width row below it (separated by `border-t`) holding the centered nav links. This reads as two disconnected components rather than one cohesive premium header, and the logo is too small/quiet for a premium feel — it also shrinks further on scroll.

## Design

**Layout**: Collapse the two rows into a single `<header>` row:

`Logo (left) — nav links (centered) — FR toggle + Book CTA (right)`

The existing bottom bar (`border-t border-ink/5` wrapper + second `<nav>`) in [Header.jsx](../../../src/components/Header.jsx) is removed; nav links move into the same flex row as the logo and actions, using a 3-part flex layout (logo shrink-0, nav group centered via flex-1/justify-center, actions shrink-0 right).

**Logo**: `full-color` variant grows from `h-20` to `h-24`. Remove the scroll-based height swap (`scrolled ? 'h-16' : 'h-20'`) — the logo stays full size at all times. The "compact on scroll" feel still comes from the existing padding reduction (`py-4` → `py-2`) and blur/shadow/border transitions, unchanged. The `compact` mobile logo variant (`lg:hidden`) is untouched.

**Nav link style**: Replace the underline hover/active treatment (the `after:` pseudo-element in `linkBase`/`navLinkClassName`) with a pill background:
- Default: transparent background, `rounded-full px-4 py-2`.
- Hover (inactive): soft pill fades in — `hover:bg-lavender-soft` (or `hover:bg-mist`), `hover:text-sea-deep`.
- Active route: persistent pill — `bg-lavender-soft text-sea-deep font-semibold`, no underline.

This restyle applies identically to the plain `NavLink`s in [Header.jsx](../../../src/components/Header.jsx) and the dropdown trigger button in [NavDropdown.jsx](../../../src/components/NavDropdown.jsx), so both stay visually consistent. The dropdown's open panel styling (white card, shadow, ring) is unchanged.

**Spacing**: Row gets more horizontal padding to accommodate logo + nav + actions together comfortably; nav item gap adjusted as needed to avoid crowding.

**Colors**: Existing palette only — `sea-deep`, `sunlit` (CTA, unchanged), `lavender.soft`/`mist` (new pill hover/active), `sand` (header bg, unchanged). No new Tailwind tokens required.

## Out of scope

- Mobile header / [MobileNav.jsx](../../../src/components/MobileNav.jsx) — already hidden below `lg`, only the hamburger trigger shows there; unaffected by this row-merge.
- Any other page/component in the current git diff (Footer, About, BlogPost, Booking, Contact, ApproachSummary, IntroSahra, HorizonDivider) — those are pre-existing uncommitted changes unrelated to this task.

## Success criteria

- Header renders as one visual row (no visible seam/border between logo area and nav area) at `lg`+ widths.
- Logo is visibly larger and does not shrink when the page is scrolled.
- Nav links show a transparent background at rest and a soft pill background on hover; the active route shows a persistent pill instead of an underline.
- Existing scroll-triggered header chrome (blur, shadow, border, padding tightening) still works.
- No change to mobile (`<lg`) header behavior.
