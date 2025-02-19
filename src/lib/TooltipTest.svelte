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
  let customClasses = `min-w-[100px] pointer-events-none w-max whitespace-nowrap text-sm text-center px-3 py-2 text-alt ${style} ${roundedClass(rounded)} ${animationClass(animate, "opacity")}`

  let trigger: HTMLElement | null = null
  let triggerStyle: string = $state("")
  let COMPONENT: HTMLSpanElement|null = $state(null)
  let content: string = $state("")
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
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target || !target.hasAttribute("data-tooltip")) return;

    content = target.getAttribute("data-tooltip") || "";
    trigger = target;

    if(target.hasAttribute("data-tooltip-style")){
      triggerStyle = target.getAttribute("data-tooltip-style") || "";
    }

    show = true;
    updatePosition();
  }

  function hideTooltip() {
    show = false;
    trigger = null;
  }

  onMount(() => {
    if (triggerEvent == "click") {
      trigger?.addEventListener("click", (e: MouseEvent) => showTooltip(e), true)
      trigger?.addEventListener("blur", () => hideTooltip(), true)
    } else {
      trigger?.addEventListener("mouseenter", showTooltip, true)
      trigger?.addEventListener("mouseleave", hideTooltip, true)
    }
  });
</script>

{#if show}
  <span bind:this={COMPONENT} class={`${defaultClasses} ${twMerge(customClasses, style, triggerStyle)}`}>
    {@html content}
  </span>
{/if}