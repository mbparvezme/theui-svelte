<script lang="ts">
	import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
	import { roundedClass } from "$lib/function"
	import { setContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"

  interface Props {
		children: Snippet,
    animate?: ANIMATE_SPEED,
		rounded?: ROUNDED,
		variant?: 'bordered' | 'flat',
    itemClasses?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl',
    [key: string]: unknown
	}

  let {
    children,
    animate = "normal",
    rounded = "md",
    variant = "bordered",
    itemClasses = "",
    size = "md",
    ...props
  } : Props = $props()

  let groupClasses = `overflow-hidden divide-y divide-gray-300 ${variant == "bordered" ? "border border-gray-300" : ""}${roundedClass(variant=="flat"?"none":rounded)}`

  setContext("LISTGROUP", {animate, variant, itemClasses, size})
</script>

{#if children}
<ul class="list-group {twMerge(groupClasses, props?.class as string)}">
  {@render children()}
</ul>
{/if}