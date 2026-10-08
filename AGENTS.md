# theui-svelte

Notes for AI coding assistants writing applications with **theui-svelte**, a
Svelte 5 component library built on Tailwind CSS v4.

The bundled type definitions already carry every prop name and type, so read them
for the shape of a component. This file covers what they cannot: which component
to reach for, how the compound families fit together, and the handful of
behaviours that are easy to get wrong.

Full documentation lives at <https://www.theui.dev>. Every page is served as
Markdown as well, and <https://www.theui.dev/llms.txt> indexes all of them.

---

## 1. Install

```bash
npm i theui-svelte
```

Add this to the application's `src/app.css`:

```css
@import 'tailwindcss';
@import 'theui-svelte/style';
@source "../node_modules/theui-svelte";
```

**The `@source` line is required.** Without it Tailwind v4 never scans the
library's markup, no component classes reach the stylesheet, and every component
renders unstyled. Nothing warns about this, so check for it first whenever
components appear in the DOM but look plain.

Adjust the relative path if `app.css` is not directly inside `src/`.

---

## 2. Importing

Both forms work and are equivalent at runtime. Prefer the bare import; reach for
a deep import only when a bundle-size measurement justifies it.

```svelte
<script lang="ts">
  // The normal choice
  import { Button, Card, Accordion, AccordionItem, notify } from "theui-svelte";

  // One component per path
  import Button from "theui-svelte/Button.svelte";
  import AccordionItem from "theui-svelte/AccordionItem.svelte";

  // Types and helpers
  import type { ROUNDED, ANIMATE_SPEED, TABLE_DATA } from "theui-svelte/type";
  import { notify, roundedClass, animationClass } from "theui-svelte/function";
</script>
```

**Deep import paths are flat.** They do not mirror the folder layout inside the
package: `AccordionItem` is `theui-svelte/AccordionItem.svelte`, never
`theui-svelte/Accordion/AccordionItem.svelte`. All 70 components have a deep
path.

---

## 3. What every component shares

Nearly every component follows the same contract, so these hold unless a
component's own documentation says otherwise.

- **Rest props land on the root element.** Any HTML attribute, `data-*` or event
  handler passes straight through.
- **`class` is merged with `tailwind-merge`.** A class you pass beats the
  library's own for the same Tailwind property, so `class="bg-blue-500"`
  overrides the built-in background instead of fighting it. No `!important` and
  no `:global` needed.
- **Ids are generated** unless you pass `id`.
- **Events are plain props**: `onclick={...}`, not `on:click`.
- **Content holes are Snippet props**, never slots. See §5.

The library is written with Svelte 5 runes, and code that uses it should be too:
`$props()`, `$state`, `$derived`, `$bindable`, `{@render ...}`. Svelte 4 idioms —
`export let`, `on:click`, `<slot>`, `createEventDispatcher`, stores — do not work
against these components.

Exported helpers, if you are composing your own matching UI: `roundedClass`,
`animationClass`, `shadowClass`, `backdropClasses`, `sanitize` and
`generateToken` from `theui-svelte/function`.

---

## 4. Styling

### Design tokens, not raw palette colours

Build with the semantic tokens so themes and dark mode keep working:

- **Brand**: `brand-50` … `brand-950`, plus `text-on-brand` for foreground on a
  brand background
- **Status**: `error-*`, `info-*`, `success-*`, `warning-*`
- **Surfaces**: `bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-alt`
- **Text**: `text-default`, `text-muted`, `text-alt`
- **Layout**: `--max-width` (1280px), plus the extra breakpoints `nn` (20rem) and
  `xs` (30rem)

Rebrand by overriding `--color-brand-*` in your own CSS, and
`--text-color-on-brand` with it to keep the contrast. Never by reaching into a
component.

### Dark mode

Class based, through a custom variant:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

`<DarkMode />` toggles `.dark` on `<html>` and remembers the choice in
`localStorage["theui-theme"]`, falling back to `prefers-color-scheme` while
`systemDefault` is true, which is the default.

**Pair every colour decision with a `dark:` counterpart.** The components all do;
pages built with them should match.

`DarkMode` applies the class on mount, so a server-rendered page paints the light
theme for one frame first. To avoid that flash, add a blocking script to
`src/app.html` inside `<head>`:

