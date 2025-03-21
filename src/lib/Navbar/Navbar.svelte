<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
	import { setContext, type Snippet } from "svelte"
  import { onMount } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, generateToken } from "$lib/function"

  type heightTypes = 'sm' | 'md' | 'lg' | 'xl'

  interface Props {
    children: Snippet,
    scrollBehavior?: 'default' | 'fixed' | 'shrinkOnScrollDown' | 'hideOnScrollDown' | 'shrinkAndHide',
    scrollAmountToHide?: number,
    scrollAmountToShrink?: number,
    height?: heightTypes | 'string',
    mobileNavOn?: 'sm' | 'md' | 'lg' | 'xl',

    segment?: string,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    dropdownEvent?: 'hover' | 'click',

    linkClasses?: string,
    activeLinkClasses?: string,
    dropdownLinkClasses?: string,
    navInnerClasses?: string,
    navCollapseClasses?: string,
    scrollClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    segment = "/",
    activeLinkClasses = "",
    animationSpeed = "fast",
    height = "md",
    linkClasses = "",
    dropdownLinkClasses = "",
    mobileNavOn = "lg",
    navInnerClasses = "",
    navCollapseClasses = "",
    rounded = "md",
    dropdownEvent = "click",
    scrollAmountToHide = 128,
    scrollAmountToShrink = 32,
    scrollBehavior = "default",
    scrollClasses = "",
    ...props
  } : Props = $props()

  let paddingHeightCls: Record<heightTypes, string> = {sm: "py-1", md: "py-2", lg: "py-4", xl: "py-6"}
  let paddingHeightOnShrinkCls: Record<heightTypes, string> = {sm: "!py-0", md: "!py-0", lg: "!py-1", xl: "!py-3"}
  let miniNav = $state(false)
  let hideNav = $state(false)
  let id: string = generateToken()
  let scrollPos = 0

  let config: any = {
    activeLinkClasses : twMerge("p-3 text-default text-sm", activeLinkClasses),
    animationSpeed,
    height,
    navInnerClasses,
    navCollapseClasses,
    linkClasses: twMerge("p-3 text-gray-700 dark:text-gray-300 hover:text-default text-sm", roundedClass(rounded), animationClass(animationSpeed), linkClasses),
    dropdownLinkClasses: twMerge("hover:bg-tertiary h-auto px-4 py-2", animationClass(animationSpeed), roundedClass(rounded), dropdownLinkClasses),
    mobileNavOn,
    rounded,
    dropdownEvent,
  }

  const navCoreClass =  twMerge(`bg-secondary left-0 top-0 w-full flex items-center justify-center ${paddingHeightCls[height as "sm" | "md" | "lg" | "xl"] ?? height as string}${animationClass(animationSpeed)}`, props?.class as string)
  let navClass = $state(navCoreClass)
  let scrollClass = twMerge(`bg-secondary shadow-black/10 ${paddingHeightOnShrinkCls[height as heightTypes]}`, scrollClasses)
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
>
  <div class={twMerge(navInnerClass, navInnerClasses)}>
    {@render children()}
  </div>
</nav>