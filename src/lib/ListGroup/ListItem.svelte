<script lang="ts">
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"
	import type { ANIMATE_SPEED, LIST_GROUP_CTX } from "$lib/types"
	import { animationClass, coreSpeed } from "$lib/function"

  let CTX: LIST_GROUP_CTX = getContext("LIST_GROUP")

  interface Props {
		children: Snippet,
    animationSpeed?: ANIMATE_SPEED,
    href?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl',
    [key: string]: unknown // class, ...
	}

  let {
    children,
    href,
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    size = CTX?.size ?? "md",
    ...props
  } : Props = $props()

  const sizeClasses: Record<Exclude<Props["size"], undefined>, string> = {
    "xl" : "p-6",
    "lg" : "p-5",
    "md" : "p-4",
    "sm" : "py-2 px-3"
  }

  const itemClasses = $derived(twMerge("cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800", sizeClasses[size] ?? "", animationClass(animationSpeed), CTX?.itemClasses, props?.class as string))
</script>

{#if href}
  <li role="listitem">
    <a {href} {...props} class="list-item {itemClasses}">
      {@render children()}
    </a>
  </li>
{:else}
  <li class="list-item {itemClasses}" role="listitem">
    {@render children()}
  </li>
{/if}