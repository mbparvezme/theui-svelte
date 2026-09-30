<script lang="ts">
	import { setContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import type { ANIMATE_SPEED, ROUNDED, LIST_GROUP_CTX } from "$lib/types"
	import { roundedClass, coreSpeed } from "$lib/function"

  interface Props {
		children: Snippet,
    animationSpeed?: ANIMATE_SPEED,
		variant?: 'bordered' | 'flat',
    itemClasses?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl',
		rounded?: ROUNDED,
    [key: string]: unknown
	}

  let {
    children,
    animationSpeed = coreSpeed(),
    variant = "bordered",
    itemClasses = "",
    size = "md",
    rounded = "md",
    ...props
  } : Props = $props()

  const groupClasses = $derived(twMerge(
    "overflow-hidden divide-y divide-gray-300 dark:divide-gray-700",
    variant == "bordered" && "border border-gray-300 dark:border-gray-700",
    roundedClass(variant == "flat" ? "none" : rounded),
    props?.class as string
  ))

  // Getters, so an item reads each prop as it is now. This replaces an $state object that
  // an $effect had to copy the props into after every change.
  const CTX: LIST_GROUP_CTX = {
    get animationSpeed() { return animationSpeed },
    get itemClasses() { return itemClasses },
    get size() { return size }
  }
  setContext("LIST_GROUP", CTX)
</script>

{#if children}
<ul {...props} class="list-group {groupClasses}" role="list">
  {@render children()}
</ul>
{/if}