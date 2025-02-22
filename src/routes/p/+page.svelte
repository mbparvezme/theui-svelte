<script>
  import {Popover} from "$lib"
</script>

<Popover trigger="testPopover">
  {#snippet title()}
    Hello
  {/snippet}
  Hello! Set the position of the popover component relative to the trigger element by using the placement=top|right|bottom|left data attribute and its values.
</Popover>

<div class="text-center py-60">
  <p><button id="testPopover">Test popover</button></p>
</div>

<div class="h-screen"></div>