# Announcement posts

Two short posts for sharing theui-svelte. Copy whichever one you need.

---

## Svelte Society post

**theui-svelte — 70 components for Svelte 5 and Tailwind CSS v4**

I built theui-svelte because I wanted a component library made for Svelte 5 itself,
not one ported over from Svelte 4. It uses runes and snippets all the way through.

There are 70 components: forms, overlays, navigation, tables, sliders, and the usual
feedback and data display pieces. A few things I cared about while building them:

- ARIA roles, keyboard support and focus handling are inside the components already.
- Any `class` you pass is merged with tailwind-merge, so your class wins. No `!important`.
- RTL works from the same stylesheet, because everything uses logical properties.
- Brand colors and dark mode read from your own CSS variables.
- Everything is typed.

Setup is two lines. Install it, then add this to your `app.css`:

```css
@import 'tailwindcss';
@import 'theui-svelte/style';
```

One more thing: the package ships rules for AI coding assistants. Agents tend to guess
prop names and get compound components wrong, so there is an `AGENTS.md` in the package
that explains how the pieces fit together. Run this once in your project:

```bash
npx theui ai
```

It adds a short pointer to that file in whatever instruction file your tool already reads
(`CLAUDE.md`, `AGENTS.md`, Copilot instructions, and so on). It is a pointer, not a copy,
so it cannot overwrite your own rules and it stays current when you upgrade the library.
Use `--dry` to see the changes first.

Docs: https://www.theui.dev
Code: https://github.com/mbparvezme/theui-svelte (MIT)

v3.1.0 is on npm. I would love to hear what breaks, and whether the agent rules actually
help in your projects.

---

## Discord post (announcement)

📢 **theui-svelte v3.1.0 is out, now with full support for AI coding assistants.**

theui-svelte is a UI library for Svelte 5 and Tailwind CSS v4. It has 70 components,
with ARIA roles, keyboard support and focus handling already built in. RTL works from
the same stylesheet, dark mode and brand colors come from your own CSS variables, and
any class you pass is merged with tailwind-merge, so your styles win.

**What is new in this release:** the package now ships its own rules for AI assistants.
Run `npx theui ai` once in your project and Claude Code, Cursor, Copilot, Codex,
Windsurf and others will read the library's `AGENTS.md` before they write a component.
No more guessed prop names or broken compound components. It only adds a pointer, so
your own rules stay as they are.

Setup is still two lines in `app.css`:

```css
@import 'tailwindcss';
@import 'theui-svelte/style';
```

Docs: <https://www.theui.dev>
Code: <https://github.com/mbparvezme/theui-svelte> (MIT)

Try it out and tell me what breaks 🙏
