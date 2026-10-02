 <script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass } from "$lib/function"
  import { ST_MOBILE_NAV } from "$lib/state.svelte"
  import type { NAV_CTX } from "$lib/types"

  interface Props {children?: Snippet, text?: string, active?: string|boolean, [key: string]: unknown}
  let {children, text, active = false, ...props}: Props = $props()

  const CTX: NAV_CTX = getContext('NAV')

  let linkCls = $derived(`nav-link flex items-center
    ${twMerge(CTX.config.linkClasses, active && CTX.config.activeLinkClasses, (CTX.config?.isDropdownLink ? "hover:bg-secondary dark:hover:bg-tertiary rounded-none " + CTX.config.dropdownLinkClasses : ""), props.class as string)}
    ${roundedClass(CTX.config?.rounded)}
    ${animationClass(CTX.config?.animationSpeed)}`)

  let closeMobileNav = () => {
    if (ST_MOBILE_NAV.value.has(CTX.id)) {
      ST_MOBILE_NAV.value.delete(CTX.id)
    }
  }

  // Runs your own onclick first, then closes the mobile menu
  let handleClick = (e: MouseEvent) => {
    (props.onclick as ((e: MouseEvent) => void) | undefined)?.(e)
    closeMobileNav()
  }
</script>

{#snippet content()}
  {#if text}
    {text}
  {:else if children}
    {@render children()}
  {/if}
{/snippet}

{#if props?.href}
  <a {...props} class={linkCls} onclick={handleClick} aria-current={active ? "page" : undefined}>{@render content()}</a>
{:else if props?.onclick}
  <button type="button" {...props} class="cursor-pointer {linkCls}">{@render content()}</button>
{:else}
  <span {...props} class="cursor-pointer {linkCls}">{@render content()}</span>
{/if}
