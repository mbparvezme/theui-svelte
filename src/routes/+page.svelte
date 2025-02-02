<script lang="ts">
  import { Container, Pagination, Popover } from "$lib";

  let data: any = [
    {url: "/page/5"},
    {url: "/page/6"},
    {url: "/page/7", active: true},
    {url: "/page/8"},
    {url: "/page/9"},
  ]
</script>
  <Pagination {data} hidePreviousNext />
  <Popover triggerID="trigger-1" position="right" />

  <button id="trigger-1" class="px-4 py-2 bg-blue-500 text-white rounded" data-popover>Trigger 1</button>
  <button id="trigger-2" class="px-4 py-2 bg-blue-500 text-white rounded" data-popover>Trigger 1</button>

  <div data-popover-id="trigger-1" class="popover bg-gray-200 p-2 rounded shadow hidden max-w-64">
    <h4>Header</h4>
    <p>Popover 1 Popover 2 Popover 3 Popover 4  Popover 5 Popover 6</p>
  </div>