```html
<script>
  try {
    const t = localStorage.getItem('theui-theme')
      ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch {}
</script>
```

### Right to left

RTL works throughout because the components use logical properties. Match them:
`start` / `end`, `ms-*` / `me-*`, `ps-*` / `pe-*`. **Never `left`, `right`,
`ml-*` or `mr-*`.**

### Stacking order

Overlays are layered deliberately. Leave these alone and place your own overlays
around them.

| Component     | Class    | Value |
| ------------- | -------- | ----- |
| Navbar        | `.z-100` | 100   |
| Dropdown      | `.z-200` | 200   |
| Drawer        | `.z-300` | 300   |
| Modal         | `.z-400` | 400   |
| Popup         | `.z-500` | 500   |
| Tooltip       | `.z-600` | 600   |
| Notifications | `.z-700` | 700   |

### Accessibility

Components ship their own ARIA wiring: roles, `aria-expanded`, `aria-controls`,
`aria-labelledby`, a focus trap in `Modal`, roving keyboard navigation in `Tabs`
and `Pagination`. Preserve it — don't override `role` or the `aria-*` attributes
on a component root unless you are replacing the behaviour too.

---

## 5. Snippets, not slots

Every content hole is a Svelte 5 Snippet. The default hole is `children`; named
holes are declared inside the component tag.

```svelte
<Button>
  {#snippet beforeLabel()}<Svg><path d="…" /></Svg>{/snippet}
  Download
  {#snippet afterLabel()}<Badge>3</Badge>{/snippet}
</Button>
```

Named snippets across the library: `tabs` (Tabs) · `trigger` (Collapse) ·
`label`, `header`, `footer` (Modal) · `label` (Drawer, Dropdown, NavDropdown,
Select) · `title` (AccordionItem, Card, Popover) · `topImage`, `bottomImage`
(Card) · `beforeLabel`, `afterLabel` (Button) · `icon` (Qab) · `toggleIcon`
(NavCollapse) · `prevButton`, `nextButton` (Slider) · `arrowIcon` (Dropdown,
NavDropdown) · `helperText` (Input, Select, FileInput) · `startItem`, `endItem`
(DropdownItem) · `entryContent`, `exitContent` (Popup).

Several of these accept **`string | Snippet`** — `title`, `label`, `header`,
`helperText`, `text`, `arrowIcon`. The string form allows inline markup, so never
build one by concatenating untrusted input.

---

## 6. Boolean props

Write them as bare attributes. Svelte passes `true` for a valueless attribute.

```svelte
<Card horizontal>…</Card>
<AccordionItem open flush>…</AccordionItem>
<Pagination flat hidePreviousNext />
```

| Component       | Boolean props                                              |
| --------------- | ---------------------------------------------------------- |
| `Accordion`     | `flush`                                                    |
| `AccordionItem` | `open`, `flush`                                            |
| `Alert`         | `dismissible`, `icon`                                      |
| `Badge`         | `grow`, `fixed`                                            |
| `Card`          | `horizontal`                                               |
| `Drawer`        | `fullscreen`                                               |
| `Pagination`    | `flat`, `hidePreviousNext`, `hidePrevious`, `hideNext`      |
| `Progress`      | `vertical`                                                 |

`Svg` takes `stroke` the same way, switching the icon from `fill-current` to
`stroke-current fill-transparent` for outline icon sets.

---

## 7. Compound families

These are the components with composition rules. Configuration flows from the
wrapper to its children through context, and an explicit prop on a child always
wins.

### Accordion

```svelte
<Accordion size="default" rounded="md">
  <AccordionItem title="Shipping" open>Ships in 2-3 days.</AccordionItem>
  <AccordionItem title="Returns">30-day window.</AccordionItem>
</Accordion>
```

- **`standalone` controls exclusivity and the name reads backwards.**
  `standalone={true}`, the default, means **only one item may be open at a time**;
  opening one closes its siblings. Pass `standalone={false}` to let several stay
  open. It does not mean "this item works on its own".
- `title` takes a string, which allows inline markup, or a Snippet.
- Items inherit `size`, `rounded`, `animationSpeed`, `flush` and the `*Classes`
  props, and may override any of them.
- `AccordionItem` works without an `Accordion`, but every unwrapped item on a
  page shares one implicit group and they never close each other. Wrap them
  unless you want independent panels.

