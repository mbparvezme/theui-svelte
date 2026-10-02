<script lang="ts">
  import { getContext, setContext, onMount, type Snippet } from "svelte"
	import type { MOBILE_NAV_ON, RESPONSIVE_NAV_ON, NAV_CTX } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, generateToken } from "$lib/function"
  import { Svg } from "$lib"

  const CTX: NAV_CTX = getContext('NAV')
  // Inherits the navbar settings live and marks the links inside as dropdown links
  const config: NAV_CTX['config'] = Object.create(CTX.config, { isDropdownLink: { value: true, enumerable: true } })
  setContext('NAV', { id: CTX.id, config })

  interface Props {
    children?: Snippet,
    label: string|Snippet,
    align?: 'start'|'end',
    width?: MOBILE_NAV_ON | 'full',
    triggerEvent?: 'hover' | 'click',
    animation?: 'fade'|'slide'|'zoom',
    arrowIcon?: Snippet|boolean,
    linkClasses?: string,
    [key: string]: unknown
  }

  let{
    children,
    label,
    align = "start",
    width = "sm",
    triggerEvent = CTX.config.dropdownTriggerEvent,
    animation = "fade",
    arrowIcon = true,
    linkClasses,
    ...props
  } : Props = $props()

  const effectiveLinkClasses = $derived(twMerge("gap-x-1 w-full justify-between flex items-center cursor-pointer", config.linkClasses, linkClasses))

  let dropdownContainer: HTMLElement
  let menuElement: HTMLElement | null = $state(null)
  let triggerElement: HTMLButtonElement | null = $state(null)

  const id: string = generateToken()
  const menuId = `${id}-menu`
  let open: boolean = $state(false)

  const menuWidthClasses: Record<MOBILE_NAV_ON | 'nonRes', Record<MOBILE_NAV_ON | 'full', string>> = {
    sm: {
      sm: "md:w-48",
      md: "md:w-60",
      lg: "md:w-80",
      xl: "md:w-96",
      full: "mega-menu md:inset-x-0",
    },
    md: {
      sm: "lg:w-48",
      md: "lg:w-60",
      lg: "lg:w-80",
      xl: "lg:w-96",
      full: "mega-menu lg:inset-x-0",
    },
    lg: {
      sm: "xl:w-48",
      md: "xl:w-60",
      lg: "xl:w-80",
      xl: "xl:w-96",
      full: "mega-menu xl:inset-x-0",
    },
    xl: {
      sm: "2xl:w-48",
      md: "2xl:w-60",
      lg: "2xl:w-80",
      xl: "2xl:w-96",
      full: "mega-menu 2xl:inset-x-0",
    },
    nonRes: {
      sm: "w-48",
      md: "w-60",
      lg: "w-80",
      xl: "w-96",
      full: "w-full inset-x-0",
    }
  }

  const topPositionClasses = () => {
    const heightClassObj: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
      sm: "top-full",
      md: "top-full",
      lg: "top-[calc(100%_+_4px)]",
      xl: "top-[calc(100%_+_12px)]",
    }

    // A custom height is a class for the navbar, not the menu, so it falls back to top-full
    return heightClassObj[config.height as keyof typeof heightClassObj] ?? "top-full"
  }

  const alignmentClasses: string = $derived(`${width != "full" ? (align=="end" ? "end-0" : "start-0") : ""}`)

  const resCls = () => {
    const collapseClasses: RESPONSIVE_NAV_ON = {
      sm: "md-collapse md:absolute md:flex md:shadow-xl md:block",
      md: "lg-collapse lg:absolute lg:flex lg:shadow-xl lg:block",
      lg: "xl:absolute xl:flex xl:shadow-xl xl:block",
      xl: "2xl:absolute 2xl:flex 2xl:shadow-xl 2xl:block",
    }

    const dropdownMaxHeight: RESPONSIVE_NAV_ON = {
      sm: "md:max-h-[80vh]",
      md: "lg:max-h-[80vh]",
      lg: "xl:max-h-[80vh]",
      xl: "2xl:max-h-[80vh]",
    }

    // Below the breakpoint the menu sits inside the mobile menu, so it is shown only while open
    return `shadow-none ${open ? "flex" : "hidden"}
            ${collapseClasses[config.navBreakpoint as MOBILE_NAV_ON]}
            ${dropdownMaxHeight[config.navBreakpoint as MOBILE_NAV_ON]}
            ${menuWidthClasses[config?.navBreakpoint as MOBILE_NAV_ON || "md"][width]}`
  }

  const memoizedResCls = $derived(resCls())

  const nonResCls = $derived(`absolute pl-0 flex shadow-xl block max-h-[80vh] ${menuWidthClasses["nonRes"][width]}`)

  const transformClasses: string = $derived({
    "slide": "transform translate-y-8",
    "fade": "",
    "zoom": "transform scale-75",
  }[animation ?? "fade"])

  const openTransformClasses: string = $derived({
    "slide": "transform translate-y-0",
    "fade": "",
    "zoom": "transform scale-100",
  }[animation ?? "fade"])

  let dropdownClasses = $derived(
    `nav-dropdown flex-col py-2 bg-primary overflow-y-auto
    ${config?.responsive && config.navBreakpoint ? memoizedResCls : nonResCls}
    ${topPositionClasses()}
    ${alignmentClasses}
    ${roundedClass(config?.rounded)}
    ${animationClass(config.animationSpeed)}
    ${config.animationSpeed != "none" ? twMerge(transformClasses, open && openTransformClasses) : ""}`
  )

  let handleClick = () => {
    if(triggerEvent !== "hover"){
      open = !open
    }
  }

  let hoverTimer: ReturnType<typeof setTimeout>

  let handleHover = (e: Event) => {
    if(triggerEvent === "hover"){
      e.stopPropagation()
      if (e.type === "mouseenter" || e.type === "touchstart") {
        open = true
      }
    }
    clearTimeout(hoverTimer)
    // Only the pointer leaving closes it: on touch, `touchend` comes right after the tap that opened it
    if (e.type === "mouseleave") {
      hoverTimer = setTimeout(() => open = false, 200)
    }
	}

  let handleKeyboard = (e: KeyboardEvent) => {
    // Keys pressed on a link belong to that link, so Enter and Space keep working
    if (menuElement && e.target instanceof Node && menuElement.contains(e.target)) {
      if (e.code === "Escape") {
        open = false
        triggerElement?.focus()
      }
      return
    }
    switch(e.code) {
      case "Escape":
      case "ArrowUp":
        e.preventDefault()
        open = false
        break
      case "ArrowDown":
        e.preventDefault()
        if (!open) open = true
        break
      case "Enter":
      case "Space":
        e.preventDefault()
        open = !open
        break
    }
  }

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
        open = false
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      clearTimeout(hoverTimer)
    }
  })
</script>

<div  {id} {...props} bind:this={dropdownContainer}
      class="theui-nav-dropdown-container"
      class:relative={width != "full"}
      onmouseenter={handleHover}
      onmouseleave={handleHover}
      ontouchstart={handleHover}
      ontouchend={handleHover}
      onkeydown={handleKeyboard}
      onclick={handleClick}
>
  <button bind:this={triggerElement} class="theui-nav-dropdown-btn {effectiveLinkClasses}"
    aria-expanded={open} aria-controls={menuId} type="button">
    {#if label}
      {#if typeof label == "function"}
        {@render label()}
      {:else}
        {label}
      {/if}
    {/if}

    {#if arrowIcon}
      {#if arrowIcon === true}
        <Svg class="transition-transform duration-200 {open ? 'rotate-180' : ''}" stroke={true} viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></Svg>
      {:else}
        {@render arrowIcon?.()}
      {/if}
    {/if}
  </button>

  <div bind:this={menuElement} id={menuId} class="theui-nav-dropdown {twMerge(dropdownClasses, props?.class as string)}"
        class:invisible={!open} class:opacity-0={!open}>
    {@render children?.()}
  </div>
</div>
