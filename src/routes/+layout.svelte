<script lang="ts">
	import '../app.css';
	import { Tooltip } from "$lib";

	let { children } = $props();
</script>

<Tooltip />

{@render children()}
