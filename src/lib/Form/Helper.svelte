<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  let {children, ...props} : {children?: Snippet, [key: string] : unknown} = $props()
</script>

{#if children}
<p {...props} class={twMerge("text-sm text-gray-500 dark:text-gray-600", props?.class as string)}>
  {@render children()}
</p>
{/if}