### Button and ButtonGroup

```svelte
<Button color="brand" theme="default" size="md" onclick={save}>Save</Button>

<ButtonGroup variant="bordered" size="sm">
  <Button>Day</Button>
  <Button isActive>Week</Button>
  <Button>Month</Button>
</ButtonGroup>
```

- Renders `<a>` when `href` is set, `<button>` otherwise. `type` is dropped for
  links, and `target` adds a new-tab icon unless `newTabIcon={false}`.
- Visual axes: `theme` (`default` | `soft` | `gradient`) × `color` (`brand` |
  `error` | `info` | `success` | `warning`). `outline` overrides `theme`, and
  `gradientColor` applies only when `theme="gradient"`.
- `loading` shows a spinner plus `loadingText` and blocks pointer events.
  `isActive` renders a pressed state and sets `aria-pressed`.
- `actions` is the escape hatch for Svelte actions, since `use:` cannot be
  applied to a component: `actions={[[tooltip, {text: "Hi"}]]}`.
- `size="auto"` strips the padding when you need a bare, custom-sized button.
- In a group, buttons switch from individual rounding and shadow to first/last
  edge rounding with dividing borders.

### Form

`Form` → optional `Fieldset` → controls. Every control resolves its
configuration as **`Fieldset` over `Form`, and an explicit prop over both**.

```svelte
<Form method="POST" variant="bordered" size="md" enhance={enhance}>
  <Input type="email" name="email" bind:value={email} helperText="Never shared.">
    Email address
  </Input>

  <Select label="Role" bind:value={role} options={[
    { text: "Admin", value: "admin" },
    { text: "Editor", value: "editor" }
  ]} />

  <Fieldset title="Preferences" size="sm">
    <Checkbox bind:checked={newsletter}>Subscribe to newsletter</Checkbox>
    <Toggle bind:checked={darkUi}>Dark interface</Toggle>
  </Fieldset>

  <Button type="submit">Create account</Button>
</Form>
```

Cascading configuration: `variant` (`bordered` | `flat`), `size` (`sm`–`xl`),
`rounded`, `animationSpeed`, `floatingLabel`, `labelClasses`, `reset`.

- **There is no `Textarea` component.** Use `<Input type="textarea" />`.
- Bindings differ per control: `Input`, `Select`, `Combobox`, `DatePicker`,
  `TimePicker`, `Range`, `Stepper`, `OtpInput` → `bind:value`; `Checkbox` →
  `bind:checked`; `Radio` → `bind:group`; `FileInput` and `FileDropzone` →
  `bind:files`; `Toggle` → `bind:checked` when `type="checkbox"` (the default) or
  `bind:group` when `type="radio"`.
- `floatingLabel` defaults to `variant === "flat"`. With floating labels the
  label renders *after* the input, because the CSS relies on Tailwind's `peer`
  modifier, which only styles following siblings. **Do not reorder the markup
  inside `Input` or `Select`.** Pass label content as `children` on `Input` and
  `FileInput`, or through the `label` prop on `Select`.
- `enhance` takes a Svelte `Action<HTMLFormElement>`, so SvelteKit's `enhance`
  can be passed straight in. It defaults to a no-op.
- `helperText` (string or Snippet) wires up `aria-describedby` for you. `Label`
  and `HelperText` are exported for hand-built layouts.
- `reset: true` strips the library's styling and leaves only the hook classes,
  for designs that need entirely custom form chrome.
- `Fieldset`'s `title` renders as an `sr-only` `<legend>`. Add a visible heading
  yourself if the group needs one.

### FormWizard

```svelte
<FormWizard>
  <FormStep title="Account" {validate}>…</FormStep>
  <FormStep title="Payment" description="Card details">…</FormStep>
  <FormStep title="Review" optional>…</FormStep>
</FormWizard>
```

Breaks a long form into numbered steps with validation, progress, and Back and
Next buttons. `FormStep` **throws** outside a `FormWizard`, with a message naming
the problem. Pass `validate` per step to gate moving forward.

### Navbar

Six components over one shared context. Two of them re-publish that context for
their subtree, so **nesting order matters**: `NavCollapse` adds responsive
behaviour, and `NavDropdown` restyles the `NavLink`s inside it as menu rows.

