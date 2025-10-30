<script lang="ts">
	import Chips from "$lib/Chips/Chips.svelte";

    let check = (text: string) => {
        alert(text)
    }

</script>
TheUI Svelte Component Library!

<Chips onclick={() => check("Hello")}>Hello</Chips>