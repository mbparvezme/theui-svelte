<script lang="ts">
  import {Accordion, AccordionItem, Navbar, NavBrand, NavLinkGroup, NavDropdown, NavLink, DarkMode, Progress} from "$lib";
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
<div class="p-16">
  <AccordionItem title="Hello A">
    A
  </AccordionItem>
  <br>
  <Accordion>
    <AccordionItem title="Hello A">
      A
    </AccordionItem>
    <AccordionItem title="Hello B">
      B
    </AccordionItem>
  </Accordion>
  <br>
  <br>
  <br>
  <br>
  <div class="flex">
    <div class="p-16 flex flex-col gap-16 w-1/2">
      <Progress start={55} end={55} label="55" />
      <Progress start={75} end={55} label="55" />
      <Progress start={25} end={55} label="55" />
      <Progress start={25} end={155} label="55" />
    </div>
    <div class="p-16 flex flex-col gap-16 w-1/2">
      <Progress end={55} label="55" thickness="px" />
      <Progress end={55} label="55" thickness="sm" />
      <Progress end={55} label="55" thickness="md" />
      <Progress end={55} label="55" thickness="lg" />
      <Progress end={55} label="55" thickness="xl" />
    </div>
  </div>
  <br>
  <br>
  <br>
  <br/>
  <br/>
  <br/>
  <br/>
  <div class="p-16 h-80">
    <Progress end={55} label="55" vertical />
  </div>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
  <br/>
</div>