```svelte
<Navbar navBreakpoint="lg" scrollBehavior="shrinkOnScrollDown" height="md">
  <NavBrand href="/">Acme</NavBrand>
  <NavCollapse>
    <NavLinkGroup align="end">
      <NavLink href="/" active>Home</NavLink>
      <NavLink href="/pricing">Pricing</NavLink>
      <NavDropdown label="Products" width="md">
        <NavLink href="/products/a">Product A</NavLink>
        <NavLink href="/products/b">Product B</NavLink>
      </NavDropdown>
    </NavLinkGroup>
  </NavCollapse>
</Navbar>
```

- **`NavCollapse` is effectively required whenever `navBreakpoint` is set.** It
  owns the hamburger toggle and the responsive show/hide. A `NavLinkGroup` placed
  outside one never becomes responsive and lays out differently.
- **`NavDropdown`'s children are `NavLink`s, not `DropdownItem`s.** See §8.
- Mobile open state is keyed by navbar id, so several navbars can coexist.
  `NavLink` closes the mobile menu when clicked.
- `NavLink` renders `<a>` with an `href` and `<span>` without one.
- Any `scrollBehavior` other than `"default"` makes the navbar `position: fixed`.
  Add top padding to the page content yourself.

### Table

Two interchangeable modes, freely mixed. `TH` and `TD` read spacing and borders
from the `Table`.

```svelte
<!-- Data driven -->
<Table {headers} {data} {keys} stripe="even" hover space="default" />

<!-- Composed -->
<Table stripe="odd" hover>
  <THead>
    <TR><TH>Name</TH><TH>Email</TH></TR>
  </THead>
  <TBody>
    {#each users as user (user.id)}
      <TR><TD>{user.name}</TD><TD>{user.email}</TD></TR>
    {/each}
  </TBody>
</Table>

<!-- Mixed: declarative header, manual body -->
<Table {headers}>
  <TBody>
    {#each data as row, i (i)}<TR data={row} {keys} />{/each}
  </TBody>
</Table>
```

- Nesting follows strict HTML table order: `Table` → `THead` / `TBody` → `TR` →
  `TH` / `TD`.
- `headers` takes `string[]` or a `Record`. `data` takes `string[]` for one row
  or `Record<string, unknown>[]` for many.
- **With `Record` rows you must pass `keys`** to fix the column order. Without
  it, object rows render no cells at all, and nothing reports an error.
- `TR` renders `TH`s instead of `TD`s when `tableHeader` is true, which `THead`
  sets for you.
- `Table` always wraps its output in a scrolling container. Don't add your own.

### Tabs

`Tabs` takes two separate content holes: a `tabs` snippet for the buttons, and
`children` for the panels.

```svelte
<Tabs variant="tabs" border={true}>
  {#snippet tabs()}
    <Tab value="overview">Overview</Tab>
    <Tab value="specs">Specs</Tab>
  {/snippet}

  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="specs">Specs content</TabPanel>
</Tabs>
```

- **`Tab` and `TabPanel` pair by matching `value`, not by document order.**
  `value` is required on both, and a `Tab` whose `value` has no matching
  `TabPanel` selects nothing — silently.
- **`variant` defaults to `"pills"`**, not `"tabs"`.
- `border` is overloaded: `true` draws the default underline, `false` removes it,
  and a **string** is treated as Tailwind classes for that rule.
- The first `Tab` selects itself on mount.
- Both register on init and clean up on destroy, so they are safe inside
  `{#each}` and conditional blocks.

### Dropdown

```svelte
<Dropdown label="Account" width="md" align="end" triggerEvent="click">
  <DropdownItem type="header">Signed in as Ada</DropdownItem>
  <DropdownItem href="/profile">Profile</DropdownItem>
  <DropdownItem type="divider" />
  <DropdownItem type="button" onclick={logout}>Log out</DropdownItem>
</Dropdown>
```

- A **string** `label` is wrapped in a `Button` for you; a **Snippet** `label`
  renders bare inside a `role="button"` span. Use the Snippet form for a custom
  trigger.
- `DropdownItem.type` picks the rendering: `link` (needs `href`), `button` (rest
  props including `onclick` land on the `<button>`), `header`, `divider`
  (self-closing, no content).
- `width` takes the presets `sm` | `md` | `lg` | `full` | `auto`, or any Tailwind
  width class as a passthrough string.
