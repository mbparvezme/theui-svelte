# Contributing to theui-svelte

Thanks for your interest in the project. Before you start work on a new feature or a bug fix,
please open an issue first so we can discuss it and avoid duplicated effort:
[GitHub Issues](https://github.com/mbparvezme/theui-svelte/issues).

This file covers the things the type definitions cannot express: the conventions the library
follows, how the components compose, the issues we already know about, and what to run before
you open a pull request.

---

## Getting started

```bash
git clone https://github.com/mbparvezme/theui-svelte.git
cd theui-svelte
npm install
npm run dev
```

`npm run dev` serves `src/routes`, a small harness that renders a slice of the library. It is
not published and it is not the documentation site. Its job is to make a broken change obvious
straight away.

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run check` | `svelte-check`. Run it after any change that touches types |
| `npm run lint` | `prettier --check` plus `eslint` |
| `npm run format` | `prettier --write` |
| `npm run test:unit` | Vitest |
| `npm run test` | Vitest plus Playwright |
| `npm run prepack` | `svelte-package` plus `publint`. Regenerates `dist/` |

`dist/` is gitignored, so a fresh clone has none until you build. It also falls out of step the
moment you edit a component, so run `npm run prepack` before relying on anything in it.

Inside the repo, import through the `$lib` alias rather than the package name:

```svelte
import { Button } from "$lib";
import Button from "$lib/Button/Button.svelte";
```

Components import each other through the barrel (`import { X } from "$lib"`), and several rely
on it: `Table` renders `THead` and `TBody`, `Alert` renders `Close` and `Svg`, `Dropdown`
renders `Button`.

---

## Conventions

### Svelte 5 runes only

The library is runes mode throughout. Please do not introduce Svelte 4 idioms.

- Props: `let { children, size = "md", ...props }: Props = $props()`
- Two-way props: `let { open = $bindable(false) } = $props()`
- State with `$state`, derived values with `$derived`, side effects with `$effect`
- Content through `Snippet` props and `{@render children?.()}`
- Events are plain props: `onclick={...}`, not `on:click`

No `<slot>`, no `export let`, no `createEventDispatcher`, no stores.

Shared state across components lives in `src/lib/state.svelte.ts` as module level `$state`
objects (`ST_ACTIVE_ACCORDIONS`, `ST_MOBILE_NAV`, `ST_NOTIFICATIONS`, `ST_OPEN_MODALS`). Note
the `{ value: ... }` wrapper: module level `$state` has to be exported as an object property,
not as a bare binding.

### The prop contract

Nearly every component has the same shape. Match it when you add one:

```ts
interface Props {
  children?: Snippet,
  // typed, documented props
  [key: string]: unknown   // rest props, spread onto the root element
}
```

- Spread `...props` onto the root DOM element, so any HTML attribute, `data-*` or event handler
  passes through. If you read a key off `props` for the component's own use, declare it as a
  real prop instead, or it lands on the element as a stray attribute.
- Merge `class` with `twMerge` from `tailwind-merge`, never by string concatenation. That is
  what lets a consumer's `class="bg-blue-500"` beat the built in background.
- Generate ids with `generateToken()` from `src/lib/function.ts` unless the consumer passes one.

### Use the styling helpers

`src/lib/function.ts` exports the shared class generators. Use them rather than writing literal
Tailwind, so a change to the scale lands everywhere at once:

| Helper | Purpose |
|---|---|
| `roundedClass(value, side?, type?)` | Corner radius, including the `first:`, `last:`, `after:`, `before:`, `file:` and `edge-child:` variants |
| `animationClass(speed, property?, elType?)` | Transition duration and property |
| `shadowClass(size)` | Box shadow |
| `backdropClasses(backdrop, zIndex?)` | Overlay scrim |
| `sanitize(html)` | DOMPurify wrapper. Required before any `{@html}` |
| `generateToken(prefix?)` | Unique id |

Form specific generators are in `src/lib/Form/form.ts` (`inputClasses`, `labelClasses`,
`inputContainerClass`, `groupInputContainerClass`). Button and QAB themes are in
`src/lib/Button/button.ts`.

### Semantic colors, not raw palette values

`src/lib/style.css` defines the design system in a Tailwind v4 `@theme` block. Build with these
tokens so theming and dark mode keep working:

- **Brand:** `brand-50` to `brand-950`, plus `text-on-brand` for the foreground on a brand background
- **Status:** `error-*`, `info-*`, `success-*`, `warning-*`
- **Surfaces:** `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-alt`
- **Text:** `text-default`, `text-muted`, `text-alt`
- **Layout:** `--max-width` (1280px), plus the extra `nn` (20rem) and `xs` (30rem) breakpoints

Rebranding is done by overriding `--color-brand-*` and `--text-color-on-brand`, never by
editing a component's internals.

### Dark mode

Class based, through a custom variant in `style.css`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`<DarkMode />` toggles `.dark` on `<html>` and stores the choice in
`localStorage["theui-theme"]`, falling back to `prefers-color-scheme` when `systemDefault` is
true, which is the default.

**Every color needs a `dark:` counterpart.** The library pairs them throughout
(`bg-gray-100 dark:bg-gray-800`).

### Accessibility and RTL

Components ship their ARIA wiring: roles, `aria-expanded`, `aria-controls`, `aria-labelledby`,
the focus trap in `Modal`, roving keyboard navigation in `Tabs` and `Pagination`. Please keep it
intact when you change one.

Right to left is supported through logical properties: `start` and `end`, `ms-*` and `me-*`,
`ps-*` and `pe-*`, `text-start` and `text-end`. Do not use `left`, `right`, `ml-*`, `mr-*` or
`text-left`.

### The z-index ladder

| Component | Class | Value |
|---|---|---|
| Navbar | `.z-100` | 100 |
| Dropdown | `.z-200` | 200 |
| Drawer | `.z-300` | 300 |
| Modal | `.z-400` | 400 |
| Popup | `.z-500` | 500 |
| Tooltip | `.z-600` | 600 |
| Notifications | `.z-700` | 700 |

Changing any of these breaks stacking across the whole library.

---

## Composition rules

### Children that need a parent

These read context without a guard, so they throw at runtime if rendered on their own:

| Child | Required ancestor |
|---|---|
| `Tab`, `TabPanel` | `Tabs` |
| `Slide` | `Slider` |
| `DropdownItem` | `Dropdown` |
| `NavBrand`, `NavCollapse`, `NavLinkGroup`, `NavLink`, `NavDropdown` | `Navbar` |

`ListItem` needs `ListGroup` in practice. It optional chains the context so it will not throw,
but it renders unstyled and outside a `<ul>`.

`AccordionItem`, `Button`, `QabItem`, `TR` / `TH` / `TD` and every form control fall back to
their own defaults when used without their usual parent.

### Combinations that do not work

- **`DropdownItem` inside `NavDropdown`.** They are two separate dropdown systems.
  `NavDropdown` publishes the navbar context, not the dropdown one, so `DropdownItem` throws.
  Use `NavLink` inside `NavDropdown`, and `DropdownItem` inside `Dropdown`.
- **`Tab` or `TabPanel` in the wrong place.** `Tab`s go in the `tabs` snippet, `TabPanel`s in
  the children. Swapping them gives you a tab strip with no panels.
- **`Slide` that is not a direct child of `Slider`.** Wrapping slides in an intermediate element
  breaks the DOM logic.
- **More than one `<Tooltip />` or `<Notification />`.** Both are singletons, so duplicates
  double up the listeners and containers.

### Components that touch the DOM directly

Handle these with extra care:

- `Slider` clones the first and last slides, injects the indicator buttons, and drives the
  transforms on DOM nodes itself.
- `Popover` and `Tooltip` find their triggers with `document` queries rather than bindings, so
  the trigger has to exist at mount time.
- `Accordion` closes sibling panels with `document.querySelector("#groupId #itemId")`, so a
  group `id` containing characters that are invalid in a CSS selector breaks exclusive mode.
  Let the ids generate themselves, or pass a plain alphanumeric one.

---

## Known issues

Worth knowing before you spend time on something that is already understood.

- **`Accordion.standalone` reads backwards.** `true`, the default, means exclusive: one panel
  open at a time.
- **`Tabs.variant` defaults to `"pills"`,** not `"tabs"`.
- **`Tab` and `TabPanel` pair by their `value` string, not by order.** A typo in either gives
  you a tab that selects nothing, with no error.
- **`notify()`'s per call `position` has no effect.** It is accepted and stored, but never read
  while rendering. Every toast renders in the single list positioned by
  `<Notification position={...} />`. Set the placement on the component.
- **The shadow and radius scales use Tailwind v3 names under Tailwind v4.** `shadowClass` maps
  `xs` to `shadow-sm` and `sm` to `shadow`; `roundedClass` maps `sm` to `rounded`. Tailwind v4
  renamed this scale, so a value can render one visual step away from what its name suggests.
  The classes are valid and stable, so this wants a coordinated fix rather than per component
  patching.
- **`Tabs` puts `role="tablist"` on the outer wrapper,** which holds both the strip and the
  panels, while the strip itself is `role="presentation"`. Strictly the role belongs on the
  strip. Behaviour and keyboard navigation work; the screen reader semantics are off. Fixing it
  touches the keyboard handler's `#{id} [role="tab"]` query, so please do it deliberately rather
  than in passing.
- **Dark mode flashes on first paint** unless the consumer adds the blocking script to
  `src/app.html`.
- **Floating labels need the label after the input.** The CSS uses Tailwind's `peer` modifier,
  which only styles following siblings, so do not reorder the markup inside `Input` or `Select`.
- **`Table` with `Record` data needs `keys`.** Without it, object rows render no cells at all,
  silently.
- **`Slide` does not deregister on destroy.** Build the slide list up front rather than adding
  or removing slides after mount.
- **`Popover` fails silently on a bad `trigger` id.** Nothing is logged.
- **`Qab` spreads its rest props into the inner `QabItem`** alongside its own `onclick`,
  `onmouseenter` and `onmouseleave`. Your own handlers for those events on `<Qab>` can collide
  with the open and close logic, so attach them to the `QabItem`s instead.
- **`sanitize()` does nothing during server rendering.** DOMPurify needs a DOM, so it returns
  the input unchanged on the server and only sanitizes after hydration. Two call sites still
  render HTML: `Notification` (the `notify()` message) and `Tooltip` (`data-tooltip`). Never
  pass untrusted input to either. Every other string prop renders as plain text.

---

## Adding a component

1. Create `src/lib/<Family>/<Component>.svelte` following the prop contract above.
2. Type the props with an `interface Props` that includes `[key: string]: unknown`. Spread the
   rest onto the root element and merge `class` with `twMerge`.
3. Use the helpers in `function.ts`, `form.ts` and `button.ts` instead of literal Tailwind for
   radius, shadow and animation.
4. Pair every color with a `dark:` variant, and use logical properties so it works right to left.
5. Keep the ARIA wiring and the z-index ladder intact.
6. Register the export in **both** `src/lib/index.ts` and the `exports` map in `package.json`,
   or it will not be reachable for consumers.
7. Add a line to `CHANGELOG.md`.

---

## Before you open a pull request

```bash
npm run check
npx eslint .
npm run test:unit -- --run
npm run prepack
```

Those are exactly the four steps CI runs on every push and pull request, so anything that fails
here fails there.

`npm run lint` additionally runs `prettier --check`, which currently reports a large backlog of
formatting differences across the repo. It is not part of CI yet for that reason. Please run
`npm run format` on the files you touched rather than reformatting the whole tree in a feature
pull request.

If your change alters or adds a prop, the documentation site
([theui.dev](https://theui.dev)) needs a matching update. Mention it in the pull request so it
does not get missed.
