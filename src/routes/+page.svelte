<script lang="ts">
  import {Container, Modal } from "$lib"
</script>

<Container>
  <Modal label="Hello">
    Hello
  </Modal>
  <br>
  <br>
  <Modal>
    {#snippet label()}
      Label
    {/snippet}
    Hello
  </Modal>
  <br>
  <br>
  <Modal closeButton={false} size="lg" animation="zoom-out">
    {#snippet label()}
      closeButton
    {/snippet}
    Hello
  </Modal>
  <br>
  <br>
</Container>