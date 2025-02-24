<script>
  import { Tooltip, Popover, Button } from "$lib";
</script>

<Tooltip />

<br>
<br>
<br>
<Popover trigger="testPop">
  Hello
</Popover>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button id="testPop">Popover</Button>
<br>
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button data-tooltip="Hello" data-tooltip-gap="23">Open tooltip 1</Button>
<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button data-tooltip="Hello" data-tooltip-event="click">Open tooltip 2</Button>