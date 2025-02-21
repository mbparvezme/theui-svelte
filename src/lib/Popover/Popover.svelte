<script lang="ts">
  import { onDestroy, onMount, tick, type Snippet } from "svelte"
  import { fade } from 'svelte/transition'
  import { computePosition, flip, shift, offset, arrow, type Placement } from "@floating-ui/dom"

  import { animationClass, roundedClass, shadowClass } from "$lib/function"
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
    animate = "slower",
    rounded = "md",
    shadow = "lg",
    closeOnClick = true,
    titleClasses = "",
    bodyClasses = "",
    ...props
  }: Props = $props()


  let triggerElement: HTMLElement|null = $state(null)
  let popover: HTMLElement|null = $state(null)
  let ARROW: HTMLSpanElement|null = $state(null)
  let show: boolean = $state(false)

  async function updatePosition() {
    await tick()

    if (!triggerElement || !popover || !ARROW) return

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

      Object.assign(ARROW.style, {left, top, right: '', bottom: '', [staticSide as string]: '-6px'})
    }
  }

  function showPopover() {
    show = true
    updatePosition()
  }

  function hidePopover() {
    show = false
    triggerElement = null
  }

  let handleClick = (el: HTMLElement) => {
    if (!popover) return;
    if(show){
      if (!closeOnClick && (popover.contains(el))) return;
      hidePopover()
    }else{
      showPopover()
    }
  }

  onMount(() => {
    triggerElement = document.getElementById(trigger) as HTMLElement

    if (trigger && popover) {
      if(triggerEvent == "hover"){
        triggerElement.addEventListener('mouseenter', () => showPopover())
        triggerElement.addEventListener('mouseleave', () => hidePopover())
      }
      if(triggerEvent == "click"){
        let clickedElement: EventTarget | null = null;
        document.addEventListener('mousedown', (event) => clickedElement = event.target)

        triggerElement.addEventListener('click', () => handleClick(clickedElement as HTMLElement))
        triggerElement.addEventListener('blur', () => handleClick(clickedElement as HTMLElement))
      }
    }
  })

  let popoverClasses = `border max-w-80 border bg-primary overflow-hidden ${roundedClass(rounded)}${animationClass(animate, "opacity")}${shadowClass(shadow)}`
</script>

<div bind:this={popover} class="theui-popover absolute {twMerge(popoverClasses, shadowClass(shadow), props?.class as string)}" class:hidden={!show}>
  {#if title}
    <h4 class={twMerge("px-4 pt-4 pb-2 mb-2 font-bold border-b border-inherit", titleClasses)}>{@render title?.()}</h4>
  {/if}  
  <span bind:this={ARROW} class="absolute w-4 h-4 bg-inherit rotate-45"></span>
  <div class={twMerge("px-4 pb-4", bodyClasses)}>
    {@render children()}
  </div>
</div>