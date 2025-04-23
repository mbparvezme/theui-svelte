 <script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass } from "$lib/function"
  import { ST_MOBILE_NAV } from "$lib/state.svelte"

  interface Props {children?: Snippet, text?: string, active?: string|boolean, [key: string]: unknown}
  let {children, text, active = false, ...props}: Props = $props()

  const { config, id } = getContext('NAV') as any

  let linkCls = () => `nav-link flex items-center ${twMerge(config.linkClasses, active && config.activeLinkClasses, (config?.isDropdown ? config.dropdownLinkClasses : ""), props.class as string)}${roundedClass(config?.rounded)}${animationClass(config?.animationSpeed)}`

  let closeMobileNav = () => {
    if (ST_MOBILE_NAV.value.includes(id)) {
      ST_MOBILE_NAV.value = ST_MOBILE_NAV.value.filter((i:any) => i !== id)
    }
  }
</script>

{#snippet content()}
  {#if text}
    {@html text}
  {:else if children}
    {@render children()}
  {/if}
{/snippet}

{#if props?.href}
  <a {...props} class={linkCls()} onclick={()=>closeMobileNav()} aria-current={active ? "page" : undefined}>{@render content()}</a>
{:else}
  <span {...props} class="cursor-pointer {linkCls()}">{@render content()}</span>
{/if}