<script lang="ts">
  import { getContext, type Snippet } from "svelte"
	import type { MOBILE_NAV_ON, RESPONSIVE_NAV_ON } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { Svg } from "$lib"
	import { ST_MOBILE_NAV } from "$lib/state.svelte"

  let {children, ...props}: {children ?: Snippet, [key: string]: unknown} = $props()
  const { config, id } = getContext("NAV") as any

  let hiddenClasses: RESPONSIVE_NAV_ON = {sm: "md:hidden", md: "lg:hidden", lg: "xl:hidden", xl: "2xl:hidden"}

  let toggle = () => {
    if (ST_MOBILE_NAV.value.includes(id)) {
      ST_MOBILE_NAV.value = ST_MOBILE_NAV.value.filter((i: string) => i !== id);
    }else{
      ST_MOBILE_NAV.value.push(id)
    }
  }

  let getClass = `nav-toggle border border-gray-400 dark:border-gray-700 rounded-md w-12 h-12 flex items-center justify-center ${hiddenClasses[config.mobileNavOn as MOBILE_NAV_ON] ?? "hidden"}`
</script>

{#if config.mobileNavOn !== false}
<button {...props} type="button" onclick={()=>toggle()} class={twMerge(getClass, props?.class as string)} aria-label="Toggle nav bar">
  {#if children}
    {@render children()}
  {:else}
    <Svg size={1.25}>
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </Svg>
  {/if}
</button>
{/if}