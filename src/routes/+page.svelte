<script lang="ts">
  import {Accordion, AccordionItem, Drawer, DarkMode, Slider, Slide} from "$lib";
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
  <br>
  <Drawer label="testDrawer">Hello</Drawer>
  <Drawer id="testDrawer">
    {#snippet label()}
      Hello test
    {/snippet}
  </Drawer>
  <Drawer id="testDrawer">Hello Test</Drawer>
  <br>
  <br>
  <br>
  <Slider>
    <Slide src="https://placehold.co/1600x700/73C7C7/white?text=Slide 1" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/B5828C/white?text=Slide 2" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/889E73/white?text=Slide 3" alt="Image slide demo image" />
  </Slider>
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
  <br/>
  <br/>
  <br/>
</div>