<script lang="ts">
  import {Accordion, AccordionItem, Alert, DarkMode, Badge, Breadcrumb, Button, Card, Chips, Collapse, Drawer, ListGroup, ListItem} from "$lib";
  import {Navbar, NavBrand, NavLinkGroup, NavDropdown, NavLink, NavCollapse, Notification, notify} from "$lib";
  import {Modal} from "$lib";

	import Dropdown from "$lib/Dropdown/Dropdown.svelte";
	import DropdownItem from "$lib/Dropdown/DropdownItem.svelte";
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
<Notification />
<Navbar>
  <NavBrand href="#">BRAND</NavBrand>
  <NavCollapse>
    <NavLinkGroup>
      <NavLink href="#" text="Link 1" />
      <NavLink href="#" text="Link 2" />
      <NavLink href="#" text="Link 3" />
      <NavDropdown label="Dropdown">
        <NavLink href="#" text="Dropdown Link 1" />
        <NavLink href="#" text="Dropdown Link 2" />
        <NavLink href="#" text="Dropdown Link 3" />
      </NavDropdown>
    </NavLinkGroup>
  </NavCollapse>
</Navbar>

<DarkMode />

<Button
  onclick={
    () => notify("Hello world!")
  }
>Notify</Button>

<div class="p-16">
  <Drawer label="Trigger Drawer" position="top">Hello</Drawer>
  <Modal label="Modal Button">
    Hello Modal!
  </Modal>
  <br/>
  <br/>
  <Dropdown label="Dropdown Trigger" align="start">
    <DropdownItem>Hello</DropdownItem>
    <DropdownItem>Hello</DropdownItem>
    <DropdownItem>Hello</DropdownItem>
  </Dropdown>
  <br/>
  <br/>
  <Accordion>
    <AccordionItem title="Hello">
      A
    </AccordionItem>
  </Accordion>
  <br/>
  <br/>
  <ListGroup>
    <ListItem>First Item</ListItem>
    <ListItem>Second Item</ListItem>
    <ListItem>Third Item</ListItem>
  </ListGroup>
  <br/>
  <br/>
  <Chips imageUrl="https://randomuser.me/api/portraits/men/0.jpg">Example Chips</Chips>
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