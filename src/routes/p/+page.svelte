<script lang="ts">
  import {Navbar, NavBrand, NavCollapse, NavLinkGroup, NavDropdown, NavLink, DarkMode, HelperText} from "$lib"
  import {Svg, Tooltip, Select } from "$lib"
	import type { SELECT_DATA } from "$lib/types";

  let selectArray: SELECT_DATA[] = [
    "select 1",
    "select 2",
    "select 3",
    "select 4",
  ]

  let selectObj: SELECT_DATA[] = [
    { text: "Option 1", value: 1 },
    { text: "Option 2", value: 2 },
    { text: "Option 3", value: 3 },
    { text: "Option 4", value: 4 },
    { text: "Option 5", value: 5, selected: true },
    { text: "Option 6", value: 6 },
    { text: "Option 7", value: 7 },
    { text: "Option 8", value: 8 },
    { text: "Option 9", value: 9 },
    { text: "Option 10", value: 10 },
  ];


</script>

<Tooltip />

<Navbar scrollBehavior="shrinkOnScrollDown" scrollClasses="bg-red-100">
  <NavBrand href="/">BRAND</NavBrand>
  <NavCollapse>
    <NavLinkGroup align="end">
      <NavLink href="/" text="About" />
      <NavLink href="/" text="About" />
      <NavLink href="/" text="About" />
      <NavDropdown label="Components" animation="zoom">
        {#snippet arrowIcon()}
          <Svg>
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
          </Svg>
        {/snippet}
        <NavLink href="/" text="About" />
        <NavLink href="/" text="About" />
        <NavLink href="/" text="About" />
        <NavLink href="/" text="About" />
      </NavDropdown>
    </NavLinkGroup>
  </NavCollapse>
  <DarkMode />
</Navbar>

<br>
<br>
<br>

<div class="bg-primary px-60 ">
  <br>
  <br>
  <br>
  <br>
  <Select name="text" options={selectObj} />
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>


</div>
<div class="h-[50vh] bg-secondary"></div>
<div class="h-[50vh] bg-tertiary"></div>
<div class="h-[50vh] bg-primary"></div>

<style lang="postcss">
  :global(body){
    @apply bg-primary;
  }
</style>