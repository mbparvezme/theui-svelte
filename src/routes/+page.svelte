<script>
  import { Navbar, NavCollapse, NavBrand, NavLinkGroup, NavLink, NavDropdown, NavToggle } from "$lib";
</script>

<Navbar>
  <NavBrand href="/">SvelteKit</NavBrand>
  <NavCollapse>
    <NavLinkGroup>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </NavLinkGroup>
    <NavDropdown label="Dropdown">
      <NavLink href="/dropdown1">Dropdown 1</NavLink>
      <NavLink href="/dropdown2">Dropdown 2</NavLink>
    </NavDropdown>
  </NavCollapse>
  <NavToggle />
</Navbar>