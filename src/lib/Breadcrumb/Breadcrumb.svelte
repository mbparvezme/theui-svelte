<script lang="ts">
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
    linkClasses = "text-brand-primary-500",
    rounded = "md",
    separator = "/",
    ...props
  } : Props = $props();

  let navClasses = "theui-breadcrumb " + (props?.class ?? "") + roundedClass(rounded)
  let getLinkCls = (url: any) => `before:text-gray-300 dark:before:text-gray-500 ${url?linkClasses:activeLinkClasses}${roundedClass(rounded)}`
</script>

<nav aria-label="breadcrumb" class={navClasses} style="--breadcrumb-separator: '{separator}';">
  <ol class="breadcrumb-list flex">
    {#each data as item, i}
      {@render breadcrumbLink(item, i)}
    {/each}
  </ol>
</nav>

<!-- Component Snippet -->
{#snippet breadcrumbLink(item: BREADCRUMB_DATA, i: number)}
  <li class="breadcrumb-item {getLinkCls(item.url)}" class:before:px-2={i!=0} class:active={!item.url}>
    {#if !item.url}
      <span aria-current="page">{item.text}</span>
    {:else}
      <a href={item.url}>{item.text}</a>
    {/if}
  </li>
{/snippet}

<style lang="postcss">
  .theui-breadcrumb .breadcrumb-item:not(:first-child)::before {
    content: var(--breadcrumb-separator);
  }
</style>