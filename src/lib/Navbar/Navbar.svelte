<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
	import { setContext, type Snippet } from "svelte"
  import { onMount } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, generateToken } from "$lib/function"

  type heightTypes = 'sm' | 'md' | 'lg' | 'xl'

  interface Props {
    children: Snippet,
    segment ?: string,
    activeLinkClasses ?: string,
    animate ?: ANIMATE_SPEED,
    height ?: heightTypes | 'string',
    linkClasses ?: string,
    dropdownLinkClasses ?: string,
    mobileNavOn ?: 'md' | 'lg' | 'xl' | false,
    navInnerClasses ?: string,
    navCollapseClasses ?: string,
    rounded ?: ROUNDED,
    dropdownEvent ?: 'hover' | 'click',
    scrollAmountToHide ?: number,
    scrollAmountToShrink ?: number,
    scrollBehavior ?: 'fixed' | 'default' | 'shrinkOnScrollDown' | 'hideOnScrollDown' | 'shrinkAndHide',
    scrollClasses ?: string,
    [key: string] : unknown
  }

  let {
    children,
    segment = "/",
    activeLinkClasses = "",
    animate = "fast",
    height = "md",
    linkClasses = "",
    dropdownLinkClasses = "",
    mobileNavOn = "lg",
    navInnerClasses = "",
    navCollapseClasses = "",
    rounded = "none",
    dropdownEvent = "click",
    scrollAmountToHide = 128,
    scrollAmountToShrink = 32,
    scrollBehavior = "shrinkAndHide",
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
    animate,
    height,
    navInnerClasses,
    navCollapseClasses,
    linkClasses: twMerge("p-3 text-gray-700 dark:text-gray-300 hover:text-default text-sm", roundedClass(rounded), animationClass(animate), linkClasses),
    dropdownLinkClasses: twMerge("hover:bg-gray-100 dark:hover:bg-gray-700 h-auto px-4 py-2", animationClass(animate), roundedClass(rounded), dropdownLinkClasses),
    mobileNavOn,
    rounded,
    dropdownEvent,
    scrollAmountToHide,
    scrollAmountToShrink,
    scrollBehavior,
    scrollClasses: twMerge(`bg-white dark:bg-secondary shadow-black/10 shadow-2xl ${paddingHeightOnShrinkCls[height as heightTypes]}`, scrollClasses),
  }

  onMount(() => {
    window.addEventListener("scroll", () => {
      // Shrink Navbar
      if(scrollBehavior === "shrinkOnScrollDown" || scrollBehavior === "shrinkAndHide") {
        miniNav = (window.scrollY >= scrollAmountToShrink!)
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

  let navClass = $derived(`bg-primary left-0 top-0 w-full flex items-center justify-center ${animationClass(animate)} 
                  ${paddingHeightCls[height as "sm" | "md" | "lg" | "xl"] ?? height as string}
                  ${((miniNav||(hideNav===false && scrollPos!==0)) && (config.scrollBehavior == "shrinkOnScrollDown" || config.scrollBehavior == "shrinkAndHide") ? config.scrollClasses : "")}${roundedClass(config?.rounded)}`)

  let navInnerClass = $derived(`nav-inner w-full max-w-[var(--max-width)] flex grow gap-x-8 items-center justify-between relative
                      ${animationClass(animate)} ${(miniNav||(hideNav===false && scrollPos!==0) ? " px-4" : " px-8")}`)

  setContext('NAV', {config, id})
</script>

<nav
  {id}
  class:navbar-mini={miniNav}
  class:-translate-y-full={hideNav}
  class:fixed={scrollBehavior !== "default"}
  class="theui-navbar z-[21] {twMerge(navClass, props?.class as string)}"
>
  <div class={twMerge(navInnerClass, navInnerClasses)}>
    {@render children()}
  </div>
</nav>