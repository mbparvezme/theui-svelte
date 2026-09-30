<script lang="ts">
  import pkg from "../../package.json"
  import * as lib from "$lib"
  import {
    Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, Button, Card, Checkbox,
    Chips, DarkMode, Divider, Form, Input, Navbar, NavBrand, NavLink, NavLinkGroup, Progress,
    Rating, Select, Skeleton, Spinner, Tab, TabPanel, Table, Tabs, TBody, TD, TH, THead,
    Toggle, TR
  } from "$lib"

  // Read straight off the module, so the list below cannot drift from what index.ts exports
  const exported = Object.keys(lib).sort((a, b) => a.localeCompare(b))

  const img = (t: string) => `https://placehold.co/160x160/e11d48/ffffff/png?text=${t}`

  let rating = $state(4)
  let notifications = $state(true)
  let plan = $state("pro")
  let email = $state("")

  const install = "npm i theui-svelte"
  let installEl: HTMLElement | undefined = $state()
  let copyState: "copied" | "select" | null = $state(null)
  let copyTimer: ReturnType<typeof setTimeout>

  // Highlights the command so Ctrl+C still works when the clipboard itself is off limits
  const selectInstall = () => {
    if (!installEl) return
    const range = document.createRange()
    range.selectNodeContents(installEl)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  const copyInstall = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(install)
      ok = true
    } catch {
      // Denied by permission, or the page is not a secure context. Fall through to the selection.
    }
    if (!ok) selectInstall()
    copyState = ok ? "copied" : "select"
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copyState = null), 2000)
  }

  const panel = "rounded-xl bg-secondary p-6 shadow-sm"
</script>

<svelte:head>
  <title>theui-svelte {pkg.version} - development harness</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Navbar>
  <NavBrand href="/">
    <span class="flex items-baseline gap-2">
      <span class="font-semibold tracking-tight">theui-svelte</span>
      <span class="text-muted font-mono text-xs">v{pkg.version}</span>
    </span>
  </NavBrand>
  <NavLinkGroup>
    <NavLink href="https://theui.dev/docs" text="Documentation" />
    <NavLink href="https://www.npmjs.com/package/theui-svelte" text="npm" />
    <NavLink href="https://github.com/mbparvezme/theui-svelte" text="GitHub" />
    <NavLink href="https://github.com/mbparvezme/theui-svelte/blob/main/CHANGELOG.md" text="Changelog" />
  </NavLinkGroup>
  <DarkMode />
</Navbar>

