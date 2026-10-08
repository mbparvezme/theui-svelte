# Changelog

<br>

<mark style="display:block;padding:2px 8px 3px;text-align:center;border-radius:16px;font-weight:500">ALL VERSIONS PRIOR TO V2 ARE DEPRECATED AND SHOULD NOT BE USED</mark>

<br>

> Only important changes are listed here.

- **Version 3.1.0**
  - **The stylesheet no longer imports Tailwind itself.** `theui-svelte/style` carries only its own `@plugin`, `@source`, `@theme`, `@custom-variant` and base rules, and relies on the `@import 'tailwindcss';` above it - the line the setup has always started with, and the one `npx sv add tailwindcss` writes for you. Importing Tailwind from inside the package compiled it a second time for every project that followed those instructions, and under an isolated install such as pnpm the two imports could resolve to different copies of Tailwind. A project whose `src/app.css` has both lines is unaffected and its stylesheet comes out the same. A project that kept only the `theui-svelte/style` line, which no version has documented, now fails to build instead of rendering unstyled.
  - **Setup is two lines instead of three.** `theui-svelte/style` now registers its own markup for Tailwind to scan, so `@source "../node_modules/theui-svelte";` is no longer needed in your `src/app.css` - delete it, or leave it and it does nothing. Tailwind skips `node_modules` when it looks for class names, which is why that line existed; a `@source` glob resolves against the stylesheet that declares it, so the library can now point at itself. This removes the setup step that silently rendered every component unstyled when it was missed, and it scans only `dist/`, so the handful of stray classes the old path picked up out of the package's own README no longer reach your stylesheet.
  - The package ships an `AGENTS.md` at its root, so an AI coding assistant gets the rules the type definitions cannot express: the install steps, the shared prop contract, how the compound families fit together, which children need a parent, and the behaviours that are easy to get wrong.
  - New command: **`npx theui ai`**. Agents read their rules from a project root rather than from inside `node_modules`, so this writes a short block into whichever instruction files a project already has - `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules/`, `.windsurf/rules/`, `GEMINI.md` - each naming the path to the shipped rules, then prints back which files it touched. It points rather than copies, so it cannot overwrite rules a project already wrote, and upgrading the library upgrades what the agent reads. The block sits between HTML comment markers, so re-running replaces it in place and deleting it removes every trace. `--dry` shows the changes without writing them; `--copy` puts the rules in `.theui-svelte/` for a project that would rather commit them. Writing the pointer line by hand still works and needs nothing else - Claude Code is the only tool that needs it spelled out, as `@node_modules/theui-svelte/AGENTS.md` in its `CLAUDE.md`, because it falls back to `AGENTS.md` only when no `CLAUDE.md` exists above the file. The package installs the command under two names, `theui` and `theui-svelte`, so `npx theui-svelte ai` is the same tool if the shorter one collides with something your project already has.
  - The documentation is published as Markdown as well, for tools that read a URL rather than a file. Every page has a `.md` twin, and [www.theui.dev/svelte/llms.txt](https://www.theui.dev/svelte/llms.txt) indexes all of them.

- **Version 3.0.0**
  - **Breaking:** needs Svelte 5.57.1 or newer and Node.js 22.12 or newer.
  - **Breaking:** the brand colors were renamed. `brand-primary-50` ... `brand-primary-950` are now `brand-50` ... `brand-950`, and `text-on-brand-primary` is now `text-on-brand`. Rename them wherever you wrote them in your own markup, and rename the `--color-brand-primary-*` and `--text-color-on-brand-primary` variables if you overrode them.
  - **Breaking:** the second brand color was removed. The `brand-secondary-*` classes, `text-on-brand-secondary` and their variables are gone. Pick any Tailwind color, or define a color of your own, where you used them.
  - **Breaking:** the raw surface values carry a `theui` prefix now: `--light1`, `--light2`, `--light3`, `--dark1`, `--dark2` and `--dark3` are `--theui-light1` ... `--theui-dark3`. Only an override of those names needs changing; the `bg-primary`, `bg-secondary`, `bg-tertiary` and `text-*` classes they feed are unchanged.
  - **Breaking:** `style.css` no longer loads `@tailwindcss/typography`. If you use its `prose` classes, install it and add `@plugin '@tailwindcss/typography';` to your own CSS. `@tailwindcss/forms` now installs with the library, so you don't need to add it yourself.
  - **Breaking:** string props render as plain text now, not as HTML. This covers `helperText`, the `title` of `Accordion`, `Card` and `Popover`, the `header` of `Modal`, the `label` of `Drawer`, `Dropdown` and `NavDropdown`, the `text` of `DropdownItem` and `NavLink`, and the `previousButton` and `nextButton` of `Pagination`. Markup is only cleaned in the browser, so during server rendering it went out unchecked. For markup, use the matching snippet or write the content inside the component. The `Pagination` defaults are now `"← Prev"` and `"Next →"`.
  - **Breaking:** `Tab` and `TabPanel` now require a `value` prop. A tab opens the panel with the same value.
  - **Breaking:** `Toggle` value handling changed. Use `checked` (bindable) for checkboxes and `group` (bindable) for radios; `value` is now only the input's value.
  - **Breaking:** the `reverse` attribute of `Checkbox`, `Radio` and `Toggle` is now `labelPosition="start" | "end"` (default `"end"`). `Toggle` supports it too.
  - **Breaking:** `Button` and `QabItem` no longer set a default `aria-label`, so screen readers read the visible text. Set `ariaLabel` for icon-only buttons.
  - **Breaking:** `Badge` no longer sets a default `aria-label` of `"Badge"`, which replaced the text and had `<Badge>New</Badge>` read out as "Badge". A badge with text is now read as that text; set `ariaTitle` on a dot badge that shows none.
  - **Breaking:** `position` removed from the `notify()` settings. Notifications are placed with the `position` prop of the `Notification` component.
  - **Breaking:** the `dropdownEvent` prop of `Navbar` is now `dropdownTriggerEvent`. It now reaches every `NavDropdown`, which can override it with its own `triggerEvent`.
  - **Breaking:** `NavBrand` no longer sets a default `aria-label`, so screen readers read the brand itself. Give a logo image an `alt`, or set `ariaLabel` for an SVG logo.
  - **Breaking:** `Slider` was rewritten. `class` and other attributes now go on the outer element instead of the inner slide track, the fixed `aria-label="Image Slider"` is now the `ariaLabel` prop (default `"Slider"`), and the inner class names changed to `theui-slider-*` (`theui-slider-slides`, `theui-slider-control`, `theui-slider-indicator`, `theui-slider-timer`). All existing props keep working.
  - **Breaking:** `class` and other attributes of a `Slide` with `src` now go on the slide instead of the `<img>`.
  - **Breaking:** `Select` no longer shows a default "-- Select --" placeholder. Set the `placeholder` prop to get one.
  - New components: `Avatar` and `AvatarGroup` (image, initials or icon, sizes, status dot, stacked group with a "+N" overflow), `Spinner` (`ring`, `dots` and `ping` variants), `Skeleton` (`rect`, `circle` and `text` variants with a `pulse` or `wave` animation), `Divider` (horizontal or vertical, with an optional label) and `Rating` (half steps, read-only display, keyboard support and form value).
  - New form components: `Combobox` (search, multi-select with chips, option groups, `creatable` entries and async search through `onsearch`), `DatePicker` (a calendar popup or `inline` calendar, `min`, `max` and `disabledDates`, any locale and first day of week) and `TimePicker` (separate hour, minute and AM/PM parts you type into, step with the arrow keys, the wheel or the small buttons, with no dropdown). All three keep the value in a form friendly string. `Combobox` follows the WAI-ARIA combobox pattern, `DatePicker` opens its calendar as a dialog and takes typing with `editable`, and `TimePicker` is a group of spin buttons you type into directly.
  - New form components: `Range` (value bubble, inline value and ticks), `OtpInput` (paste, backspace and arrow key support, optional masking), `Stepper` (a number input with − and + buttons that repeat while held), `FileDropzone` (drag and drop, `accept`, `maxSize` and `maxFiles` checks, image previews and a removable file list), and `FormWizard` with `FormStep` (numbered steps, per-step validation and Back/Next buttons). All of them take their `size`, `variant`, `rounded` and `labelClasses` from the `Form` or `Fieldset` around them.
  - `Button`: added `loading`, `loadingText`, `isActive` and `actions` props. A disabled link button is no longer clickable.
  - `Form`: added the `enhance` prop for a Svelte action, like SvelteKit's `enhance`.
  - `Form` and `Fieldset` settings (`variant`, `size`, `floatingLabel`, `rounded`, ...) reach their inputs again, and keep working when the props change.
  - Floating labels fixed: `floatingLabel` and `variant="flat"` now work when set on an `Input`, `Select` or `Fieldset` itself. Labels of `Checkbox`, `Radio`, `Toggle` and `FileInput` no longer float.
  - `Tabs`: arrow key, Home and End navigation; `role="tablist"` moved to the tab list.
  - `Qab`: fixed hover mode and a `class` on `Qab`; added `aria-expanded`, `aria-controls` and Escape to close.
  - `Popover` and `Tooltip`: reworked click handling, so `closeOnClick` and toggling work. Tooltip content is sanitized and linked with `aria-describedby`.
  - `Modal` and `Drawer`: `ariaLabel` works, and the Drawer `label` is optional.
  - `Accordion`: an item closed again before it finished opening no longer springs back open.
  - `Table`: a `TH` now sets `scope="col"` by default, so hand written tables read correctly; pass `scope="row"` for a header that names its row. A table too wide for its container is now a named region with a tab stop, so it can be scrolled from the keyboard, and the new `ariaLabel` prop names both the table and that region.
  - `Close`: the default label is now `"Close"` instead of `"Close button"`, which screen readers read out as "Close button, button".
  - `Collapse`: opening and closing from outside with `bind:isOpen` works after the first close.
  - `Close`: `onclick` is optional and other attributes are passed to the button.
  - `Dropdown`: keys pressed on a menu item are no longer swallowed, so `Enter` follows a link and `Space` presses a button. The trigger no longer overrides its own text with an `aria-label`, and menu roles moved to the item itself (`menuitem` on the link or button, `separator` on a divider). A `DropdownItem` link keeps the attributes you pass, such as `target` and `rel`. A custom trigger is named by its own content; use the new `ariaLabel` prop for an icon-only trigger.
  - `Navbar`: the mobile menu toggle works again. Dropdowns open inside the mobile menu, links in a dropdown work with the keyboard, and a tapped dropdown no longer closes by itself on touch screens. Changes to `Navbar` props after load now reach its links and dropdowns, a `NavLink` keeps your own `onclick`, and `navBreakpoint={false}` keeps the links expanded. Accessibility: `NavLinkGroup` is no longer an extra navigation landmark, the toggle and dropdown buttons have `aria-controls`, and `NavDropdown` no longer uses the menu role. A `NavLink` with `onclick` and no `href` is a button, a page loaded already scrolled gets the right shrink or hide state, a custom `height` no longer resizes dropdown menus, and the mobile menu hover styles in `style.css` apply again.
  - `Dropdown`: clicking the backdrop closes the menu, hover mode works on touch screens, and `Escape` inside the menu moves focus back to the trigger. Clicking a header, a divider or empty space inside the menu no longer closes it.
  - `Slider`: new effects `fade`, `zoom`, `flip` and `cube`, plus `kenBurns` and image and layer `parallax` (`data-parallax`, `data-parallax-opacity`, `data-parallax-scale`). New layout options: `direction="vertical"`, `perView`, `gap` and `peek` (each can be set per screen size), and `centered`. New navigation: swipe and mouse drag (`swipe`), `mousewheel`, arrow keys with Home and End, `thumbnails` (with the `thumbnail` prop on `Slide`) and a `fraction` counter. `loop`, a pause button (`pauseButton`), bindable `activeSlide` and `paused`, `onchange`, and an `overlay` snippet for hero and background sliders.
  - `Slider` fixes: timers stop when the slider is removed, prop changes apply after load, resizing the window keeps the right slide in view, slides added or removed later work, the timer restarts on every move, and `transitionDuration={0}` no longer freezes it. Right-to-left pages are supported and a button inside a form no longer submits it. Accessibility: follows the carousel pattern ("slide 2 of 5"), only the slides in view can be reached with Tab, auto play stops while keyboard focus is inside and for users who prefer reduced motion, and the looping copies of slides are gone. Auto play also pauses while the slider is scrolled out of view, and a slider without the timer bar no longer updates on every frame.
  - **Breaking:** nine exported types that no component used were removed: `POSITION_TYPES`, `ENTRANCE_ANIMATION`, `DROPDOWN_ITEM`, `DROPDOWN_ITEM_CONFIG`, `SITE`, `SITE_IDENTITY`, `SITE_SEO`, `SITE_SOCIAL` and `Tools`. They were placeholders for work that never shipped. Copy the ones you imported into your own project.
  - `Toggle`: supports `reset` (its own or inherited from `Form`/`Fieldset`), and sets `aria-disabled` and `aria-required`.
  - `Select`: a `label` snippet is no longer hidden when the floating label is on, and `placeholder` is not passed to the `<select>` element.
  - `FileInput`: `files` is bindable and `labelClasses` is inherited from `Form`/`Fieldset`. The input no longer has a default `name="file"`, so set `name` yourself.
  - `Radio` and `Toggle`: an unselected radio without a bound `group` is no longer announced as selected.
  - `Card`: removed the unused `aria-labelledby`.
  - `Notification`: `animationSpeed={false}` really turns the animation off.
  - `notify()` does nothing during server rendering, so a message can no longer reach another visitor. Call it in the browser, from an event handler, `$effect` or `onMount`.
  - Components no longer crash on pages opened over plain `http://`, such as a dev server visited from a phone on the LAN, where `crypto.randomUUID()` is missing.
  - `Pagination`: the button group is labeled "Pagination".
  - Attributes you pass now reach the element in `Accordion`, `AccordionItem`, `Alert`, `Badge`, `Breadcrumb`, `Card`, `Drawer`, `ListGroup`, `Pagination`, `Popover` and `Tooltip`. Each of them took `id`, `title`, `data-*`, event handlers and the rest and then dropped them, honouring only `class`; `AccordionItem` dropped `class` as well. `Drawer`, `Popover` and `Tooltip` still name their own element, so the trigger's `aria-controls` keeps pointing at it.
  - The props each of those components reads for itself are declared props now, so they are typed and no longer land on the element as stray attributes: `grow` and `fixed` on `Badge`, `flush` on `Accordion`, `open` and `flush` on `AccordionItem`, `dismissible` and `icon` on `Alert`, `horizontal` on `Card`, `fullscreen` on `Drawer`, `flat`, `hidePrevious`, `hideNext` and `hidePreviousNext` on `Pagination`, and `vertical` on `Progress`, which was the one already reaching the DOM as `vertical="true"`. You still write them without a value, as in `<Card horizontal>`.
  - New: `setTheuiDefaults()` sets the `rounded`, `animationSpeed`, `shadow` and `reset` used by every component, so a square cornered or an unanimated site is one call instead of a prop on each component. Call it once at module scope. The argument is the `CORE` type, and every key is optional; leaving one out keeps the built-in default. `animationSpeed`, `shadow` and `reset` are fallbacks, so a prop on the component, or a `Form` or `Fieldset` around it, still wins over them. `rounded` is an off switch instead: `setTheuiDefaults({ rounded: false })` squares off every component whatever its `rounded` prop says, and only a class of your own can round a corner after that. `true`, or leaving it out, keeps every `rounded` prop working as usual.
  - Right-to-left fixes: a `Drawer` at `start` or `end` opens instead of staying off screen, a table heading follows the text direction the way the body does, the `Select` arrow moves to the end of the line rather than sitting on top of the text, and an icon inside a `Button`, such as the `Dropdown` chevron, is centred with the label.
  - `FileDropzone`: `size` now changes the height of the drop area and the text inside it, and `reset` removes the dashed border and the hover and drag highlight, keeping only your own classes.
  - `Range`: `reset` now hands the slider back to the browser instead of only clearing the wrapper.
  - `Slider`: a thumbnail added after a slide registers now shows up.

- **Version 2.0.5**
  - QAB modified

- **Version 2.0.0rc33**
  - Tooltip completed.

- **Version 2.0.0rc32**
  - Tabs, Tab, TabPanel fixes.

- **Version 2.0.0rc29**
  - Table "Cell" removed, "TD" & "TR" added.

- **Version 2.0.0rc18**
  - Gradient added to notification theme.

- **Version 2.0.0rc17**
  - QABButton component renamed as QABItem.

- **Version 2.0.0rc10**
  - Some unnecessary props removed.

- **Version 2.0.0rc10**
  - Card, Drawer, ListGroup,Tab, Dropdown and Modal issues fix.
  - Image overlay added to Card.
  - "closeOnEsc" prop removed from Drawer.
  - Added fullscreen features to Drawer.
  - ListGroup size features added.
  - Dropdown "url" prop is now "href".
  - Dropdown prop "size" is now "width".
  - Style class props name should change from "link" to "item". For example, "linkClasses" is now "itemClasses".
  - Modal snippet trigger is now label.
  - "modalStatus" prop changed to "open".
  - "closeBtn" prop rename to "closeButton".
  - Button snippet "label" removed.
  - "gradientColors" prop removed.
  - "externalLinkIcon" prop removed.
  - buttonGroup variant changed to "flat".

- **Version 2.0.0rc9**: Close button fix, Dark-mode rewritten to make it behave like system first by default!

- **Version 2.0.0rc5**: Styles moved to `preset.cjs`. The `style.css` file removed!

- **Version 2.0.0**: Features an upgrade to Svelte 5 and a complete component rewrite.

- **Later beta versions (v0.28.0 - v1.0.0-beta.32)**: added new components and prepared for the v1 beta release with a full component refresh.

- **Mid-development (v0.14.11 - v0.28.0)**: saw major Navbar improvements and restructuring.

- **Early versions (v0.9.44 - v0.14.11)**: Focused on core component creation and bug fixes.
