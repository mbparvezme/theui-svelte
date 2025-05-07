<script lang="ts">
  import {Accordion, AccordionItem, Alert, DarkMode, Badge, Breadcrumb, Button, Card, Chips, Collapse, Drawer, ListGroup, ListItem} from "$lib";
  import {Navbar, NavBrand, NavLinkGroup, NavDropdown, NavLink, NavCollapse, Notification, notify} from "$lib";
  import {Modal, Pagination, Popover, Popup, Progress, Tabs, Tab, TabPanel} from "$lib";
  import { Table, THead, TBody, TR, TH, TD } from "$lib";
  import {Slider, Slide, Svg} from "$lib";

	import Dropdown from "$lib/Dropdown/Dropdown.svelte";
	import DropdownItem from "$lib/Dropdown/DropdownItem.svelte";
	import type { BREADCRUMB_DATA } from "$lib/types.js";
	import twShades from "tw-color-shades";
  // console.log("W: ", twShades("#FFC107"))
  // console.log("info: ", twShades("#29B6F6"))
  // console.log("success: ", twShades("#00C853"))
  // console.log("warning: ", twShades("#FFC107"))

  let breadcrumbData: Array<BREADCRUMB_DATA> = [
    { text: "Home", url: "/" },
    { text: "About", url: "/about" },
    { text: "Company" }
  ]

  let data = [
    { url: "/page/1" },
    { url: "/page/2", active: true },  // Current page
    { url: "/page/3" },
    { url: "/page/4" }
  ];

  let headers = ["Heading 1", "Heading 2", "Heading 3", "Heading 4"];
  let tableData = [
    {item1: "Data 11", item2: "Data 12", item3: "Data 13", item4: "Data 14"},
    {item1: "Data 21", item2: "Data 22", item3: "Data 23", item4: "Data 24"},
    {item1: "Data 31", item2: "Data 23", item3: "Data 33", item4: "Data 43"},
  ];
  let keys = ["item1", "item2", "item3", "item4"];

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

<!-- <Popup trigger="onExit">
  Hello! I'm popup!
</Popup> -->

<DarkMode />


<div class="p-16">
  <Button onclick={() => notify("Hello world!")}>Notify</Button>
  <br>
  <Popover trigger="my-popover" title="Popover Title" position="right" gap={24}>
    Popover - am amazing component for the displaying additional content.
  </Popover>
  <br>
  <Button id="my-popover">Test popover</Button>
  <br/>
  <br/>
  <Table {headers} data={tableData} {keys} />
  <br/>
  <br/>
  <Slider>
    <Slide src="https://placehold.co/1600x700/73C7C7/white?text=Slide 1" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/B5828C/white?text=Slide 2" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/889E73/white?text=Slide 3" alt="Image slide demo image" />
  </Slider>
  <br/>
  <br/>
  <Button data-tooltip="I'm tooltip!">Open tooltip</Button>
  <Button data-tooltip="I'm tooltip on click!" data-tooltip-event="click">Tooltip on click</Button>
  <Tabs>
    {#snippet tabs()}
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    {/snippet}
    <TabPanel>TabPanel 1</TabPanel>
    <TabPanel>TabPanel 2</TabPanel>
    <TabPanel>TabPanel 3</TabPanel>
  </Tabs>
  <br/>
  <br/>
  <Pagination {data} />
  <br/>
  <br/>
  <Progress end={55} />
  <br/>
  <br/>
  <Progress start={55} end={55} label="55" />
  <br/>
  <br/>
  <Progress start={75} end={55} label="55" />
  <br/>
  <br/>
  <Progress start={25} end={55} label="55" />
  <br/>
  <br/>
  <Progress start={25} end={155} label="55" />
  <br/>
  <br/>
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