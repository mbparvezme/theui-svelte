<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  let {children, ...props} : {children?: Snippet, [key: string] : unknown} = $props()
</script>

{#if children}
<p {...props} class={twMerge("text-sm font-normal text-gray-600 dark:text-gray-400", props?.class as string)}>
  {@render children()}
</p>
{/if}