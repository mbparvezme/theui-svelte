<script lang="ts">
  import { onMount, tick } from "svelte"
  import { fade, type FadeParams } from 'svelte/transition'
  import { computePosition, flip, shift, offset, arrow, type Placement } from "@floating-ui/dom"
  import { twMerge } from "tailwind-merge"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { roundedClass, sanitize, coreSpeed } from "$lib/function"

  interface Props {
    position?: Placement
    triggerEvent?: 'hover' | 'click'
    animationSpeed?: ANIMATE_SPEED
    rounded?: ROUNDED
    gap?: number
    [key: string]: unknown
  }

  let {
    position = "top",
    triggerEvent = "hover",
    animationSpeed = coreSpeed(),
    rounded = "lg",
    gap = 12,
    ...props
  }: Props = $props()

  const tooltipAnimationSpeed: Record<ANIMATE_SPEED, number> = {
    slower: 700,
    slow: 500,
    normal: 300,
    fast: 200,
    faster: 100,
    none: 0
  }

  // State
  let trigger: HTMLElement | null = $state(null)
  let COMPONENT: HTMLDivElement | null = $state(null)
  let ARROW: HTMLSpanElement | null = $state(null)
  let content: string= $state("")
  let triggerStyle: string = $state("")
  let show: boolean = $state(false)
  let animObj: FadeParams | undefined = $state(undefined)

  // Derived classes
  let customClasses = $derived(twMerge(
    "pointer-events-none w-max whitespace-nowrap text-sm text-center px-3 py-2 bg-alt dark:bg-gray-700 text-alt dark:text-default",
    props?.class as string,
    triggerStyle
  ))

  const classes = $derived(`theui-tooltip z-600 absolute ${customClasses} ${roundedClass(((trigger as HTMLElement | null)?.dataset?.tooltipRounded as ROUNDED) || rounded)}`)

  const calculateGap = () => Math.max(Number(trigger?.dataset?.tooltipGap) || gap, 8)

  const updatePosition = async () => {
    await tick()
    if (!(trigger && COMPONENT && ARROW)) return

    const { x, y, middlewareData, placement } = await computePosition(trigger, COMPONENT, {
      placement: trigger?.dataset.tooltipPosition as Placement ?? position,
      middleware: [flip(), shift(), offset(calculateGap()), arrow({ element: ARROW })],
    })

    Object.assign(COMPONENT.style, {
      left: `${x}px`,
      top: `${y}px`
    })

    if (middlewareData.arrow) {
      const {x: arrowX, y: arrowY} = middlewareData.arrow
      const [primaryPlacement] = placement.split('-')
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[primaryPlacement]

      Object.assign(ARROW.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        [staticSide as string]: '-4px'
      })
    }
  }

  const showTooltip = (element: HTMLElement) => {
    trigger = element
    if (element.id) element.setAttribute('aria-describedby', `${element.id}-tooltip`)
    animObj = {
      duration: tooltipAnimationSpeed[element.dataset.tooltipAnimationSpeed as ANIMATE_SPEED || animationSpeed]
    }

    content = sanitize(element.dataset.tooltip || "")
    triggerStyle = element.dataset.tooltipStyle || ""

    if (content) {
      show = true
      updatePosition()
    }
  }

  const hideTooltip = () => {
    if (trigger?.id) trigger.removeAttribute('aria-describedby')
    trigger = null
    show = false
  }

  const handleKeyboard = (e: KeyboardEvent) => {
    if (!show) return
    if (e.key === "Escape") {
      e.preventDefault()
      hideTooltip()
    }
  }

  const handleTooltipEvent = (e: MouseEvent | FocusEvent | Event) => {
    const target = e.target as HTMLElement | Element | null
    if (!target || !('closest' in target)) return

    const tooltipElement = target?.closest('[data-tooltip]')

    if (!tooltipElement) {
      if (show) hideTooltip()
      return
    }

    const element = tooltipElement as HTMLElement
    const eventType = element.dataset.tooltipEvent || triggerEvent

    switch (e.type) {
      case 'pointerenter':
      case 'focusin':
        if (eventType !== 'click') showTooltip(element)
        break
      
      case 'click':
        if (eventType !== 'click') break
        // Toggle, so Enter/Space (which fire click) can also close it
        if (show && trigger === element) hideTooltip()
        else showTooltip(element)
        break
      
      case 'pointerleave':
        if (eventType !== 'click') hideTooltip()
        break

      case 'focusout': {
        const fe = e as FocusEvent
        const stayedInTrigger = fe.relatedTarget && element.contains(fe.relatedTarget as Node)
        const stayedInTooltip = COMPONENT?.contains(fe.relatedTarget as Node)
        if (!stayedInTrigger && !stayedInTooltip) hideTooltip()
        break
      }
    }
  }

  onMount(() => {
    if (typeof window === "undefined") return

    // Add event listeners with capture to catch events during propagation
    const events = ['pointerenter', 'pointerleave', 'focusin', 'focusout', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleTooltipEvent, true)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleTooltipEvent, true)
      })
    }
  })
</script>

<svelte:body on:keydown={handleKeyboard} />

{#if show}
  <div
    {...props}
    bind:this={COMPONENT}
    transition:fade={animObj}
    class={classes}
    role="tooltip"
    id={trigger?.id ? `${trigger.id}-tooltip` : undefined}
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html content}
    <span
      bind:this={ARROW}
      class="absolute w-3 h-3 bg-inherit rotate-45"
      aria-hidden="true"
    ></span>
  </div>
{/if}