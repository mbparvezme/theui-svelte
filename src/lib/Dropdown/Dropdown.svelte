<script lang="ts">
  import { onMount, setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { ANIMATE_SPEED, ROUNDED, DROPDOWN_CTX } from "$lib/types"
  import { animationClass, roundedClass, generateToken, backdropClasses, coreSpeed } from "$lib/function"
  import { Button, Svg } from "$lib"

  type DROPDOWN_ANIMATION_TYPE = 'slide-left' | 'slide-up' | 'slide-right' | 'slide-down' | 'fade' | 'zoom-in' | 'zoom-out'

  interface Props {
    children?: Snippet,
    label : string|Snippet,
    width?: 'sm' | 'md' | 'lg' | 'full' | 'auto' | string,
    align?: 'start' | 'end'
    triggerEvent?: 'hover' | 'click',
    animationSpeed?: ANIMATE_SPEED,
    animation?: DROPDOWN_ANIMATION_TYPE,
    arrowIcon?: Snippet|boolean,
    ariaLabel?: string,
    backdrop?: boolean | string,
    activeItemClasses?: string,
    itemClasses?: string,
    dividerClasses?: string,
    headerClasses?: string,
    containerClasses?: string,
    dropdownClasses?: string,
		buttonClasses?: string,
    id?: string,
    rounded?: ROUNDED
		[key: string]: unknown // Any other attribute of the container element. `class` is ignored, use `containerClasses`.
  }

  let{
    children,
    align = "end",
    animationSpeed = coreSpeed("fast"),
    animation = "fade",
    arrowIcon = true,
    ariaLabel,
    backdrop = false,
    activeItemClasses,
    itemClasses,
    dividerClasses,
    headerClasses,
    containerClasses,
    dropdownClasses,
		buttonClasses,
    id = generateToken(),
    triggerEvent = 'click',
    label,
    rounded = "md",
    width = "md",
		...props
  } : Props = $props()

	let open: boolean = $state(false)
  let dropdownContainer: HTMLElement;
  let menuElement: HTMLElement | null = $state(null)

  const transformClasses: string = $derived({
    "slide-left": "transform translate-x-2",
    "slide-up": "transform translate-y-2",
    "slide-right": "transform -translate-x-2",
    "slide-down": "transform -translate-y-2",
    "fade": "",
    "zoom-in": "transform scale-80",
    "zoom-out": "transform scale-110"
  }[animation ?? "fade"])

  const openTransformClasses: string = $derived({
    "slide-left": "transform translate-x-0",
    "slide-up": "transform translate-y-0",
    "slide-right": "transform translate-x-0",
    "slide-down": "transform translate-y-0",
    "fade": "",
    "zoom-in": "transform scale-100",
    "zoom-out": "transform scale-100"
  }[animation ?? "fade"])

  const SIZE_MAP: Record<string, string> = {
    sm: "dropdown-sm w-48",
    md: "dropdown-md w-64",
    lg: "dropdown-lg w-80",
    full: "dropdown-full w-full start-0 end-0",
    auto: "dropdown-auto",
  }

  const sizeClasses = $derived(SIZE_MAP[width] ?? width)

  const getContainerClasses: string = $derived(twMerge(`theui-dropdown relative inline-block z-200 ${animationClass(animationSpeed)}`, containerClasses))

  let getDropdownClasses = $derived(
    twMerge(
      `dropdown-content absolute list-none z-[11] bg-white dark:bg-secondary text-base shadow-lg py-1 text-nowrap
      ${sizeClasses}
      ${align === "end" ? "start-auto end-0" : ""}
      ${roundedClass(rounded)}
      ${animation}
      ${animationClass(animationSpeed)}
      ${animationSpeed != "none" ? transformClasses : ""}`,
      (animationSpeed != "none" && open) && openTransformClasses,
      dropdownClasses
    )
  )

	let handleClick = (e?: MouseEvent) => {
    // Headers, dividers and empty space inside the menu do not close it
    const target = e?.target
    if (target instanceof Element && menuElement?.contains(target) && !target.closest("a, button, [role='menuitem']")) return
    if(triggerEvent !== "hover"){
			open = !open
		}
	}

  let hoverTimeout: ReturnType<typeof setTimeout>
	let handleHover = (e: Event) => {
    if(triggerEvent === "hover"){
      e.stopPropagation()
      if (e.type === "mouseenter" || e.type === "touchstart") {
        clearTimeout(hoverTimeout)
        open = true
      // Only the pointer leaving closes it: on touch, `touchend` comes right after the tap that opened it
      } else if (e.type === "mouseleave") {
        hoverTimeout = setTimeout(() => open = false, 200)
      }
    }
	}

  let handleKeyboard = (e: KeyboardEvent) => {
    // Keys pressed on an item belong to that item, so links and buttons keep working
    if (menuElement && e.target instanceof Node && menuElement.contains(e.target)) {
      if (e.code === "Escape") {
        open = false
        dropdownContainer?.querySelector<HTMLElement>(".theui-dropdown-trigger")?.focus()
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
      case "Space":
      case "Enter":
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
    return () => document.removeEventListener('click', handleClickOutside)
  })

  const itemCls = $derived(twMerge("flex text-wrap w-full items-center gap-4 py-3 px-4 bg-transparent hover:bg-gray-500/10 text-default cursor-pointer", itemClasses))
  const activeItemCls = $derived(twMerge("flex items-center gap-4 py-3 px-4 bg-gray-500/10", activeItemClasses))
  const dividerCls = $derived(twMerge("border-b pb-2 mb-2 border-gray-300 dark:border-gray-700", dividerClasses))
  const headerCls = $derived(twMerge("flex items-center gap-4 p-4 font-bold text-sm opacity-50 uppercase", headerClasses))

  // Getters, so an item reads each class as it is now. This replaces an $state object that
  // an $effect had to copy the props into after every change.
	const config: DROPDOWN_CTX = {
    get itemClasses() { return itemCls },
    get activeItemClasses() { return activeItemCls },
    get dividerClass() { return dividerCls },
    get headerClass() { return headerCls }
  }

  setContext('DROPDOWN_CTX', config)
</script>

{#snippet arrow()}
{#if arrowIcon} 
  {#if arrowIcon === true}
    <Svg class="theui-dropdown-arrow transition-transform duration-300 {open ? 'rotate-180' : ''}" stroke={true} viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></Svg>
  {:else}
    {@render arrowIcon?.()}
  {/if}
{/if}
{/snippet}

<div {id} {...props} bind:this={dropdownContainer} class={getContainerClasses}
  onclick={handleClick}
  onkeydown={handleKeyboard}
  onmouseenter={handleHover}
  onmouseleave={handleHover}
  ontouchstart={handleHover}
  ontouchend={handleHover}
>
  {#if typeof label == "string"}
    <Button id={`theui-dropdown-trigger${id}`} class={`theui-dropdown-trigger ${buttonClasses}`}
    ariaLabel={ariaLabel} aria-controls={`${id}-dropdown`} aria-expanded={open} aria-haspopup="menu"
    >
      {label}
      {@render arrow()}
    </Button>
  {:else}
    <span id={`theui-dropdown-trigger${id}`} class={`theui-dropdown-trigger ${buttonClasses}`}
    aria-label={ariaLabel} aria-controls={`${id}-dropdown`} aria-expanded={open} aria-haspopup="menu"
    role="button"
    tabindex="0">
      {@render label?.()}
    </span>
  {/if}

  {#if backdrop && open}
    <!-- stopPropagation: otherwise the click also reaches the container and opens the menu again -->
    <div class={backdropClasses(backdrop)} onclick={(e) => { e.stopPropagation(); open = false }} aria-hidden="true"></div>
  {/if}

  <ul bind:this={menuElement} id={`${id}-dropdown`} class={getDropdownClasses} class:invisible={!open} class:opacity-0={!open} role="menu" aria-labelledby={`theui-dropdown-trigger${id}`}>
		{@render children?.()}
	</ul>
</div>
