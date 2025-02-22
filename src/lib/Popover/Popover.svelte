<script lang="ts">
  import { onDestroy, onMount, tick, type Snippet } from "svelte"
  import { fade } from 'svelte/transition'
  import { computePosition, flip, shift, offset, arrow, type Placement } from "@floating-ui/dom"

  import { roundedClass, shadowClass } from "$lib/function"
	import type { ANIMATE_SPEED, ROUNDED, SHADOW } from "$lib/types"
	import { twMerge } from "tailwind-merge"

  interface Props {
    title?: Snippet,
    children: Snippet,
    trigger: string,
    gap?: number,
    position?: Placement,
    triggerEvent?: 'click'|'hover',
    animate?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    shadow?: SHADOW,
    closeOnClick?: boolean,
    titleClasses?: string,
    bodyClasses?: string,
    [key: string]: unknown,
  }

  let {
    title,
    children,
    trigger,
    gap = 8,
    position = "top",
    triggerEvent = "click",
    animate = "normal",
    rounded = "md",
    shadow = "lg",
    closeOnClick = false,
    titleClasses = "",
    bodyClasses = "",
    ...props
  }: Props = $props()

  const animationSpeed: Record<ANIMATE_SPEED, number> = {slower: 700, slow: 500, normal: 300, fast: 200, faster: 100, none: 0}

  let triggerElement: HTMLElement|null = $state(null)
  let popover: HTMLElement|null = $state(null)
  let ARROW: HTMLSpanElement|null = $state(null)
  let show: boolean = $state(false)

  async function updatePosition() {
    await tick()

    if (!(triggerElement && popover && ARROW)) return

    const { x, y, middlewareData, placement } = await computePosition(triggerElement as HTMLElement, popover, {
      placement: position,
      middleware: [flip(), shift(), offset(gap), arrow({ element: ARROW })],
    })

    popover.style.left = `${x}px`
    popover.style.top = `${y}px`

    if (middlewareData.arrow) {
      const {x: arrowX, y: arrowY} = middlewareData.arrow
      const [primaryPlacement, alignment] = placement.split('-')
      const staticSide = {top: 'bottom', right: 'left', bottom: 'top', left: 'right'}[primaryPlacement]

      let left = arrowX != null ? `${arrowX}px` : ''
      let top = arrowY != null ? `${arrowY}px` : ''

      if (alignment === 'start') {
        if (primaryPlacement === 'top' || primaryPlacement === 'bottom') {
          left = '15px'
        } else {
          top = '15px'
        }
      } else if (alignment === 'end') {
        if (primaryPlacement === 'top' || primaryPlacement === 'bottom') {
          left = 'calc(100% - 28px)'
        } else {
          top = 'calc(100% - 28px)'
        }
      }

      if(ARROW){
        Object.assign(ARROW.style, {left, top, right: '', bottom: '', [staticSide as string]: '-6px'})
      }
    }
  }

  let showPopover = () => {
    show = true
    requestAnimationFrame(updatePosition)
  }

  let hidePopover = () => show = false

  let handleClick = (el: HTMLElement) => {
    if (!el) return
    
    const isClickInsidePopover = popover?.contains(el)
    const isClickOnTrigger = triggerElement?.contains(el)

    if (show) {
      if (!closeOnClick && isClickInsidePopover) return
      hidePopover()
    } else if (isClickOnTrigger) {
      showPopover()
    }
  }

  onMount(() => {
    triggerElement = document.getElementById(trigger) as HTMLElement
    let clickedElement: EventTarget | null = null

    const handleDocumentClick = (event: Event) => clickedElement = event.target
    const handleTriggerClick = () => handleClick(clickedElement as HTMLElement)
    const handleTriggerBlur = () => handleClick(clickedElement as HTMLElement)

    if (triggerElement) {
      if (triggerEvent === "hover") {
        triggerElement.addEventListener('mouseenter', showPopover)
        triggerElement.addEventListener('mouseleave', hidePopover)
      } else if (triggerEvent === "click") {
        document.addEventListener('mousedown', handleDocumentClick)
        triggerElement.addEventListener('click', handleTriggerClick)
        triggerElement.addEventListener('blur', handleTriggerBlur)
      }
    }

    onDestroy(() => {
      if (triggerEvent === "click") {
        document.removeEventListener('mousedown', handleDocumentClick)
        triggerElement?.removeEventListener("click", handleTriggerClick)
        triggerElement?.removeEventListener("blur", handleTriggerBlur)
      } else {
        triggerElement?.removeEventListener('mouseleave', hidePopover)
        triggerElement?.removeEventListener('mouseenter', showPopover)
      }
    })
  })

  let popoverClasses = `border border-gray-100 max-w-80 bg-primary text-sm text-gray-500 ${roundedClass(rounded)} ${shadowClass(shadow)}`;

</script>

{#if show}
<div bind:this={popover} transition:fade={{duration: animationSpeed[animate]}} class="theui-popover absolute {twMerge(popoverClasses, props?.class as string)}">
  {#if title}
    <h4 class={twMerge("px-4 pt-4 pb-2 mb-2 font-bold border-b border-inherit", titleClasses)}>{@render title?.()}</h4>
  {/if}  
  <span bind:this={ARROW} class="absolute w-4 h-4 bg-inherit rotate-45"></span>
  <div class={twMerge("px-4 pb-4", bodyClasses)}>
    {@render children()}
  </div>
</div>
{/if}