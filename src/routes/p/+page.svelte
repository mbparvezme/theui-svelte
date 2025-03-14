<script>
  import {Navbar, NavBrand, NavCollapse, NavLinkGroup, NavDropdown, NavLink, DarkMode} from "$lib"
  import {Svg, Tooltip, Toggle, Checkbox, Radio, FileInput, Input} from "$lib"
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

<div class="bg-primary px-80 ">
  <br>
  <br>
  <Toggle name="toggle1" type="checkbox" checked>Checkbox 1</Toggle>
  <br>
  <br>
  <br>
  <Checkbox name="aa" animate="slower" size="lg" rounded="full" value="2" checked>Hello</Checkbox>
  <br>
  <br>
  <br>
  <FileInput name="file" label="A" />
  <br>
  <br>
  <br>
  <Input name="h" label="Hello" />
  <br>
  <br>
  <br>
  <Radio name="Radio" value="1" size="sm" rounded="none" animate="slower">Hello</Radio>
  <Radio name="Radio" value="2" size="lg" rounded="none" animate="fast">Hello</Radio>
  <Radio name="Radio" value="3" size="xl" rounded="sm" animate="none">Hello</Radio>
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