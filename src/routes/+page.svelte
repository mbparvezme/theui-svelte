<script lang="ts">
  import {Accordion, AccordionItem, Drawer, DarkMode, Slider, Slide, Button} from "$lib"
  import { Breadcrumb, ButtonGroup, Modal, Dropdown, DropdownItem } from "$lib"
  import {Navbar, NavBrand, NavLinkGroup, NavDropdown, NavLink} from "$lib";

  let breadcrumbData= [
    { text: "Home", url: "/" },
    { text: "About", url: "/about" },
    { text: "Company" }
  ]

let toggle: boolean = $state(false)
</script>

<DarkMode />


<Navbar>
  <NavBrand href="#">BRAND</NavBrand>
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
</Navbar>

<div class="p-16">
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
  {toggle}
  <Button onclick={()=>{toggle=!toggle}}>Toggle Drawer</Button>
  <Drawer label="testDrawer" position="top" bind:isOpen={toggle}>Open by default!</Drawer>
  <Drawer id="testDrawer" label="hi" position="bottom">Hello Test</Drawer>
  <br>
  <br>
  <br>
  <div class="ps-48">
    <Dropdown label="Dropdown">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>

    <Dropdown label="slide-left" animation="slide-left">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>
    <Dropdown label="slide-up" animation="slide-up">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>
    <Dropdown label="slide-right" animation="slide-right">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>
    <Dropdown label="slide-down" animation="slide-down">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>
    <Dropdown label="fade"  animation="fade">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>
    <Dropdown label="zoom-in" animation="zoom-in">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>
    <Dropdown label="zoom-out" animation="zoom-out">
      <DropdownItem url="/">Link 1</DropdownItem>
      <DropdownItem url="/">Link 2</DropdownItem>
      <DropdownItem url="/">Link 3</DropdownItem>
    </Dropdown>


  </div>
  <br>
  <br>
  <br>
  <Breadcrumb separator="#" data={breadcrumbData} />
  <br/>
  <br/>
  <ButtonGroup>
    <Button>Save</Button>
    <Button>Edit</Button>
    <Button>Delete</Button>
  </ButtonGroup>
  <br/>
  <br/>
  <Slider>
    <Slide src="https://placehold.co/1600x700/73C7C7/white?text=Slide 1" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/B5828C/white?text=Slide 2" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/889E73/white?text=Slide 3" alt="Image slide demo image" />
  </Slider>
  <br/>
  <br/>
  <br/>
  <br/>
  <Button disabled outline>Save</Button>
  <Button disabled>Save</Button>
  <br/>
  <br/>
  <br/>
  <Button onclick={()=>{toggle=!toggle}}>Toggle modal</Button>
  <Modal bind:open={toggle} header="I am title">
    Hello Modal!
  </Modal>
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