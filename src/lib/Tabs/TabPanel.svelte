<script lang="ts">
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import { fade } from "svelte/transition"
	import { generateToken } from "$lib/function"

  let {children, ...props} : {children : Snippet, [key: string] : unknown} = $props()
	const CTX = getContext("TAB") as any
  const id: string = generateToken()
  CTX.TABS.panels.push(id)
</script>

{#if CTX.TABS.selectedPanel === id}
	{#if CTX.animate}
		<div {...props} class="theui-tab-panel {twMerge(CTX.tabPanelClasses, props?.class as string)}" in:fade={{duration:150}}>
      {@render children?.()}
    </div>
	{:else}
		<div {...props} class="theui-tab-panel {twMerge(CTX.tabPanelClasses, props?.class as string)}">
      {@render children?.()}
    </div>
	{/if}
{/if}