- Keyboard: Escape and ArrowUp close, ArrowDown opens, Enter and Space toggle.
  Clicking outside closes.

### ListGroup

```svelte
<ListGroup variant="bordered" size="md" rounded="md">
  <ListItem href="/inbox">Inbox</ListItem>
  <ListItem>Static row</ListItem>
</ListGroup>
```

`ListItem` puts an `<a>` inside the row when `href` is set. `variant="flat"`
drops the outer border and rounding.

### Slider

```svelte
<Slider autoPlay slideDuration={5000} transitionDuration={750}>
  <Slide src="/hero-1.jpg" alt="First" />
  <Slide src="/hero-2.jpg" alt="Second" href="/promo" />
  <Slide><div class="p-12">Arbitrary content</div></Slide>
</Slider>
```

- A `Slide` with `src` renders an `<img>`; otherwise it renders its children.
  `href` overlays a full-slide link.
- **`Slide` must be a direct child of `Slider`.** Wrapping slides in an
  intermediate element breaks the positioning logic.
- Controls, indicators and the progress timer are on by default. Turn them off
  with `controls={false}`, `indicator={false}`, `timer={false}`.
- Build the slide list up front rather than adding or removing slides after
  mount.

### Qab (quick action button)

A **fixed-position** floating action button; `QabItem` renders each option.

```svelte
<Qab align="end" direction="vertical" size="md" triggerEvent="click">
  <QabItem href="/compose"><Svg><path d="…" /></Svg></QabItem>
  <QabItem onclick={share}><Svg><path d="…" /></Svg></QabItem>
</Qab>
```

Because it is offset from the viewport corner, render it **once per page**,
outside any scrolling container. `QabItem` works on its own if you want a single
floating button with no menu.

`Qab` spreads its rest props into the inner trigger alongside its own open/close
handlers, so passing your own `onclick`, `onmouseenter` or `onmouseleave` to
`Qab` can collide with them. Put those on the `QabItem`s instead.

### Avatar

```svelte
<AvatarGroup max={3} size="md">
  <Avatar src="/ada.jpg" alt="Ada" status="online" />
  <Avatar>MP</Avatar>
</AvatarGroup>
```

`Avatar` works alone and inherits `size` and `rounded` from an `AvatarGroup` when
there is one. A group overlaps its avatars and collapses the overflow.

---

## 8. Composition rules

### These throw outside their parent

| Child                                                      | Required ancestor |
| ---------------------------------------------------------- | ----------------- |
| `Tab`, `TabPanel`                                          | `Tabs`            |
| `Slide`                                                    | `Slider`          |
| `DropdownItem`                                             | `Dropdown`        |
| `FormStep`                                                 | `FormWizard`      |
| `NavBrand`, `NavCollapse`, `NavLinkGroup`, `NavLink`, `NavDropdown` | `Navbar` |

### These fall back to their own defaults

`AccordionItem` without `Accordion`, `Avatar` without `AvatarGroup`, `Button`
without `ButtonGroup`, `QabItem` without `Qab`, `TR` / `TH` / `TD` without
`Table`, and every form control without `Form` or `Fieldset`.

`ListItem` is a middle case: it reads its context defensively so it will not
throw, but outside a `ListGroup` it renders unstyled and outside a `<ul>`. Treat
`ListGroup` as required.

### Combinations that do not work

- **`DropdownItem` inside `NavDropdown`.** These are two separate dropdown
  systems. `NavDropdown` publishes the navbar context, not the dropdown one, so
  `DropdownItem` throws. Use `NavLink` inside `NavDropdown`, and `DropdownItem`
  inside `Dropdown`.
- **`Tab` or `TabPanel` in the wrong hole.** `Tab`s belong in the `tabs` snippet
  and `TabPanel`s in `children`. Swapping them gives a tab strip with no panels.
- **`Slide` not a direct child of `Slider`.**
- **More than one `<Tooltip />` or `<Notification />`.** Both are page-level
  singletons; duplicates double up the listeners.

### Components that resolve their target through the document

`Popover` and `Tooltip` find their triggers with document queries rather than
bindings, so the trigger must already exist when they mount.

`Accordion` closes sibling panels by selector, so a group `id` containing
characters that are invalid in a CSS selector breaks exclusive mode. Let the id
generate itself, or pass a plain alphanumeric one.

