<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, BTN_QAB_CTX } from "$lib/types"
  import { fly } from "svelte/transition"
  import { setContext, type Snippet } from "svelte"
  import { generateToken, coreSpeed } from "$lib/function"
  import { twMerge } from "tailwind-merge"
  import { QabItem, Svg } from "$lib"

  interface Props {
    children?: Snippet,
    icon?: Snippet,
    align?: 'start' | 'end',
    size?: BTN_QAB_CTX['size'],
    direction?: 'horizontal' | 'vertical',
    triggerEvent?: 'click' | 'hover',

    href?: string,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,

    color ?: BTN_QAB_CTX['color'],
    theme ?: BTN_QAB_CTX['theme'],
    gradientColor ?: BTN_QAB_CTX['gradientColor'],
    
    ariaLabel ?: string,
    iconClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    icon,
    animationSpeed = coreSpeed(),
    align = "end",
    size = "md",
    rounded = "full",
    href, 
    triggerEvent = "click",
    iconClasses,
    direction = "vertical",
    theme = "default",
    color = "brand",
    gradientColor = "brand",
    ariaLabel = "Quick Action Button",
    ...props
  } : Props = $props()

  const id: string = generateToken()

  let visible = $state(false)

  let animSpeed: Record<ANIMATE_SPEED, number> = {
    none: 0,
    slower: 700,
    slow: 500,
    normal: 300,
    fast: 150,
    faster: 100,
  }

  let animObj = $derived({
    horizontal: {
      end: { x: 16, duration: animSpeed[animationSpeed] },
      start: { x: -16, duration: animSpeed[animationSpeed] },
    },
    vertical: {
      end: { y: 16, duration: animSpeed[animationSpeed] },
      start: { y: 16, duration: animSpeed[animationSpeed] },
    },
  })

  const triggerPosition = {start: "start-6 bottom-6", end: "end-6 bottom-6"}

  const qabSize = {sm: "w-12 h-12", md: "w-14 h-14", lg: "w-16 h-16", xl: "w-20 h-20"}

  const optionPosition = {
    start: {
      horizontal: {
        sm: "start-20 bottom-7 space-x-2",
        md: "start-22 bottom-7 space-x-2",
        lg: "start-26 bottom-7 space-x-3",
        xl: "start-32 bottom-8 space-x-4",
      },
      vertical: {
        sm: "start-7 bottom-20 space-y-2",
        md: "start-7 bottom-22 space-y-2",
        lg: "start-7 bottom-26 space-y-3",
        xl: "start-8 bottom-32 space-y-4",
      }
    },
    end: {
      horizontal: {
        sm: "end-20 bottom-7 space-x-2",
        md: "end-22 bottom-7 space-x-2",
        lg: "end-26 bottom-7 space-x-3",
        xl: "end-32 bottom-8 space-x-4",
      },
      vertical: {
        sm: "end-7 bottom-20 space-y-2",
        md: "end-7 bottom-22 space-y-2",
        lg: "end-7 bottom-26 space-y-3",
        xl: "end-8 bottom-32 space-y-4",
      }
    }
  }

  const directionClasses = {horizontal: "flex-row", vertical: "flex-col"}

  const itemsId = `${id}-items`
  let itemsEl: HTMLDivElement | null = $state(null)
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let skipFocusOpen = false // Escape returns focus to the main button without reopening in hover mode

  // Runs a handler the user passed (e.g. onclick) after the internal one
  const callUserHandler = (name: string, e: Event) => {
    const fn = props?.[name]
    if (typeof fn === "function") fn(e)
  }

  const isInsideQab = (node: EventTarget | null) =>
    node instanceof Node && (!!document.getElementById(id)?.contains(node) || !!itemsEl?.contains(node))

	const handleClick = (e: MouseEvent) => {
    if(triggerEvent == "click" && !props?.disabled){
      visible = !visible
    }
    callUserHandler("onclick", e)
	}

  // Hover mode: open on enter; close after a short delay so the pointer can cross the gap to the items
  const openOnHover = () => {
    if (triggerEvent !== "hover" || props?.disabled) return
    clearTimeout(hideTimer)
    visible = true
  }

  const closeOnHover = () => {
    if (triggerEvent !== "hover") return
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => visible = false, 150)
  }

  // Hover mode, keyboard: close when focus leaves both the main button and the items
  const closeOnFocusOut = (e: FocusEvent) => {
    if (triggerEvent !== "hover" || isInsideQab(e.relatedTarget)) return
    visible = false
  }

  // Getters keep the items in sync when these props change after mount
  const QAB_CTX: BTN_QAB_CTX = {
    get size() { return size },
    get rounded() { return rounded },
    get iconClasses() { return iconClasses },
    get theme() { return theme },
    get color() { return color },
    get gradientColor() { return gradientColor },
  }

  setContext('QAB', QAB_CTX)

  $effect(() => {
    if (!visible) return
    function onClick(e: MouseEvent) {
      if (e.target instanceof Element && !e.target.closest(`#${id}`)) {
        visible = false
      }
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key !== "Escape") return
      visible = false
      if (itemsEl?.contains(document.activeElement)) {
        skipFocusOpen = true
        document.getElementById(id)?.focus()
      }
    }
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKeydown)
    }
  })

  // The items container keeps the QAB open while hovered or focused
  $effect(() => {
    if (!itemsEl) return
    const el = itemsEl
    el.addEventListener('mouseenter', openOnHover)
    el.addEventListener('mouseleave', closeOnHover)
    el.addEventListener('focusout', closeOnFocusOut)
    return () => {
      el.removeEventListener('mouseenter', openOnHover)
      el.removeEventListener('mouseleave', closeOnHover)
      el.removeEventListener('focusout', closeOnFocusOut)
    }
  })

  $effect(() => () => clearTimeout(hideTimer))
</script>

<QabItem
  {...props}
  {id}
  {ariaLabel}
  {href}
  disabled={props?.disabled}
  aria-expanded={children && !href ? visible : undefined}
  aria-controls={children && !href && visible ? itemsId : undefined}
  class="theui-qab fixed {twMerge(`${triggerPosition[align]} ${qabSize[size]}`, props?.class as string)}"
  onclick={(e: MouseEvent) => handleClick(e)}
  onmouseenter={(e: MouseEvent) => { openOnHover(); callUserHandler("onmouseenter", e) }}
  onmouseleave={(e: MouseEvent) => { closeOnHover(); callUserHandler("onmouseleave", e) }}
  onfocus={(e: FocusEvent) => { if (!skipFocusOpen) openOnHover(); skipFocusOpen = false; callUserHandler("onfocus", e) }}
  onfocusout={(e: FocusEvent) => { closeOnFocusOut(e); callUserHandler("onfocusout", e) }}
>
  {#if icon}
    {@render icon()}
  {:else}
    <Svg class="w-[60%] h-[60%]">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </Svg>
  {/if}
</QabItem>

{#if children && visible}
  <div id={itemsId} bind:this={itemsEl} class="theui-qab-items flex fixed {optionPosition[align][direction][size]} {directionClasses[direction]}" in:fly={animObj[direction][align]}>
    {@render children?.()}
  </div>
{/if}
