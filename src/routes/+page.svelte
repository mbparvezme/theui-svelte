<script lang="ts">
  import {Accordion, AccordionItem, DarkMode } from "$lib";
</script>

<DarkMode />

<br>

<div class="p-28">
  <Accordion>
    <AccordionItem title="Hello 1">
      This is accordion 1..
    </AccordionItem>
    <AccordionItem title="Hello 2" open>
      This is accordion 2..
    </AccordionItem>
  </Accordion>
</div>