<div class="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12">

  <header class="flex flex-col items-center gap-6 py-8 text-center">
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-4xl font-semibold tracking-tight">theui-svelte</h1>
      <p class="text-muted max-w-md text-balance">
        A component library for Svelte 5, built on Tailwind CSS.
      </p>
    </div>

    <div class="bg-secondary flex w-full max-w-xs items-center gap-3 rounded-xl py-2 ps-4 pe-2 shadow-sm">
      <span aria-hidden="true" class="text-muted/60 shrink-0 font-mono text-sm select-none">$</span>
      <code bind:this={installEl} class="flex-1 truncate text-start font-mono text-sm">{install}</code>
      <button
        type="button"
        onclick={copyInstall}
        aria-label="Copy the install command"
        class="text-muted hover:text-default hover:bg-tertiary focus-visible:outline-brand-500 shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span class="inline-block min-w-12 text-center">
          {copyState === "copied" ? "Copied" : copyState === "select" ? "Ctrl+C" : "Copy"}
        </span>
      </button>
      <span class="sr-only" role="status">
        {copyState === "copied"
          ? "Install command copied"
          : copyState === "select"
            ? "Install command selected, press Control C to copy"
            : ""}
      </span>
    </div>

    <p class="text-muted max-w-xl text-sm text-balance">
      This page is the local development harness, not the documentation site. It lives in
      <code class="font-mono">src/routes</code>, so it never ships - the package carries
      <code class="font-mono">dist</code> only. It renders a slice of the library, so a change that
      breaks something shows up the moment you run <code class="font-mono">npm run dev</code>.
    </p>

  </header>

  <Divider>Smoke test</Divider>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">Buttons</h2>
    <div class={panel}>
      <div class="flex flex-wrap items-center gap-3">
        <Button>Default</Button>
        <Button color="success">Success</Button>
        <Button color="error">Error</Button>
        <Button outline>Outline</Button>
        <Button theme="soft" color="info">Soft</Button>
        <Button theme="gradient">Gradient</Button>
        <Button class="cursor-wait"><Spinner size="xs" />Saving</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-3">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
        <Button size="xl">xl</Button>
      </div>
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">Feedback</h2>
    <div class="{panel} flex flex-col gap-4">
      <Alert type="success" dismissible>Saved.</Alert>
      <Alert type="warning" variant="borderTop">Check the highlighted fields.</Alert>
      <Alert type="error" theme="soft">Something went wrong.</Alert>
      <div class="flex flex-wrap items-center gap-6">
        <Spinner />
        <Spinner variant="dots" />
        <Spinner variant="ping" />
        <Rating bind:value={rating} ariaLabel="Example rating" />
      </div>
      <Progress end={62} label="62%" />
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">People and labels</h2>
    <div class="{panel} flex flex-col gap-4">
      <AvatarGroup max={4} ariaLabel="Team">
        <Avatar src={img("A")} alt="Ayesha" status="online" />
        <Avatar src={img("B")} alt="Bilal" />
        <Avatar name="Chandra Das" />
        <Avatar name="Dina Roy" />
        <Avatar name="Elias Khan" />
      </AvatarGroup>
      <div class="flex flex-wrap items-center gap-3">
        <Badge>New</Badge>
        <Badge class="bg-success-500 text-white">Stable</Badge>
        <Chips>Svelte</Chips>
        <Chips close>Tailwind</Chips>
        <Chips imgSrc={img("T")} altText="Tag">With image</Chips>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">Form</h2>
    <div class={panel}>
      <Form>
        <Input bind:value={email} name="email" type="email" placeholder="you@example.com">Email</Input>
        <Select
          bind:value={plan}
          name="plan"
          label="Plan"
          options={[
            { text: "Free", value: "free" },
            { text: "Pro", value: "pro" },
            { text: "Team", value: "team" }
          ]}
        />
        <Checkbox name="terms" checked>I accept the terms</Checkbox>
        <Toggle bind:checked={notifications}>Email notifications</Toggle>
        <Button type="submit" class="self-start">Submit</Button>
      </Form>
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">Disclosure</h2>
    <div class="{panel} flex flex-col gap-6">
      <Accordion>
        <AccordionItem title="First item" open>
          Opened on load, so the initial height is exercised too.
        </AccordionItem>
        <AccordionItem title="Second item">
          Closed on load. Opening it runs the height animation.
        </AccordionItem>
      </Accordion>

      <Tabs>
        {#snippet tabs()}
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        {/snippet}
        <TabPanel value="one">Panel one.</TabPanel>
        <TabPanel value="two">Panel two.</TabPanel>
      </Tabs>
    </div>
  </section>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">Table and card</h2>
    <div class="{panel} flex flex-col gap-6">
      <Table ariaLabel="Example table" stripe="even">
        <THead>
          <TR><TH>Component</TH><TH>Category</TH><TH>Since</TH></TR>
        </THead>
        <TBody>
          <TR><TD>Combobox</TD><TD>Form</TD><TD>3.0.0</TD></TR>
          <TR><TD>DatePicker</TD><TD>Form</TD><TD>3.0.0</TD></TR>
          <TR><TD>Rating</TD><TD>Display</TD><TD>3.0.0</TD></TR>
        </TBody>
      </Table>

      <Card title="Card" class="max-w-sm">
        Cards carry a shadow rather than an outline.
      </Card>
    </div>
  </section>

  <Divider>Exports</Divider>

  <section class="flex flex-col gap-3">
    <h2 class="text-xl font-semibold">
      Everything the package exports
      <span class="text-muted font-normal">({exported.length})</span>
    </h2>
    <p class="text-muted">
      Read from the module itself rather than typed out, so this stays correct on its own.
    </p>
    <div class={panel}>
      <ul class="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
        {#each exported as name (name)}
          <li class="truncate font-mono text-sm">{name}</li>
        {/each}
      </ul>
    </div>
  </section>

  <footer class="text-muted border-t border-gray-200 pt-6 text-sm dark:border-gray-800">
    theui-svelte {pkg.version} · <a class="underline" href="https://theui.dev">theui.dev</a>
  </footer>

</div>
