<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  let { children, ...props } : {children : Snippet, [key:string] : unknown} = $props()

  const classes = $derived("theui-container " + twMerge("relative w-full max-w-[var(--max-width)] mx-auto px-8 py-24", props?.class as string))
</script>

{#if children}
<section {...props} class={classes}>
  {@render children()}
</section>
{/if}
