<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  let {children, content, ...props} : {content ?: string|Snippet, [key: string] : unknown} = $props()
</script>

{#if content}
<p {...props} class={twMerge("text-sm text-gray-500 dark:text-gray-600", props?.class as string)}>
  {#if typeof content == "string"}
    {@html content}
  {/if}
  {#if typeof content == "function"}
    {@render content()}
  {/if}
</p>
{/if}