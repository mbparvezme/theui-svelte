<script lang="ts">
  import type { ANIMATE_SPEED, NAV_SCROLL_BEHAVIOR, NAV_HEIGHT_TYPES, ROUNDED } from "$lib/types"
	import { setContext, type Snippet } from "svelte"
  import { onMount } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken } from "$lib/function"

  interface Props {
    children: Snippet,
    scrollBehavior?: NAV_SCROLL_BEHAVIOR,
    scrollAmountToShrink?: number,
    scrollAmountToHide?: number,

    height?: NAV_HEIGHT_TYPES | 'string',
    navBreakpoint?: 'sm' | 'md' | 'lg' | 'xl',
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    ariaLabel?: string,

    dropdownEvent?: 'hover' | 'click',

    navInnerClasses?: string,
    navCollapseClasses?: string,
    scrollShrinkClasses?: string,
    linkClasses?: string,
    activeLinkClasses?: string,
    dropdownLinkClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    scrollBehavior = "default",
    scrollAmountToShrink = 32,
    scrollAmountToHide = 128,

    height = "md",
    navBreakpoint = "lg",
    animationSpeed = "fast",
    rounded = "md",
    ariaLabel = "Navigation bar",

    dropdownEvent = "click",

    navInnerClasses,
    navCollapseClasses,
    scrollShrinkClasses,
    linkClasses,
    activeLinkClasses,
    dropdownLinkClasses,
    ...props
  } : Props = $props()

  let paddingHeightCls: Record<NAV_HEIGHT_TYPES, string> = {sm: "py-1", md: "py-2", lg: "py-4", xl: "py-6"}
  let paddingHeightOnShrinkCls: Record<NAV_HEIGHT_TYPES, string> = {sm: "!py-0", md: "!py-0", lg: "!py-1", xl: "!py-3"}
  let miniNav = $state(false)
  let hideNav = $state(false)
  let id: string = generateToken()
  let scrollPos = 0

  let config: any = {
    height,
    navBreakpoint,
    animationSpeed,
    rounded,
    dropdownEvent,
    navInnerClasses,
    navCollapseClasses,
    linkClasses: twMerge("p-3 text-gray-700 dark:text-gray-300 hover:text-default text-sm", linkClasses),
    activeLinkClasses : twMerge("p-3 text-default text-sm", activeLinkClasses),
    dropdownLinkClasses,
  }

  const navCoreClass =  twMerge(`bg-secondary left-0 top-0 w-full flex items-center justify-center ${paddingHeightCls[height as "sm" | "md" | "lg" | "xl"] ?? height as string}${animationClass(animationSpeed)}`, props?.class as string)
  let navClass = $state(navCoreClass)
  let scrollClass = twMerge(`bg-secondary shadow-black/10 ${paddingHeightOnShrinkCls[height as NAV_HEIGHT_TYPES]}`, scrollShrinkClasses)
  let navInnerClass = $derived(`nav-inner w-full max-w-[var(--max-width)] flex grow gap-x-8 items-center justify-between relative
                      ${animationClass(animationSpeed)} ${(miniNav||(hideNav===false && scrollPos!==0) ? " px-4" : " px-8")}`)

  setContext('NAV', {config, id})

  onMount(() => {
    window.addEventListener("scroll", () => {
      // Shrink Navbar
      if(scrollBehavior === "shrinkOnScrollDown" || scrollBehavior === "shrinkAndHide") {
        if(window.scrollY >= scrollAmountToShrink!){
          miniNav = true
          navClass = twMerge(navCoreClass, scrollClass)
        }else{
          miniNav = false
          navClass = navCoreClass
        }
      }
      // Set / Reset Navbar
      if(scrollBehavior === "hideOnScrollDown" || scrollBehavior === "shrinkAndHide") {
        if (document.body.getBoundingClientRect().top > scrollPos) {
          hideNav = false
        } else {
          hideNav = scrollPos !== 0 || window.scrollY > scrollAmountToHide!
        }
        scrollPos = window.scrollY >= scrollAmountToHide! ? document.body.getBoundingClientRect().top : 0
      }
    })
  })
</script>

<nav
  {id}
  class:navbar-mini={miniNav}
  class:-translate-y-full={hideNav}
  class:fixed={scrollBehavior !== "default"}
  class="theui-navbar z-[21] {navClass}"
  aria-label={ariaLabel}
>
  <div class={twMerge(navInnerClass, navInnerClasses)}>
    {@render children()}
  </div>
</nav>