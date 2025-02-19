<script lang="ts">
  import { onMount, tick } from "svelte";
  import { computePosition, flip, shift, arrow, type Placement } from "@floating-ui/dom";

  import type { ANIMATE_SPEED, ROUNDED, ENTRANCE_ANIMATION } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass } from "$lib/function"

  interface Props{
    animate ?: ANIMATE_SPEED,
    animation ?: ENTRANCE_ANIMATION,
    style ?: string,
    position ?: Placement,
    triggerEvent ?: 'hover' | 'click' | string,
    rounded ?: ROUNDED,
    offset?: number,
    [key: string] : unknown // class
  }

  let{
    animate = "slower",
    animation = "fade",
    style = "",
    position = "top",
    triggerEvent = "hover",
    rounded = "lg",
    offset = 8,
    ...props
  } : Props = $props()

  // Define animation classes
  let animationClasses = {slide: 'tooltip-slide', "slide-in": "", "slide-out": "", "zoom-in": 'tooltip-zoom-in', "zoom-out": 'tooltip-zoom-out', fade: 'tooltip-fade'}
  let defaultClasses = $derived(`theui-tooltip z-[60] absolute ${animationClasses[animation ?? 'fade']}`)
  let customClasses = `min-w-[100px] pointer-events-none w-max whitespace-nowrap text-sm text-center px-3 py-2 bg-alt text-alt ${style} ${roundedClass(rounded)} ${animationClass(animate, "opacity")}`

  let trigger: HTMLElement | null = null
  let triggerStyle: string = $state("")
  let COMPONENT: HTMLDivElement|null = $state(null)
  let content: string|HTMLElement = $state("")
  let show = $state(false)

  async function updatePosition() {
    await tick();
    if (!trigger || !COMPONENT) return;

    const { x, y, middlewareData } = await computePosition(trigger, COMPONENT, {
      placement: trigger?.dataset.tooltipPosition as Placement ?? position,
      
      middleware: [flip(), shift()],
    });

    COMPONENT.style.left = `${x}px`;
    COMPONENT.style.top = `${y}px`;
  }

  function showTooltip(event: MouseEvent) {
    const target = event.target instanceof HTMLElement ? event.target : null
    if (!target) return

    const tooltipTarget = target.getAttribute("data-tooltip-target")

    if (tooltipTarget) {
      trigger = document.querySelector(tooltipTarget);
      content = trigger ? trigger.innerHTML : "";
    } else {
      const tooltipContent = target.getAttribute("data-tooltip");
      if (!tooltipContent) return;
      
      trigger = target;
      content = tooltipContent;
    }

    if (!trigger) return;

    triggerStyle = trigger.getAttribute("data-tooltip-style") || "";
    show = true;
    updatePosition();
  }


  function hideTooltip() {
    show = false;
    trigger = null;
  }

  onMount(() => {
    if (triggerEvent == "click") {
      document?.addEventListener("click", showTooltip, true)
      document?.addEventListener("blur", hideTooltip, true)
    } else {
      document?.addEventListener("mouseenter", showTooltip, true)
      document?.addEventListener("mouseleave", hideTooltip, true)
    }
  });
</script>

{#if show}
  <div bind:this={COMPONENT} class={`${defaultClasses} ${twMerge(customClasses, style, triggerStyle)}`}>
    {@html content}
  </div>
{/if}