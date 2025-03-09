<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte"
  import { fade, type FadeParams } from 'svelte/transition'
  import { page } from '$app/state'
  import { browser } from '$app/environment'
  import { computePosition, flip, shift, offset, arrow, type Placement } from "@floating-ui/dom"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { generateToken, roundedClass } from "$lib/function"

  interface Props{
    position ?: Placement,
    triggerEvent ?: 'hover' | 'click',
    animate ?: ANIMATE_SPEED,
    rounded ?: ROUNDED,
    gap?: number,
    [key: string] : unknown
  }

  let{
    position = "top",
    triggerEvent = "hover",
    animate = "normal",
    rounded = "lg",
    gap = 12,
    ...props
  } : Props = $props()

  const animationSpeed: Record<ANIMATE_SPEED, number> = {slower: 700, slow: 500, normal: 300, fast: 200, faster: 100, none: 0}
  let trigger:      HTMLElement     | null = null
  let COMPONENT:    HTMLDivElement  | null = $state(null)
  let ARROW:        HTMLSpanElement | null = $state(null)
  let content:      string          | HTMLElement = $state("")
  let triggerStyle: string          = $state("")
  let show:         boolean         = $state(false)
  let animObj: FadeParams|undefined = $state(undefined)

  let url: string = ""

  const calculateGap = () => Math.max(Number(trigger?.dataset?.tooltipGap) || gap, 8)

  let updatePosition = async () => {
    await tick()
    if (!(trigger && COMPONENT && ARROW)) return

    const { x, y, middlewareData, placement } = await computePosition(trigger, COMPONENT, {
      placement: trigger?.dataset.tooltipPosition as Placement ?? position,
      middleware: [flip(), shift(), offset(calculateGap()), arrow({ element: ARROW })],
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

  let showTooltip = (event: Event) => {
    const target = event.target instanceof HTMLElement ? event.target.closest("[data-tooltip]") as HTMLElement : null
    if (!target) return

    trigger = target
    animObj = {duration: animationSpeed[trigger?.getAttribute("data-tooltip-animate") as ANIMATE_SPEED || animate] as any}
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

	let handleKeyboard = (e: KeyboardEvent) => {
    if (show && e.code === "Escape") {
      e.preventDefault()
      hideTooltip()
    }
    if(!show && e.code === "Enter" || e.code === "Space"){
      showTooltip(e)
    }
	}

  let attachEventListeners = () => {
    if(!browser) return
    const elements = document.querySelectorAll("[data-tooltip]");
    elements.forEach((el) => {
      const eventType = el.getAttribute("data-tooltip-event") || "hover";

      if (eventType === "click") {
        el.addEventListener("click", showTooltip);
        el.addEventListener("blur", hideTooltip);
      } else {
        el.addEventListener("mouseenter", showTooltip);
        el.addEventListener("mouseleave", hideTooltip);
        el.addEventListener("focus", showTooltip);
        el.addEventListener("blur", hideTooltip);
      }
    });
  }

  let removeEventListeners = () => {
    if(!browser) return
    const elements = document.querySelectorAll("[data-tooltip]");
    elements.forEach((el) => {
      const eventType = el.getAttribute("data-tooltip-event") || "hover";

      if (eventType === "click") {
        el.removeEventListener("click", showTooltip);
        el.removeEventListener("blur", hideTooltip);
      } else {
        el.removeEventListener("mouseenter", showTooltip);
        el.removeEventListener("mouseleave", hideTooltip);
        el.removeEventListener("focus", showTooltip);
        el.removeEventListener("blur", hideTooltip);
      }
    });
  }

  onMount(() => {
    trigger?.setAttribute("aria-haspopup", "true")
    trigger?.setAttribute("aria-controls", `${generateToken()}`)
    attachEventListeners()
  })

  onDestroy(() => removeEventListeners())

  if(url != page.url.pathname){
    attachEventListeners()
    url = page.url.pathname
  }

  let customClasses = $derived(twMerge("pointer-events-none w-max whitespace-nowrap text-sm text-center px-3 py-2 bg-alt dark:bg-gray-800 text-alt dark:text-default", props?.class as string, triggerStyle))
  const classes = () => `theui-tooltip z-[60] absolute ${customClasses}${roundedClass(trigger?.dataset.tooltipRounded as ROUNDED || rounded)}`
</script>

<svelte:body onkeydown={(e)=>handleKeyboard(e)}></svelte:body>

{#if show}
  <div bind:this={COMPONENT} transition:fade={animObj} class={classes()}>
    {@html content}
    <span bind:this={ARROW} class="absolute w-3 h-3 bg-inherit rotate-45"></span>
  </div>
{/if}