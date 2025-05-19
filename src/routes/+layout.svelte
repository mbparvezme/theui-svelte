<script lang="ts">
	import '../app.css';
	import { Tooltip, Notification } from "$lib";

	let { children } = $props();
</script>

<Tooltip />
<Notification />

{@render children()}
