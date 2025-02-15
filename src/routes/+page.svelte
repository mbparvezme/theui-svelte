<script>
  import { Tooltip, Button, Container, DarkMode } from "$lib";
</script>

<Tooltip/>

<Container>
  <DarkMode />
  <br>
  <br>
  <br>
  <Button data-tooltip="Hello" data-tooltip-position="top">Top</Button>
  <Button data-tooltip="Hello Tooltip a c v g Hello Tooltip Hello Tooltip" data-tooltip-position="right">Right</Button>
  <Button data-tooltip="Hello Tooltip a c v g Hello Tooltip Hello Tooltip" data-tooltip-position="bottom">Bottom</Button>
  <Button data-tooltip="Hello Tooltip a c v g Hello Tooltip Hello Tooltip" data-tooltip-position="left">Left</Button>
</Container>