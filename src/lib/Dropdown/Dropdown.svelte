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
    animation = "slide-up",
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

  const sizeClasses = () => {
		const validWidths = ['sm', 'md', 'lg', 'full', 'auto'];
		if (!validWidths.includes(width)) {
			return typeof width === "string" ? width : "";
		}

		let validWidthSizes: Record<Exclude<Props["width"], string|undefined>, string>  = { 
			sm: "dropdown-sm w-48",
			md: "dropdown-md w-64",
			lg: "dropdown-lg w-80",
			full: "dropdown-full w-full start-0 end-0",
			auto: "dropdown-auto"
		}

		return validWidthSizes[width as Exclude<Props["width"], string|undefined>]
	}

	let isOpen: boolean = $state(false)

	let toggle = $derived(() => {
    if(dropdownEvent !== "hover"){
			let currentDD = document.getElementById(id)
			isOpen = !currentDD?.classList.contains('open')
		}
	})

	let handleMouse = $derived((e: MouseEvent) => {
    if(dropdownEvent === "hover"){
			e.preventDefault()
			isOpen = !isOpen
		}
	})

	let handleKeyboard = $derived((e: KeyboardEvent) => {
		e.preventDefault()
		if (e.code === "Escape" || e.code === "ArrowUp") {
			isOpen = false
		}
		if (e.code === "ArrowDown") {
			isOpen = true
		}
	})

	let handleBlur = $derived((e: MouseEvent) => {
		let currentDD = document.getElementById(id)
		if (closeOnBlur && currentDD?.classList.contains('open') && e.target instanceof Element && !e.target.closest("#"+id)) {
			isOpen = false
		}
	})

	const getContainerClasses = () => twMerge(`theui-dropdown relative inline-block ${animationClass(animationSpeed)}`, containerClasses)

  const getDropdownClasses = () => {
    return twMerge(`${animation} dropdown-content absolute list-none z-[11] bg-white dark:bg-secondary text-base shadow-lg py-1 text-nowrap ${sizeClasses()} ${align === "end" ? "start-auto end-0" : ""}${animationClass(animationSpeed)}${roundedClass(rounded)}`, dropdownClasses)
  }

	let config: {
		activeItemClasses: string,
		itemClasses: string,
		dividerClass: string,
		headerClass: string
  } = {
    itemClasses: twMerge("flex text-wrap w-full items-center gap-4 py-3 px-4 bg-transparent hover:bg-gray-500/10 text-default", itemClasses),
    activeItemClasses: twMerge("flex items-center gap-4 py-3 px-4 bg-gray-500/10", activeItemClasses),
    dividerClass: twMerge("border-b pb-2 mb-2 border-gray-300 dark:border-gray-700", dividerClasses),
    headerClass: twMerge("flex items-center gap-4 p-4 font-bold text-sm opacity-50 uppercase", headerClasses)
  }
	setContext('DROPDOWN_CTX', config)
</script>

<svelte:window onclick={(e: MouseEvent)=>handleBlur(e)} />

<div {id} {...props} class={getContainerClasses()} class:open={isOpen} onmouseenter={(e: MouseEvent)=>handleMouse(e)} onmouseleave={(e: MouseEvent)=>handleMouse(e)} onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboard(e)} aria-labelledby={`${id}-trigger`}>
  {#if typeof label == "string"}
    <Button id={`${id}-trigger`} ariaLabel={label + " dropdown"} aria-controls={`${id}-dropdown`} aria-expanded={isOpen} aria-haspopup="menu" class={buttonClasses}>{label}</Button>
  {:else}
    <span id={`${id}-trigger`} class="relative dropdown-btn select-none" role="button" aria-controls={`${id}-dropdown`} aria-expanded={isOpen} aria-haspopup="menu">
      {@render label?.()}
    </span>
  {/if}

  {#if backdrop}
    <div class={backdropClasses(backdrop)} onclick={()=>toggle()} aria-hidden="true"></div>
  {/if}

  <ul id={`${id}-dropdown`} class={getDropdownClasses()} role="menu" aria-labelledby={`${id}-trigger`}>
		{@render children?.()}
	</ul>
</div>

<style lang="postcss">
  .theui-dropdown .backdrop{
    @apply z-10;
  }
  .dropdown-content{
    @apply z-[11];
  }
	/* Dropdown visibility */
	.theui-dropdown .dropdown-content,.theui-dropdown .backdrop{
		@apply invisible opacity-0;
	}
	.theui-dropdown.open .dropdown-content,.theui-dropdown.open .backdrop{
		@apply visible opacity-100;
	}
	/* Dropdown animations */
	.theui-dropdown .dropdown-content.slide-down{
		@apply -translate-y-2;
	}
	.theui-dropdown .dropdown-content.slide-up{
		@apply translate-y-2;
	}
	.theui-dropdown.open .dropdown-content.slide-down, .theui-dropdown.open .dropdown-content.slide-up{
		@apply translate-y-0;
	}
	.theui-dropdown .dropdown-content.slide-left{
		@apply translate-x-2;
	}
	.theui-dropdown .dropdown-content.slide-right{
		@apply -translate-x-2;
	}
	.theui-dropdown.open .dropdown-content.slide-left, .theui-dropdown.open .dropdown-content.slide-right{
		@apply translate-x-0;
	}
	.theui-dropdown .dropdown-content.zoom-in{
		@apply scale-75;
	}
	.theui-dropdown .dropdown-content.zoom-out{
		@apply scale-110;
	}
	.theui-dropdown.open .dropdown-content.zoom-in, .theui-dropdown.open .dropdown-content.zoom-out{
		@apply scale-100;
	}
</style>