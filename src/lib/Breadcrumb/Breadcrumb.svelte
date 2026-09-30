<script lang="ts">
  import { twMerge } from "tailwind-merge"
  import type { ROUNDED, BREADCRUMB_DATA } from "$lib/types"
  import { roundedClass } from "$lib/function"

  interface Props {
    data : Array<BREADCRUMB_DATA>,
    activeLinkClasses ?: string,
    linkClasses ?: string,
    rounded ?: ROUNDED,
    separator ?: string,
    [key: string]: unknown
	}

  let {
    data = [],
    activeLinkClasses = "text-gray-400",
    linkClasses = "text-brand-500",
    rounded = "md",
    separator = "/",
    ...props
  } : Props = $props();

  let navClasses = $derived(twMerge("theui-breadcrumb", roundedClass(rounded), props?.class as string))
</script>

<nav {...props} aria-label="breadcrumb" class={navClasses} style="--breadcrumb-separator: '{separator}';">
  <ol class="breadcrumb-list flex">
    {#each data as item, i (item.text)}
      {@render breadcrumbLink(item, i)}
    {/each}
  </ol>
</nav>

{#snippet breadcrumbLink(item: BREADCRUMB_DATA, i: number)}
  {@const linkCls: string = `before:text-gray-300 dark:before:text-gray-500 ${item.url ? linkClasses : activeLinkClasses}${roundedClass(rounded)}`}
  <li
    class="breadcrumb-item {linkCls}"
    class:before:mx-2={i!=0}
    class:before:content-[var(--breadcrumb-separator)]={i!=0}
    class:active={!item.url}
  >
    {#if !item.url}
      <span aria-current="page">{item.text}</span>
    {:else}
      <a href={item.url}>{item.text}</a>
    {/if}
  </li>
{/snippet}