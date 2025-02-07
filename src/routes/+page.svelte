<script lang="ts">
  import {  Table, THead, TBody, TR, TH, TD } from "$lib";

  let headers = ['product', 'category', 'price']
  let keys = ['items', 'category', 'price']

  let data = [
    { items : 'iPhone 11', category : 'Smart phone', price: '$1234' },
    { items : 'Asus K401UQ', category : 'Laptop', price: '$1234' },
    { items : 'Microsoft Surface Pro', category : 'Laptop', price: '$2000' },
    { items : 'iPhone 11', category : 'Smart phone', price: '$1234' },
  ]
</script>


{'TD/TH, TD to check inside TBody'}
<Table keys={keys} stripe hover>
  <THead>
    <TR tableHeader>
      <TH>product</TH>
      <TH>category</TH>
      <TH>Price</TH>
    </TR>
  </THead>
  <TBody>
    {#each data as d}
      <TR>
        {#each keys as k}
          <TD>{(d as Record<string, string>)[k]}</TD>
        {/each}
      </TR>
    {/each}
  </TBody>
</Table>