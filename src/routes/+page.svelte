<script lang="ts">
  import {  Tabs, Tab, TabPanel, Container } from "$lib";
</script>

<Container>

  <Tabs tabContainerClasses="flex justify-center" variant="tabs">
    {#snippet tabs()}
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    {/snippet}
    <TabPanel>TabPanel 1</TabPanel>
    <TabPanel>TabPanel 2</TabPanel>
    <TabPanel>TabPanel 3</TabPanel>
  </Tabs>

</Container>