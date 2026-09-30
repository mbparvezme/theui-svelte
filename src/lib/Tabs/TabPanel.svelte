<script lang="ts">
	import { getContext, onDestroy, type Snippet } from "svelte"
	import { fade } from "svelte/transition"
	import { twMerge } from "tailwind-merge"
	import type { TABS_CONTEXT } from "$lib/types"
	import { generateToken } from "$lib/function"
	
	let {value, children, ...props}: {value: string, children: Snippet, [key: string] : unknown} = $props()
	const CTX: TABS_CONTEXT = getContext("TAB")
	const id: string = generateToken()
	CTX.TABS.panelIds.push(id)

	// Kept in an effect so the lookup follows `value` if it changes, and clears itself when
	// this panel goes away.
	$effect(() => {
		CTX.TABS.panelIdByValue[value] = id
		return () => { delete CTX.TABS.panelIdByValue[value] }
	})

	onDestroy(() => {
		const idx = CTX.TABS.panelIds.indexOf(id)
		if (idx !== -1) CTX.TABS.panelIds.splice(idx, 1)
	})
</script>

{#if CTX.TABS.selectedPanelId === id}
	{#if CTX.animationSpeed !== "none"}
		<div {id} {...props} class="theui-tab-panel {twMerge(CTX.tabPanelClasses, props?.class as string)}" in:fade={{duration:150}} role="tabpanel" aria-labelledby={CTX.TABS.selectedTabId ?? undefined}>
      {@render children?.()}
    </div>
	{:else}
		<div {id} {...props} class="theui-tab-panel {twMerge(CTX.tabPanelClasses, props?.class as string)}" role="tabpanel" aria-labelledby={CTX.TABS.selectedTabId ?? undefined}>
      {@render children?.()}
    </div>
	{/if}
{/if}
