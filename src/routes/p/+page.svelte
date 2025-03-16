<script>
  import {Navbar, NavBrand, NavCollapse, NavLinkGroup, NavDropdown, NavLink, DarkMode, HelperText} from "$lib"
  import {Svg, Tooltip, Input } from "$lib"
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
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
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