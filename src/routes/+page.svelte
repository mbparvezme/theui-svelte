<script lang="ts">
  import { Container, Qab, QabButton, Button } from "$lib";
  import ButtonGroup from "$lib/Button/ButtonGroup.svelte";
</script>

<Container class="last:rounded-e-md">

  <div class="flex gap-8 w-full">
    <div>
      <Button>Button</Button><br>
      <Button color="error">Button</Button><br>
      <Button color="info">Button</Button><br>
      <Button color="success">Button</Button><br>
      <Button color="warning">Button</Button><br><br>
    </div>
  
    <div>
      <Button outline>Button</Button><br>
      <Button outline color="error">Button</Button><br>
      <Button outline color="info">Button</Button><br>
      <Button outline color="success">Button</Button><br>
      <Button outline color="warning">Button</Button><br><br>
    </div>
  
    <div>
      <Button theme="light">Button</Button><br>
      <Button theme="light" color="error">Button</Button><br>
      <Button theme="light" color="info">Button</Button><br>
      <Button theme="light" color="success">Button</Button><br>
      <Button theme="light" color="warning">Button</Button><br><br>
    </div>
  
    <div>
      <Button theme="gradient">Button</Button><br>
      <Button theme="gradient" gradientColor="error">Button</Button><br>
      <Button theme="gradient" gradientColor="info">Button</Button><br>
      <Button theme="gradient" gradientColor="success">Button</Button><br>
      <Button theme="gradient" gradientColor="warning">Button</Button><br><br>
    </div>
  </div>

  <div class="flex flex-col gap-8">
    <div>
      <ButtonGroup>
        <Button>Button</Button>
        <Button color="error">Button</Button>
        <Button color="info">Button</Button>
        <Button color="success">Button</Button>
        <Button color="warning">Button</Button>
      </ButtonGroup>
    </div>
  
    <div>
      <ButtonGroup outline>
        <Button>Button</Button>
        <Button color="error">Button</Button>
        <Button color="info">Button</Button>
        <Button color="success">Button</Button>
        <Button color="warning">Button</Button>
      </ButtonGroup>
    </div>
  
    <ButtonGroup theme="light">
      <Button>Button</Button>
      <Button color="error">Button</Button>
      <Button color="info">Button</Button>
      <Button color="success">Button</Button>
      <Button color="warning">Button</Button>
    </ButtonGroup>
  
    <ButtonGroup theme="gradient">
      <Button>Button</Button>
      <Button gradientColor="error">Button</Button>
      <Button gradientColor="info">Button</Button>
      <Button gradientColor="success">Button</Button>
      <Button gradientColor="warning">Button</Button>
    </ButtonGroup>
  </div>

  <Qab color="info">
    <QabButton url="/"></QabButton>
    <QabButton url="/"></QabButton>
    <QabButton url="/"></QabButton>
  </Qab>
</Container>