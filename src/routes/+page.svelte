<script lang="ts">
  import {Accordion, AccordionItem, Alert, DarkMode, Badge, Breadcrumb, Button, Card, Chips, Collapse} from "$lib";
	import type { BREADCRUMB_DATA } from "$lib/types.js";
	// import twShades from "tw-color-shades";
  // console.log("error: ", twShades("#E53935"))
  // console.log("info: ", twShades("#29B6F6"))
  // console.log("success: ", twShades("#00C853"))
  // console.log("warning: ", twShades("#FFC107"))

  let breadcrumbData: Array<BREADCRUMB_DATA> = [
    { text: "Home", url: "/" },
    { text: "About", url: "/about" },
    { text: "Company" }
  ]
</script>

<DarkMode />

<div class="p-16">
  <Accordion>
    <AccordionItem title="Hello">
      A
    </AccordionItem>
  </Accordion>
  <br/>
  <br/>
  <Chips>Example Chips</Chips>
  <br/>
  <br/>
  <Collapse ariaLabel="COLLAPSE">
    {#snippet trigger()}
      <Button>Flush collapse trigger</Button>
    {/snippet}
    <p>The Collapse component is fully accessible and keyboard-friendly. The toggle element uses role="button" and is focusable with tabindex="0", allowing users to control it using the Enter or Space keys. It includes aria-expanded, aria-controls, and aria-labelledby to communicate state and relationships clearly to assistive technologies. The content area is hidden from screen readers when collapsed using aria-hidden. You can also use the ariaLabel prop to provide a custom accessible label for better context.</p>
  </Collapse>
  <br/>
  <br/>

  <Alert dismissible >I'm error (default) alert!</Alert>
  <Alert dismissible  type="info">I'm info alert!</Alert>
  <Alert dismissible  type="success">I'm success alert!</Alert>
  <Alert dismissible  type="warning">I'm warning alert!</Alert>

  <Badge ariaTitle="Demo badge"/>
  <Badge ariaTitle="Demo badge">New</Badge>

  <p class="relative p-2 bg-secondary">
    Notifications <Badge fixed />
  </p>
  <p class="relative p-2 bg-secondary">
    Notifications <Badge fixed>New</Badge>
  </p>
  <Breadcrumb data={breadcrumbData} />
  <br/>
  <br/>
  <Button>Hello</Button>
  <br/>
  <br/>
  <Card>
    Hello
  </Card>
  <br/>
  <br/>
</div>
<!-- <button onclick={() => toggleTheme()}>Theme</button> -->