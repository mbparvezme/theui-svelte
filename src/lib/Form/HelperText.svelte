<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { generateToken } from "$lib/function"
  let {children, ...props} : {children?: Snippet, [key: string] : unknown} = $props()

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
</script>

{#if children}
<div {id} {...props} class={twMerge("text-sm font-normal text-gray-600 dark:text-gray-400", props?.class as string)}>
  {@render children()}
</div>
{/if}