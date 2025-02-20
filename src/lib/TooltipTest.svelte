<script lang="ts">
  import { onMount, tick } from "svelte"
  import { fade, scale } from 'svelte/transition'
  import { computePosition, flip, shift, offset, arrow, type Placement } from "@floating-ui/dom"
  import type { ANIMATE_SPEED, ROUNDED, ENTRANCE_ANIMATION } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass } from "$lib/function"

  interface Props{
    animate ?: ANIMATE_SPEED,
    animation ?: "fade" | "scale",
    position ?: Placement,
    triggerEvent ?: 'hover' | 'click' | string,
    rounded ?: ROUNDED,
    gap?: number,
    showArrow?: boolean,
    [key: string] : unknown // class
  }

  let{
    animate = "normal",
    animation = "fade",
    position = "top",
    triggerEvent = "hover",
    rounded = "full",
    gap = 8,
    showArrow = true,
    ...props
  } : Props = $props()

  let trigger: HTMLElement | null = null
  let COMPONENT: HTMLDivElement|null = $state(null)
  let ARROW: HTMLElement | null = $state(null)
  let content: string|HTMLElement = $state("")
  let triggerStyle: string = $state("")
  let show = $state(false)

  const animationSpeed: Record<ANIMATE_SPEED, number> = {
    slower: 700,
    slow: 500,
    normal: 300,
    fast: 200,
    faster: 100,
    none: 0
  }

  let arrowStyle = ""

  let defaultClasses = $derived(`theui-tooltip z-[60] absolute ${roundedClass(rounded)} ${show ? "opacity-100" : "opacity-0"}`)
  let customClasses = `min-w-[100px] pointer-events-none w-max whitespace-nowrap text-sm text-center px-3 py-2 bg-alt text-alt`

  async function updatePosition() {
    await tick()
    if (!trigger || !COMPONENT || !ARROW) return

    const { x, y, middlewareData, placement } = await computePosition(trigger, COMPONENT, {
      placement: trigger?.dataset.tooltipPosition as Placement ?? position,
      middleware: [flip(), shift(), offset(gap), arrow({ element: ARROW })],
    })

    COMPONENT.style.left = `${x}px`
    COMPONENT.style.top = `${y}px`

    if (middlewareData.arrow) {
      const {x: arrowX, y: arrowY} = middlewareData.arrow
      const [primaryPlacement, alignment] = placement.split('-')
      const staticSide = {top: 'bottom', right: 'left', bottom: 'top', left: 'right'}[primaryPlacement]

      let left = arrowX != null ? `${arrowX}px` : ''
      let top = arrowY != null ? `${arrowY}px` : ''

      if (alignment === 'start') {
        if (primaryPlacement === 'top' || primaryPlacement === 'bottom') {
          left = '13px'
        } else {
          top = '13px'
        }
      } else if (alignment === 'end') {
        if (primaryPlacement === 'top' || primaryPlacement === 'bottom') {
          left = 'calc(100% - 24px)'
        } else {
          top = 'calc(100% - 24px)'
        }
      }

      Object.assign(ARROW.style, {left, top, right: '', bottom: '', [staticSide as string]: '-4px'})
    }
  }

  function showTooltip(event: MouseEvent) {
    const target = event.target instanceof HTMLElement ? event.target : null
    if (!target) return

    trigger = target
    content = trigger.getAttribute("data-tooltip") || ""
    triggerStyle = trigger.getAttribute("data-tooltip-style") || ""

    if (content) {
      show = true
      updatePosition()
    }
  }

  function hideTooltip() {
    show = false
    trigger = null
  }

  onMount(() => {
    if (triggerEvent == "click") {
      document?.addEventListener("click", showTooltip, true)
      document?.addEventListener("blur", hideTooltip, true)
    } else {
      document?.addEventListener("mouseenter", showTooltip, true)
      document?.addEventListener("mouseleave", hideTooltip, true)
    }
  })
</script>

{#if show}
  <div bind:this={COMPONENT} class={defaultClasses +" "+ twMerge(customClasses, props?.class as string, triggerStyle)} transition:fade={{
      duration: animationSpeed[animate] as any,
      delay: 0
    }}>
    {@html content}

    {#if showArrow}
      <div bind:this={ARROW} class="absolute w-3 h-3 bg-gray-800 rotate-45" style={arrowStyle}></div>
    {/if}
  </div>
{/if}