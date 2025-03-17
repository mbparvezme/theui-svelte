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
<div class="flex flex-col gap-2 w-full">
  <Input class="w-full" name="username" type="text" placeholder="Enter your username">Username</Input>
  <Input class="w-full" name="email" type="email" placeholder="Enter your email">Email</Input>
  <Input class="w-full" name="password" type="password" placeholder="Enter your password">Password</Input>
  <Input class="w-full" name="dob" type="date">Date of birth</Input>
</div>
<div class="flex flex-col gap-2 w-full">
  <Input class="w-full" name="phone" type="tel" placeholder="Enter your phone number">Telephone</Input>
  <Input class="w-full" name="url" type="url" placeholder="Enter your profile URL">URL</Input>
  <Input class="w-full" name="dob" type="number">Number</Input>
  <Input class="w-full" name="dob" type="textarea">Number</Input>
</div>
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