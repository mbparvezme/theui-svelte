<script lang="ts">
  import {Slider, Slide, Container, DarkMode} from "$lib";
</script>

<DarkMode />

<Container>
  <Slider controls={false} indicator={false}>
    <Slide src="https://placehold.co/1600x700/73C7C7/white?text=Slide 1" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/B5828C/white?text=Slide 2" alt="Image slide demo image" />
    <Slide src="https://placehold.co/1600x700/889E73/white?text=Slide 3" alt="Image slide demo image" />
    <Slide>This</Slide>
  </Slider>
</Container>