---

## 9. Behaviours worth knowing

**`Popover.trigger` is a DOM element id, not a Snippet.** It is resolved with
`document.getElementById` on mount, so something else must render the trigger
first. A wrong id means the popover silently never opens.

```svelte
<Button id="help-trigger">Help</Button>
<Popover trigger="help-trigger" title="Need a hand?" position="top">
  Contact support any time.
</Popover>
```

**`Tooltip` is a page-level singleton.** Render `<Tooltip />` once, normally in
`+layout.svelte`. It listens at the document level and drives every tooltip on
the page; individual elements opt in with data attributes.

```svelte
<Tooltip position="top" triggerEvent="hover" />

<button data-tooltip="Save changes" data-tooltip-position="bottom">Save</button>
```

Per-element overrides: `data-tooltip-position`, `data-tooltip-event`,
`data-tooltip-gap`, `data-tooltip-rounded`, `data-tooltip-animation-speed`,
`data-tooltip-style`.

**`Notification` is a singleton too, and `notify()` is imperative.** Render
`<Notification />` once in the layout, then fire from anywhere.

```ts
import { notify } from "theui-svelte";
const id = notify("Profile saved", "success", { removeAfter: 4000, variant: "card" });
```

`notify(msg, type, config)` returns an id and dismisses itself after
`config.removeAfter` ms, or stays until closed when that is `false`. `type` is
`error` | `info` | `success` | `warning`, defaulting to `error`. **It is browser
only**: during server rendering it returns `""` and does nothing, so call it from
an event handler, `$effect` or `onMount`. **Placement is set on the component**,
`<Notification position="top-end" />` — a `position` in a per-call config is not
what positions the toast.

**`Modal` needs `children` to render anything.** `label` renders the trigger, as
a `Button` for a string or bare for a Snippet; omit it and drive the modal purely
with `bind:open`. `staticBackdrop` disables click-outside-to-close. Escape closes
only the topmost modal when several are stacked.

**`Drawer` requires `label`.** `position` is `top` | `end` | `bottom` | `start`,
defaulting to `start`. `fullscreen` covers the viewport and suppresses the
backdrop. It always renders its own close button.

**`Close` requires `onclick`.** It is a real typed prop, not a rest prop.

**`Breadcrumb` requires `data`**, as `{ text, url? }[]`. An entry **without
`url`** is the current page and renders as `<span aria-current="page">`.

**`Pagination` numbers come from the array index**, not from the data. Prev and
next are handled by the `onPreviousClick` and `onNextClick` callbacks rather than
hrefs.

**`Svg` sizes in rem**, default `1`, and `viewBox` defaults to `"0 0 16 16"` for
16px-grid icon sets. Pass `stroke` for outline icons.

```svelte
<Svg size={1.25} viewBox="0 0 24 24" stroke>
  <path stroke-linecap="round" d="M19 9l-7 7-7-7" />
</Svg>
```

**Shadow and radius names follow the Tailwind v3 scale.** `shadowClass` maps
`xs → shadow-sm` and `sm → shadow`, and `roundedClass` maps `sm → rounded`.
Tailwind v4 renamed that scale, so a value can render one visual step from what
its name suggests. The classes are valid and stable — just don't assume
`shadow="sm"` produces a literal `shadow-sm`.

**`sanitize()` needs a DOM**, so during server rendering it returns its input
unchanged. Notification messages and `data-tooltip` content are rendered as HTML,
so never pass untrusted input to either. Every other string prop renders as plain
text.

**`Container`** is a `<section>` constrained to `--max-width` with standard
padding — the usual page-section wrapper.

**`Collapse`** is a bare show/hide with a height animation: `trigger` is the
clickable header, `children` the body, `bind:isOpen` for external control. Use it
instead of `Accordion` when you want a single toggle with no group semantics or
chrome.

---

## 10. Component index

70 components. Each links to its reference, which is also available as Markdown
by adding `.md` to the URL.

