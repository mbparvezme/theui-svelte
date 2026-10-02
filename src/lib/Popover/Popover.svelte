<script lang="ts">
  import { onMount, tick, type Snippet } from "svelte"
  import { fade } from 'svelte/transition'
  import { computePosition, flip, shift, offset, arrow, autoUpdate, type Placement } from "@floating-ui/dom"
	import { twMerge } from "tailwind-merge"
	import type { ANIMATE_SPEED, ROUNDED, SHADOW } from "$lib/types"
  import { roundedClass, shadowClass, coreSpeed, coreShadow } from "$lib/function"

  interface Props {
    title?: string|Snippet,
    children: Snippet,
    trigger: string,
    position?: Placement,
    triggerEvent?: 'click'|'hover',
    gap?: number,
    animationSpeed?: ANIMATE_SPEED,
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
    animationSpeed = coreSpeed(),
    rounded = "md",
    shadow = coreShadow("lg"),
    closeOnClick = true,
    titleClasses = "",
    bodyClasses = "",
    ...props
  }: Props = $props()

  const popoverAnimationSpeed: Record<ANIMATE_SPEED, number> = {slower: 700, slow: 500, normal: 300, fast: 200, faster: 100, none: 0}

  let triggerElement: HTMLElement|null = $state(null)
  let popover: HTMLElement|null = $state(null)
  let arrowEl: HTMLSpanElement|null = $state(null)
  let show: boolean = $state(false)
  let cleanupAutoUpdate: (() => void) | undefined

  async function updatePosition() {
    if (!(triggerElement && popover && arrowEl)) return

    const { x, y, middlewareData, placement } = await computePosition(triggerElement as HTMLElement, popover, {
      placement: position,
      middleware: [flip(), shift(), offset(gap), arrow({ element: arrowEl })],
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

      if(arrowEl){
        Object.assign(arrowEl.style, {left, top, right: '', bottom: '', [staticSide as string]: '-6px'})
      }
    }
  }

  let showPopover = async () => {
    show = true
    await tick()
    await updatePosition()
    if (triggerElement && popover) {
      cleanupAutoUpdate = autoUpdate(triggerElement, popover, updatePosition)
    }
  }

  let hidePopover = () => {
    show = false
    cleanupAutoUpdate?.()
    cleanupAutoUpdate = undefined
  }

  const togglePopover = () => show ? hidePopover() : showPopover()

	let handleKeyboard = (e: KeyboardEvent) => {
    if(triggerEvent != "click") return

    if (show && e.code === "Escape") {
      e.preventDefault()
      hidePopover()
      return
    }
    if ((e.code === "Enter" || e.code === "Space") && document.activeElement === triggerElement) {
      e.preventDefault()
      togglePopover()
    }
	}

  // Click mode: runs after any click handler inside the popover content
  const handlePopoverClick = () => {
    if (closeOnClick) hidePopover()
  }

  // Click mode: close when keyboard focus moves out of the popover to an unrelated element
  const handlePopoverFocusout = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null
    if (!next || popover?.contains(next) || triggerElement?.contains(next)) return
    hidePopover()
  }

  onMount(() => {
    triggerElement = document.getElementById(trigger) as HTMLElement

    const handleDocumentMousedown = (e: MouseEvent) => {
      if (!show) return
      const target = e.target as Node
      if (popover?.contains(target) || triggerElement?.contains(target)) return
      hidePopover()
    }

    const handleTriggerClick = (e: MouseEvent) => {
      if (e.detail === 0) return // keyboard-generated click, handled in handleKeyboard
      togglePopover()
    }

    const handleTriggerBlur = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null
      // null: mouse down on non-focusable content - outside clicks are handled on mousedown
      if (!next || popover?.contains(next)) return
      hidePopover()
    }

    if (triggerElement) {
      triggerElement.setAttribute("aria-haspopup", "true")
      triggerElement.setAttribute("aria-controls", `${trigger}-popover`)
      triggerElement.setAttribute("tabIndex", "0")

      if (triggerEvent === "hover") {
        triggerElement.addEventListener('mouseenter', showPopover)
        triggerElement.addEventListener('mouseleave', hidePopover)
        triggerElement.addEventListener("focus", showPopover)
        triggerElement.addEventListener("blur", hidePopover)
      } else if (triggerEvent === "click") {
        document.addEventListener('mousedown', handleDocumentMousedown)
        triggerElement.addEventListener('click', handleTriggerClick)
        triggerElement.addEventListener('blur', handleTriggerBlur)
      }
    }

    return () => {
      cleanupAutoUpdate?.()
      if (triggerEvent === "click") {
        document.removeEventListener('mousedown', handleDocumentMousedown)
        triggerElement?.removeEventListener("click", handleTriggerClick)
        triggerElement?.removeEventListener("blur", handleTriggerBlur)
      } else {
        triggerElement?.removeEventListener('mouseleave', hidePopover)
        triggerElement?.removeEventListener('mouseenter', showPopover)
        triggerElement?.removeEventListener("focus", showPopover)
        triggerElement?.removeEventListener("blur", hidePopover)
      }
    }
  })

  const popoverClasses = $derived(`max-w-80 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 ${title ? "" : "pt-4"}${roundedClass(rounded)} ${shadowClass(shadow)}`)
</script>

<svelte:body onkeydown={(e)=>handleKeyboard(e)}></svelte:body>

{#if show}
<div
  {...props}
  id={trigger + "-popover"}
  bind:this={popover}
  transition:fade={{duration:popoverAnimationSpeed[animationSpeed]}}
  class="theui-popover absolute {twMerge(popoverClasses, props?.class as string)}"
  aria-live="polite"
  role={triggerEvent === "hover" ? "tooltip" : "dialog"}
  onclick={triggerEvent === "click" ? handlePopoverClick : undefined}
  onfocusout={triggerEvent === "click" ? handlePopoverFocusout : undefined}
>
  {#if title}
    {#if typeof title === "function"}
      <div class={twMerge("px-4 pt-4 pb-2 mb-2 font-bold border-b border-inherit", titleClasses)}>{@render title?.()}</div>
    {:else}
      <h4 class={twMerge("px-4 pt-4 pb-1 mb-1 font-bold border-b border-inherit", titleClasses)}>{title}</h4>
    {/if}
  {/if}  
  <div class={twMerge("px-4 pb-4", bodyClasses)}>
    {@render children()}
  </div>
  <span bind:this={arrowEl} class="absolute w-4 h-4 bg-inherit rotate-45"></span>
</div>
{/if}
