<script lang="ts">
  import {Accordion, AccordionItem, Drawer, DarkMode, Slider, Slide, Button} from "$lib";

  import { Breadcrumb, ButtonGroup } from "$lib";

  let breadcrumbData= [
    { text: "Home", url: "/" },
    { text: "About", url: "/about" },
    { text: "Company" }
  ]

let toggle: boolean = $state(false)
</script>

<DarkMode />

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