**Layout and content** — [Card](https://www.theui.dev/docs/card) ·
[Container](https://www.theui.dev/docs/container) ·
[Divider](https://www.theui.dev/docs/divider) ·
[Collapse](https://www.theui.dev/docs/collapse) ·
[Accordion](https://www.theui.dev/docs/accordion) + AccordionItem ·
[Tabs](https://www.theui.dev/docs/tabs) + Tab, TabPanel ·
[Table](https://www.theui.dev/docs/table) + THead, TBody, TR, TH, TD ·
[ListGroup](https://www.theui.dev/docs/list-group) + ListItem ·
[Slider](https://www.theui.dev/docs/slider) + Slide

**Navigation** — [Navbar](https://www.theui.dev/docs/navbar) + NavBrand,
NavCollapse, NavLinkGroup, NavLink, NavDropdown ·
[Breadcrumb](https://www.theui.dev/docs/breadcrumb) ·
[Pagination](https://www.theui.dev/docs/pagination) ·
[Dropdown](https://www.theui.dev/docs/dropdown) + DropdownItem

**Actions** — [Button](https://www.theui.dev/docs/button) +
[ButtonGroup](https://www.theui.dev/docs/button-group) ·
[Qab](https://www.theui.dev/docs/qab) + QabItem ·
[Close](https://www.theui.dev/docs/close) ·
[DarkMode](https://www.theui.dev/docs/dark-mode)

**Overlays** — [Modal](https://www.theui.dev/docs/modal) ·
[Drawer](https://www.theui.dev/docs/drawer) ·
[Popup](https://www.theui.dev/docs/popup) ·
[Popover](https://www.theui.dev/docs/popover) ·
[Tooltip](https://www.theui.dev/docs/tooltip)

**Feedback** — [Alert](https://www.theui.dev/docs/alert) ·
[Notification](https://www.theui.dev/docs/notification) + `notify()` ·
[Progress](https://www.theui.dev/docs/progress-bar) ·
[Spinner](https://www.theui.dev/docs/spinner) — ring, dots or ping ·
[Skeleton](https://www.theui.dev/docs/skeleton) — text, rectangle and circle
placeholders while content loads

**Data display** — [Avatar](https://www.theui.dev/docs/avatar) + AvatarGroup —
photo, initials or icon, with a status dot and overlapping groups ·
[Badge](https://www.theui.dev/docs/badge) ·
[Chips](https://www.theui.dev/docs/chips) ·
[Rating](https://www.theui.dev/docs/rating) — stars with half steps and a
read-only mode · [Svg](https://www.theui.dev/docs/svg-icon)

**Forms** — [Form](https://www.theui.dev/docs/form) ·
[Fieldset](https://www.theui.dev/docs/fieldset) ·
[Label](https://www.theui.dev/docs/label) ·
[HelperText](https://www.theui.dev/docs/helper-text) ·
[Input](https://www.theui.dev/docs/input) (including `type="textarea"`) ·
[Select](https://www.theui.dev/docs/select) ·
[Checkbox](https://www.theui.dev/docs/checkbox) ·
[Radio](https://www.theui.dev/docs/radio) ·
[Toggle](https://www.theui.dev/docs/toggle) ·
[FileInput](https://www.theui.dev/docs/file-input) ·
[FileDropzone](https://www.theui.dev/docs/file-dropzone) — drop or pick files,
with type and size checks and image previews ·
[Combobox](https://www.theui.dev/docs/combobox) — searchable select with
multi-select chips, option groups and async search ·
[DatePicker](https://www.theui.dev/docs/date-picker) — calendar with limits,
disabled days and any locale ·
[TimePicker](https://www.theui.dev/docs/time-picker) — hour, minute and AM/PM
parts · [Range](https://www.theui.dev/docs/range) — drag to pick a number, with a
value bubble and ticks · [Stepper](https://www.theui.dev/docs/stepper) — number
field with minus and plus, limits and press-and-hold ·
[OtpInput](https://www.theui.dev/docs/otp-input) — one-time code in separate
boxes, with paste and SMS autofill ·
[FormWizard](https://www.theui.dev/docs/form-wizard) + FormStep — numbered steps
with validation and progress

**Guides** — [Installation](https://www.theui.dev/docs/installation) ·
[Colors](https://www.theui.dev/docs/colors) ·
[Global defaults](https://www.theui.dev/docs/global-defaults) ·
[Types](https://www.theui.dev/docs/types) ·
[Accessibility](https://www.theui.dev/docs/accessibility) ·
[RTL](https://www.theui.dev/docs/rtl) ·
[Z-index](https://www.theui.dev/docs/z-index)
