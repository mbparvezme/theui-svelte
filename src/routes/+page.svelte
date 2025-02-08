<script lang="ts">
  import {  Table, THead, TBody, TR, TH, TD, Container } from "$lib";

  let headers = ['product', 'category', 'price']
  let keys = ['items', 'category', 'price']

  let data = [
    { items : 'iPhone 11', category : 'Smart phone', price: '$1234' },
    { items : 'Asus K401UQ', category : 'Laptop', price: '$1234' },
    { items : 'Microsoft Surface Pro', category : 'Laptop', price: '$2000' },
    { items : 'iPhone 11', category : 'Smart phone', price: '$1234' },
  ]
</script>

<Container>

<Table {headers} {data} {keys} hover="hover:bg-red-100" />

</Container>