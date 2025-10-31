<script lang="ts">
	import Dropdown from "$lib/Dropdown/Dropdown.svelte";
	import DropdownItem from "$lib/Dropdown/DropdownItem.svelte";
</script>
TheUI Svelte Component Library!

<Dropdown label="Dropdown">
  <DropdownItem url="/" class="bg-gray-500 hover:bg-red-500">Link 1</DropdownItem>
  <DropdownItem url="/">Link 2</DropdownItem>
  <DropdownItem url="/">Link 3</DropdownItem>
</Dropdown>