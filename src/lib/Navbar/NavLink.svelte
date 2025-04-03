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
  <a {...props} class={linkCls()} onclick={()=>closeMobileNav()}>{@render content()}</a>
{:else}
  <span {...props} class="cursor-pointer {linkCls()}">{@render content()}</span>
{/if}

<style lang="postcss">
  :global(.navbar-collapse .nav-link:not(.nav-dropdown-btn)){
    @apply hover:bg-secondary;
  }
  :global(.navbar-collapse.xl-collapse .nav-links > .nav-link){
    @apply xl:hover:bg-transparent;
  }
  :global(.navbar-collapse.lg-collapse .nav-links > .nav-link){
    @apply lg:hover:bg-transparent;
  }
  :global(.navbar-collapse.md-collapse .nav-links > .nav-link){
    @apply md:hover:bg-transparent;
  }
</style>