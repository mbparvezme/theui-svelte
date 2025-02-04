<script lang="ts">
  import {Progress} from "$lib";
  let start = $state(0)
  let end = $state(40)
</script>

<br><br>
<div class="grid grid-cols-2 gap-4">
  <div>
    <Progress {start} {end} thickness="px" label="90"/><br><br>
    <Progress {start} {end} thickness="sm" label="90"/><br><br>
    <Progress {start} {end} thickness="md" label="90"/><br><br>
    <Progress {start} {end} thickness="lg" label="90"/><br><br>
    <Progress {start} {end} thickness="xl" label="90"/><br><br>
  </div>
  <div class="flex gap-8">
    <Progress {start} {end} vertical thickness="px" label="90"/><br><br>
    <Progress {start} {end} vertical thickness="sm" label="90"/><br><br>
    <Progress {start} {end} vertical thickness="md" label="90"/><br><br>
    <Progress {start} {end} vertical thickness="lg" label="90"/><br><br>
    <Progress {start} {end} vertical thickness="xl" label="90"/><br><br>
  </div>
</div>

<input type="range" bind:value={start} />
<input type="range" bind:value={end} />