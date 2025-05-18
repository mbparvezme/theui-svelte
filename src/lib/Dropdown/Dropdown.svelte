<script lang="ts">
  import { onMount, setContext, type Snippet } from "svelte"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { animationClass, roundedClass, generateToken, backdropClasses } from "$lib/function"
  import { twMerge } from "tailwind-merge"
  import { Button, Svg } from "$lib"

  type DROPDOWN_ANIMATION_TYPE = 'slide-left' | 'slide-up' | 'slide-right' | 'slide-down' | 'fade' | 'zoom-in' | 'zoom-out'

  interface Props {
    children?: Snippet,
    align?: 'start' | 'end'
    animationSpeed?: ANIMATE_SPEED,
    animation?: DROPDOWN_ANIMATION_TYPE,
    arrowIcon?: Snippet|boolean,
    backdrop?: boolean | string,
    closeOnBlur?: boolean,
    activeItemClasses?: string,
    itemClasses?: string,
    dividerClasses?: string,
    headerClasses?: string,
    containerClasses?: string,
    dropdownClasses?: string,
		buttonClasses?: string,
    id?: string,
    triggerEvent?: 'hover' | 'click',
    label : string|Snippet,
    rounded?: ROUNDED
    width?: 'sm' | 'md' | 'lg' | 'full' | 'auto' | string,
		[key: string]: unknown
  }

  let{
    children,
    align = "end",
    animationSpeed = "fast",
    animation = "fade",
    arrowIcon = true,
    backdrop = false,
    closeOnBlur = true,
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

  const transformClasses: string = {
    "slide-left": "transform translate-x-2",
    "slide-up": "transform translate-y-2",
    "slide-right": "transform -translate-x-2",
    "slide-down": "transform -translate-y-2",
    "fade": "",
    "zoom-in": "transform scale-80",
    "zoom-out": "transform scale-110"
  }[animation ?? "fade"]

  const openTransformClasses: string = {
    "slide-left": "transform translate-x-0",
    "slide-up": "transform translate-y-0",
    "slide-right": "transform translate-x-0",
    "slide-down": "transform translate-y-0",
    "fade": "",
    "zoom-in": "transform scale-100",
    "zoom-out": "transform scale-100"
  }[animation ?? "fade"]

	type sizeClassesTypes = Record<Exclude<Props["width"], string|undefined>, string>
	const sizeClasses = (): sizeClassesTypes => {
		const validWidths = ['sm', 'md', 'lg', 'full', 'auto']
		if (!validWidths.includes(width)) {
			return typeof width === "string" ? width : "";
		}

		let validWidthSizes: sizeClassesTypes = {
			sm: "dropdown-sm w-48",
			md: "dropdown-md w-64",
			lg: "dropdown-lg w-80",
			full: "dropdown-full w-full start-0 end-0",
			auto: "dropdown-auto"
		}[width as Exclude<Props["width"], string|undefined>]

		return validWidthSizes
	}

  const getContainerClasses: string = twMerge(`theui-dropdown relative inline-block${animationClass(animationSpeed)}`, containerClasses)

  let getDropdownClasses = $derived(
    twMerge(
      `dropdown-content absolute list-none z-[11] bg-white dark:bg-secondary text-base shadow-lg py-1 text-nowrap
      ${sizeClasses()}
      ${align === "end" ? "start-auto end-0" : ""}
      ${roundedClass(rounded)}
      ${animation}
      ${animationClass(animationSpeed)}
      ${animationSpeed != "none" &&  transformClasses}`,
      (animationSpeed != "none" && open) && openTransformClasses,
      dropdownClasses
    )
  )

	let handleClick = $derived(() => {
    if(triggerEvent !== "hover"){
			open = !open
		}
	})

	let handleHover = $derived((e: Event) => {
    if(triggerEvent === "hover"){
      e.stopPropagation()
      if (e.type === "mouseenter" || e.type === "focus" || e.type === "touchstart") {
        open = true
      } else if (e.type === "mouseleave" || e.type === "touchend") {
        setTimeout(() => open = false, 200)
      }
    }
	})

  let handleKeyboard = (e: KeyboardEvent) => {
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

	let config: {
		activeItemClasses: string,
		itemClasses: string,
		dividerClass: string,
		headerClass: string
  } = {
    itemClasses: twMerge("flex text-wrap w-full items-center gap-4 py-3 px-4 bg-transparent hover:bg-gray-500/10 text-default cursor-pointer", itemClasses),
    activeItemClasses: twMerge("flex items-center gap-4 py-3 px-4 bg-gray-500/10", activeItemClasses),
    dividerClass: twMerge("border-b pb-2 mb-2 border-gray-300 dark:border-gray-700", dividerClasses),
    headerClass: twMerge("flex items-center gap-4 p-4 font-bold text-sm opacity-50 uppercase", headerClasses)
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
    aria-label={label + " dropdown"} aria-controls={`${id}-dropdown`} aria-expanded={open} aria-haspopup="menu"
    >
      {@html label}
      {@render arrow()}
    </Button>
  {:else}
    <span id={`theui-dropdown-trigger${id}`} class={`theui-dropdown-trigger ${buttonClasses}`}
    aria-label={label + " dropdown"} aria-controls={`${id}-dropdown`} aria-expanded={open} aria-haspopup="menu"
    role="button"
    tabindex="0">
      {@render label?.()}
      {@render arrow()}
    </span>
  {/if}

  {#if backdrop}
    <div class={backdropClasses(backdrop)} onclick={()=>handleClick()} aria-hidden="true"></div>
  {/if}

  <ul id={`${id}-dropdown`} class={getDropdownClasses} class:invisible={!open} class:opacity-0={!open} role="menu" aria-labelledby={`theui-dropdown-trigger${id}`}>
		{@render children?.()}
	</ul>
</div>