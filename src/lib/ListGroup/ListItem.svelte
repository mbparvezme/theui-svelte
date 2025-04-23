<script lang="ts">
	import type { ANIMATE_SPEED } from "$lib/types"
	import { animationClass } from "$lib/function"
	import { getContext, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"

  let CTX = getContext("LISTGROUP") as any

  interface Props {
		children?: Snippet,
    animationSpeed?: ANIMATE_SPEED,
    href?: string,
		variant?: 'bordered' | 'flat',
    size?: 'sm' | 'md' | 'lg' | 'xl',
    [key: string]: unknown
	}

  let {
    children,
    href,
    animationSpeed = CTX?.animationSpeed ?? "normal",
    variant = CTX?.variant ?? "bordered",
    size = CTX?.size ?? "md",
    ...props
  } : Props = $props()

  let sizeClasses: Record<Exclude<Props["size"], undefined>, string> = {
    "xl" : "p-6",
    "lg" : "p-5",
    "md" : "p-4",
    "sm" : "py-2 px-3"
  }

  let itemClasses = `${sizeClasses[size]} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${animationClass(animationSpeed)}`
</script>

{#if children}
  {#if href}
    <li role="listitem">
      <a {href} class="list-item {twMerge(itemClasses, CTX?.itemClasses, props?.class as string)}">
        {@render children()}
      </a>
    </li>
  {:else}
    <li class="list-item {twMerge(itemClasses, CTX?.itemClasses, props?.class as string)}" role="listitem">
      {@render children()}
    </li>
  {/if}
{/if}