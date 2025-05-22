<script lang="ts">
  import {Accordion, AccordionItem, Navbar, NavBrand, NavLinkGroup, NavDropdown, NavLink, DarkMode, Progress, Button, notify} from "$lib";
  import { Dropdown, DropdownItem } from "$lib";
</script>

<DarkMode />

<Navbar>
  <NavBrand href="#">BRAND</NavBrand>
  <NavLinkGroup>
    <NavLink href="#" text="Link 1" />
    <NavLink href="#" text="Link 2" />
    <NavLink href="#" text="Link 3" />
    <NavDropdown label="Dropdown 1" triggerEvent="hover">
      <NavLink href="#" text="Dropdown Link 1" />
      <NavLink href="#" text="Dropdown Link 2" />
      <NavLink href="#" text="Dropdown Link 3" />
    </NavDropdown>
    <NavDropdown label="Dropdown 2" animation="slide">
      <NavLink href="#" text="Dropdown Link 1" />
      <NavLink href="#" text="Dropdown Link 2" />
      <NavLink href="#" text="Dropdown Link 3" />
    </NavDropdown>
  </NavLinkGroup>
</Navbar>

<br>

  <div class="w-full flex justify-center gap-4">
    <Button theme="light" color="brand">Brand</Button>
    <Button theme="light" color="error">Error</Button>
    <Button theme="light" color="info">Info</Button>
    <Button theme="light" color="success">Success</Button>
    <Button theme="light" color="warning">Warning</Button>
    <br>
    <Button theme="gradient" gradientColor="brand">Brand</Button>
    <Button theme="gradient" gradientColor="error">Error</Button>
    <Button theme="gradient" gradientColor="info">Info</Button>
    <Button theme="gradient" gradientColor="success">Success</Button>
    <Button theme="gradient" gradientColor="warning">Warning</Button>
  </div>

  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>