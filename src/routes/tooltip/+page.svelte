<script>
  import Tooltip from "$lib/TooltipTest.svelte";
</script>

<Tooltip />

<div class="text-center py-48">
  <p><button data-tooltip="<b>Hello world</b>"  >Top (Default) tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b>"  data-tooltip-position="top-start">Top start tooltip start tooltip start tooltip </button></p>
  <p><button data-tooltip="<b>Hello world</b>"  data-tooltip-position="top-end">Top end tooltip end tooltip end tooltip end tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b>"  data-tooltip-position="bottom">Bottom (Default) tooltip</button></p>
  <p><button data-tooltip="<b>Hello world</b>"  data-tooltip-position="bottom-start">Bottom start tooltip start tooltip start tooltip </button></p>
  <p><button data-tooltip="<b>Hello world</b>"  data-tooltip-position="bottom-end">Bottom end tooltip end tooltip end tooltip end tooltip</button></p>
  <p><button data-tooltip="World"               data-tooltip-position="left">Left tooltip</button></p>
  <p><button data-tooltip="World"               data-tooltip-position="left-start">Left start tooltip</button></p>
  <p><button data-tooltip="World"               data-tooltip-position="left-end">Left end tooltip</button></p>
  <p><button data-tooltip="World"               data-tooltip-position="right">right tooltip</button></p>
  <p><button data-tooltip="World"               data-tooltip-position="right-start">right start tooltip</button></p>
  <p><button data-tooltip="World"               data-tooltip-position="right-end">right end tooltip</button></p>
</div>
