<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import type { PRELOAD } from "$lib/types"
  import { twMerge } from "tailwind-merge"

  const CTX : {activeItemClasses: string, itemClasses: string, dividerClass: string, headerClass: string} = getContext('DROPDOWN_CTX')

  interface Props {
    startItem ?: Snippet,
    endItem ?: Snippet,
    children ?: Snippet,
    type ?: 'link' | 'divider' | 'header' | 'button'
    href ?: string,
    preload ?: PRELOAD,
    active ?: boolean,
    [key: string]: unknown
  }

  let {startItem, endItem, children, text, href, preload = "hover", type = "link", active = false, ...props} : Props = $props()

  let itemClass = (t: Props['type']) => {
    const typeClasses: Record<Exclude<Props['type'], undefined>, string> = {
      link: active ? twMerge(CTX.itemClasses, CTX.activeItemClasses) : CTX.itemClasses,
      button: active ? twMerge(CTX.itemClasses, CTX.activeItemClasses) : CTX.itemClasses,
      header: CTX.headerClass,
      divider: CTX.dividerClass,
    }
    return t ? twMerge(typeClasses[t], props?.class as string) : "";
  }
</script>

{#snippet content()}
  {@render startItem?.()}

  {#if text}
		{@html text}
	{:else if children}
		{@render children()}
	{/if}

  {#if endItem}
    <div class="ms-auto flex items-center">{@render endItem()}</div>
  {/if}
{/snippet}

{#if type=="divider"}
  <li class="dropdown-item {itemClass("divider")}" role="presentation"></li>
{:else}
  <li class="dropdown-item" role={type=="header" ? "heading" : "menuitem"}>
    {#if type == "header"}
      <h6 class={itemClass(type)}>
        {@render content()}
      </h6>
    {:else}
      {#if href}
        <a href={href} class={itemClass(type)} data-sveltekit-preload-data={preload||preload}>
          {@render content()}
        </a>
      {:else}
        <button class={itemClass(type)}>
          {@render content()}
        </button>
      {/if}
    {/if}
  </li>
{/if}