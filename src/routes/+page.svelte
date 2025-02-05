<script lang="ts">
  import {Slider, Slide, Container, DarkMode} from "$lib";
</script>

<DarkMode />

<Container>
  <Slider>
    {#snippet children()}
      <Slide src="1.jpg" alt="" />
      <Slide src="2.jpg" alt="" />
      <Slide src="3.jpg" alt="" />
      <Slide>
        <h3>Hello</h3>
      </Slide>
    {/snippet}
  </Slider>
</Container>