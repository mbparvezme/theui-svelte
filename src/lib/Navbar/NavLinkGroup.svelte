<script lang="ts">
  import {getContext, type Snippet} from "svelte"
  import type { RESPONSIVE_NAV_ON, MOBILE_NAV_ON } from "$lib/types"
  import {twMerge} from "tailwind-merge"
  const {config} = getContext('NAV') as any

  let {children, align = "start", ...props} :
      {children: Snippet, align?: 'start' | 'end' | 'center', [key: string]: unknown} = $props()

  let alignClasses: Record<"start" | "center" | "end", RESPONSIVE_NAV_ON> = {
    start : {
      sm: "md:me-auto",
      md: "lg:me-auto",
      lg: "xl:me-auto",
      xl: "2xl:me-auto",
    },
    center: {
      sm: "md:mx-auto",
      md: "lg:mx-auto",
      lg: "xl:mx-auto",
      xl: "2xl:mx-auto",
    },
    end: {
      sm: "md:ms-auto",
      md: "lg:ms-auto",
      lg: "xl:ms-auto",
      xl: "2xl:ms-auto",
    }
  }

  let structuralClasses: RESPONSIVE_NAV_ON = {
    sm: "flex-col md:flex-row",
    md: "flex-col lg:flex-row",
    lg: "flex-col xl:flex-row",
    xl: "flex-col 2xl:flex-row",
  }

  let navContainerClasses = `h-full ${!config.navBreakpoint ? "items-center flex-row" 
  : config.responsive ? (structuralClasses[config.navBreakpoint as MOBILE_NAV_ON] ?? "") : ""} ${alignClasses[align as "start" | "center" | "end"][config.navBreakpoint as MOBILE_NAV_ON]}`
</script>

{#if children}
<div {...props} class="nav-links flex {twMerge(navContainerClasses, props?.class as string)}">
  {@render children()}
</div>
{/if}