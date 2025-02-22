<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte"
  import { fade } from 'svelte/transition'
  import { computePosition, flip, shift, offset, arrow, type Placement } from "@floating-ui/dom"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { roundedClass } from "$lib/function"

  interface Props{
    animate ?: ANIMATE_SPEED,
    position ?: Placement,
    triggerEvent ?: 'hover' | 'click' | string,
    rounded ?: ROUNDED,
    gap?: number,
    [key: string] : unknown
  }

  let{
    animate = "normal",
    position = "top",
    triggerEvent = "hover",
    rounded = "lg",
    gap = 12,
    ...props
  } : Props = $props()

  let trigger:      HTMLElement     | null = null
  let COMPONENT:    HTMLDivElement  | null = $state(null)
  let ARROW:        HTMLSpanElement | null = $state(null)
  let content:      string          | HTMLElement = $state("")
  let triggerStyle: string          = $state("")
  let show:         boolean         = $state(false)

  const animationSpeed: Record<ANIMATE_SPEED, number> = {slower: 700, slow: 500, normal: 300, fast: 200, faster: 100, none: 0}

  let defaultClasses =`theui-tooltip z-[60] absolute ${roundedClass(rounded)}`
  let customClasses = $derived(twMerge("pointer-events-none w-max whitespace-nowrap text-sm text-center px-3 py-2 bg-alt text-alt", props?.class as string, triggerStyle))

  let updatePosition = async () => {
    await tick()
    if (!(trigger && COMPONENT && ARROW)) return

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

      Object.assign(ARROW.style, {left, top, right: '', bottom: '', [staticSide as string]: '-4px'})
    }
  }

  let showTooltip = (event: MouseEvent) => {
    const target = event.target instanceof HTMLElement ? event.target.closest("[data-tooltip]") as HTMLElement : null
    if (!target) return

    trigger = target
    content = trigger.getAttribute("data-tooltip") || ""
    triggerStyle = trigger.getAttribute("data-tooltip-style") || ""

    if (content) {
      show = true
      updatePosition()
    }
  }

  let hideTooltip = () => {
    show = false
    trigger = null
  }

  onMount(() => {
    const elements = document.querySelectorAll("[data-tooltip]")

    if (triggerEvent === "click") {
      document.addEventListener("click", showTooltip, true)
      document.addEventListener("blur", hideTooltip, true)
    } else {
      elements.forEach(el => {
        (el as HTMLElement).addEventListener("mouseenter", showTooltip)
        el.addEventListener("mouseleave", hideTooltip)
      })
    }

    onDestroy(() => {
      if (triggerEvent === "click") {
        document.removeEventListener("click", showTooltip, true)
        document.removeEventListener("blur", hideTooltip, true)
      } else {
        const elements = document.querySelectorAll("[data-tooltip]")
        elements.forEach(el => {
          (el as HTMLElement).removeEventListener("mouseenter", showTooltip)
          el.removeEventListener("mouseleave", hideTooltip)
        })
      }
    })
  })
</script>

{#if show}
  <div bind:this={COMPONENT} transition:fade={{duration: animationSpeed[animate] as any}} class={defaultClasses +" "+ twMerge(customClasses, props?.class as string, triggerStyle)}>
    {@html content}
    <span bind:this={ARROW} class="absolute w-3 h-3 bg-inherit rotate-45"></span>
  </div>
{/if}