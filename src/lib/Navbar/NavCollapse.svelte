<script lang="ts">
  import {getContext, setContext, type Snippet} from "svelte"
	import { twMerge } from "tailwind-merge";
	import type { MOBILE_NAV_ON, RESPONSIVE_NAV_ON } from "$lib/types"
	import { roundedClass } from "$lib/function"
	import { ST_MOBILE_NAV } from "$lib/state.svelte"
	import { Svg } from "$lib"
  const {config, id} = getContext('NAV') as any

  const CTX = getContext('NAV') as any
  setContext('NAV', {...CTX, config: {...CTX.config, responsive: true}});

  let {children, toggleIcon} : {children: Snippet, toggleIcon?: Snippet} = $props()

  let responsiveClasses = () => {
    // Determine mobile nav responsive classes
    let responsiveClassesByBreakPoints: RESPONSIVE_NAV_ON = {
      xl : "xl-collapse 2xl:flex-row 2xl:items-center 2xl:basis-auto 2xl:static 2xl:left-auto 2xl:right-auto 2xl:top-auto 2xl:flex 2xl:overflow-visible 2xl:shadow-none 2xl:px-0 2xl:py-0 2xl:bg-transparent ",
      lg : "lg-collapse xl:flex-row xl:items-center xl:basis-auto xl:static xl:left-auto xl:right-auto xl:top-auto xl:flex xl:overflow-visible xl:shadow-none xl:px-0 xl:py-0 xl:bg-transparent ",
      md : "md-collapse lg:flex-row lg:items-center lg:basis-auto lg:static lg:left-auto lg:right-auto lg:top-auto lg:flex lg:overflow-visible lg:shadow-none lg:py-0 lg:bg-transparent lg:px-0 ",
      sm : "sm-collapse md:flex-row md:items-center md:basis-auto md:static md:left-auto md:right-auto md:top-auto md:flex md:overflow-visible md:shadow-none md:py-0 md:bg-transparent md:px-0 ",
    }
    let navMobileStatusClasses = {
      on: "flex-col basis-full absolute left-0 right-0 top-full order-last lg:order-none shadow-lg px-8 py-4",
      off: "flex-row items-center relative overflow-visible"
    }
    return config.navBreakpoint ? `${navMobileStatusClasses["on"]} ${responsiveClassesByBreakPoints[config.navBreakpoint as MOBILE_NAV_ON] ?? ""}` : navMobileStatusClasses["off"]
  }

  let collapseClasses = `theui-navbar-collapse flex-grow z-[1] flex ${responsiveClasses()}${roundedClass(config?.rounded, "bottom")} ${twMerge("max-h-[80vh] bg-primary", config.navCollapseClasses)}`

  // Toggle functionality
  let hiddenClasses: RESPONSIVE_NAV_ON = {sm: "md:hidden", md: "lg:hidden", lg: "xl:hidden", xl: "2xl:hidden"}

  let toggle = () => {
    if (ST_MOBILE_NAV.value.includes(id)) {
      ST_MOBILE_NAV.value = ST_MOBILE_NAV.value.filter((i: string) => i !== id);
    }else{
      ST_MOBILE_NAV.value.push(id)
    }
  }

  let getClass = `nav-toggle w-12 h-12 ms-auto flex items-center justify-center ${hiddenClasses[config.navBreakpoint as MOBILE_NAV_ON] ?? "hidden"}`
</script>

<div
  class={collapseClasses}
  class:flex={!config.navBreakpoint || ST_MOBILE_NAV.value.includes(id)}
  class:hidden={config.navBreakpoint != false && !ST_MOBILE_NAV.value.includes(id)}
  class:overflow-hidden={config.navBreakpoint != false && !ST_MOBILE_NAV.value.includes(id)}
  class:overflow-auto={config.navBreakpoint != false && ST_MOBILE_NAV.value.includes(id)}
  >
    {@render children()}
  </div>
  <button type="button" onclick={()=>toggle()} class={getClass} aria-label="Toggle nav bar">
    {#if toggleIcon}
      {@render toggleIcon()}
    {:else}
      <Svg size={1.25}>
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </Svg>
    {/if}
  </button>