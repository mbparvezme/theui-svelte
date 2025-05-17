<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { animationClass, roundedClass, generateToken, backdropClasses } from "$lib/function"
  import { twMerge } from "tailwind-merge"
  import { Button } from "$lib"

  type DROPDOWN_ANIMATION_TYPE = 'slide-left' | 'slide-up' | 'slide-right' | 'slide-down' | 'fade' | 'zoom-in' | 'zoom-out'

  interface Props {
    children?: Snippet,
    align?: 'start' | 'end'
    animationSpeed?: ANIMATE_SPEED,
    animation?: DROPDOWN_ANIMATION_TYPE,
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
    dropdownEvent?: 'hover' | 'click',
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
    backdrop = false,
    closeOnBlur = true,
    activeItemClasses = "",
    itemClasses = "",
    dividerClasses = "",
    headerClasses = "",
    containerClasses = "",
    dropdownClasses = "",
		buttonClasses = "",
    id = generateToken(),
    dropdownEvent = 'click',
    label,
    rounded = "md",
    width = "md",
		...props
  } : Props = $props()

	let open: boolean = $state(false)

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

	let toggleClick = $derived(() => {
    if(dropdownEvent !== "hover"){
			// let currentDD = document.getElementById(id)
			// open = !currentDD?.classList.contains('open')
			open = !open
		}
	})

	let handleMouse = $derived((e: MouseEvent) => {
    if(dropdownEvent === "hover"){
			e.preventDefault()
			open = !open
		}
	})

	let handleKeyboard = $derived((e: KeyboardEvent) => {
		e.preventDefault()
		if (e.code === "Escape" || e.code === "ArrowUp") {
			open = false
		}
		if (e.code === "ArrowDown") {
			open = true
		}
		if (e.code === "Space") {
			open = !open
		}
	})

	let handleBlur = $derived((e: MouseEvent) => {
		if (closeOnBlur && open && e.target instanceof Element && !e.target.closest("#"+id)) {
			open = false
		}
	})

	const getContainerClasses: string = twMerge(`theui-dropdown relative inline-block${animationClass(animationSpeed)}`, containerClasses)

  const getDropdownClasses = $derived(
		twMerge(
			`dropdown-content absolute list-none z-[11] bg-white dark:bg-secondary text-base shadow-lg py-1 text-nowrap ${animation} ${sizeClasses()} ${transformClasses} ${align === "end" ? "start-auto end-0" : ""}${animationClass(animationSpeed)}${roundedClass(rounded)}`,
			open && openTransformClasses,
			dropdownClasses
		)
	)

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

<svelte:window onclick={(e: MouseEvent)=>handleBlur(e)} />

<div {id} {...props} class={getContainerClasses} onmouseenter={(e: MouseEvent)=>handleMouse(e)} onmouseleave={(e: MouseEvent)=>handleMouse(e)} onclick={()=>toggleClick()} onkeydown={(e: KeyboardEvent)=>handleKeyboard(e)} aria-labelledby={`${id}-trigger`}>
  {#if typeof label == "string"}
    <Button id={`${id}-trigger`} ariaLabel={label + " dropdown"} aria-controls={`${id}-dropdown`} aria-expanded={open} aria-haspopup="menu" class={buttonClasses}>{label}</Button>
  {:else}
    <span id={`${id}-trigger`} class="relative dropdown-btn select-none" role="button" aria-controls={`${id}-dropdown`} aria-expanded={open} aria-haspopup="menu">
      {@render label?.()}
    </span>
  {/if}

  {#if backdrop}
    <div class={backdropClasses(backdrop)} onclick={()=>toggleClick()} aria-hidden="true"></div>
  {/if}

  <ul id={`${id}-dropdown`} class={getDropdownClasses} class:invisible={!open} class:opacity-0={!open} role="menu" aria-labelledby={`${id}-trigger`}>
		{@render children?.()}
	</ul>
</div>