<script lang="ts">
  import { Container, Pagination, Popover } from "$lib";

  let data: any = [
    {url: "/page/5"},
    {url: "/page/6"},
    {url: "/page/7", active: true},
    {url: "/page/8"},
    {url: "/page/9"},
  ]

  let onPreviousClick = () => {
    alert("Hello")
  }
</script>
  <Pagination {data} {onPreviousClick} />
  <Popover triggerID="trigger-1" position="right" />

  <p>Use this example to trigger a popover component with detailed information and an <b id="trigger-1" data-popover>image</b> when hovering over a portion of highlighted text inspired by Wikipedia and other large news outlets.</p>

  <div data-popover-id="trigger-1" class="popover bg-gray-200 p-2 rounded shadow hidden max-w-64">
    <h4>Header</h4>
    <p>Popover 1 Popover 2 Popover 3 Popover 4  Popover 5 Popover 6</p>
  </div>

  <div class=" h-dvh"></div>