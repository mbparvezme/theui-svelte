<script lang="ts">
  import { onMount } from "svelte"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass } from "$lib/function"

  type TOOLTIP_POSITION = 'left' | 'top' | 'right' | 'bottom';
  type TOOLTIP_ANIMATION = 'fade' | 'slide' | 'zoom-in' | 'zoom-out';

  interface Props{
    animate ?: ANIMATE_SPEED,
    animation ?: TOOLTIP_ANIMATION,
    bgColor ?: string ,
    position ?: TOOLTIP_POSITION,
    tooltipEvent ?: 'hover' | 'click' | string,
    rounded ?: ROUNDED,
    [key: string] : unknown // class
  }

  let{
    animate = "slower",
    animation = "fade",
    bgColor = "#1F2937",
    position = "top",
    tooltipEvent = "hover",
    rounded = "lg",
    ...props
  } : Props = $props()

  let tooltip: HTMLSpanElement;
  let tooltipText: string = $state("")
  let showTooltip: boolean = $state(false)

  let tooltipClasses = () => {
    // Define position classes
    let positionClasses = {
      left: 'tooltip-left -left-3 top-1/2 -translate-x-full -translate-y-1/2',
      right: 'tooltip-right -right-3 top-1/2 translate-x-full -translate-y-1/2',
      bottom: 'tooltip-bottom -bottom-3 left-1/2 -translate-x-1/2 translate-y-full',
      top: 'tooltip-top -top-3 left-1/2 -translate-x-1/2 -translate-y-full'
    };

    // Define animation classes
    let animationClasses = {
      slide: 'tooltip-slide',
      "zoom-in": 'tooltip-zoom-in',
      "zoom-out": 'tooltip-zoom-out',
      fade: 'tooltip-fade'
    };

    let defaultClasses = `theui-tooltip z-[60] absolute ${positionClasses[position]} ${animationClasses[animation ?? 'fade']}`;
    let customClasses = `min-w-[100px] max-w-xs text-sm text-center px-2 py-3 bg-[var(--bg-color)] text-white ${roundedClass(rounded)}${animationClass(animate)}`;

    let custom = (props?.class ?? "") as string
    return `${defaultClasses} ${twMerge(customClasses, custom)}`
  }

  onMount(() => {
    let triggerElement: HTMLElement[]|[] = [...document.querySelectorAll<HTMLElement>("[data-tooltip]")];
    triggerElement.forEach((element: HTMLElement) => {
      if (element) {
        let triggerEvent = element.dataset?.tooltipEvent ?? tooltipEvent;

        // Making trigger focusable
        if (element.tabIndex < 0){
          element.tabIndex = 0;
        }

        // Setting relative class if not available
        if(!element.classList.contains("relative")){
          element.classList.add("relative");
        }

        // Click trigger event
        if(triggerEvent == "click"){
          element.addEventListener("click", () => showTooltip ? removeTooltip(element) : createTooltip(element));
          element.onblur = () => removeTooltip(element);
        }
        else{
          element.addEventListener("mouseenter", () => createTooltip(element));
          element.onmouseleave = () => removeTooltip(element);
        }
      }
    })
    
    let createTooltip = (element: HTMLElement) => {
      // Getting tooltip content
      tooltipText = element?.dataset?.tooltip ?? "";
      // Getting tooltip position
      position = element?.dataset.tooltipPosition as TOOLTIP_POSITION ?? position;
      // Getting tooltip animation
      animation = element?.dataset.animation as TOOLTIP_ANIMATION ?? animation;
      showTooltip = true;
      element.prepend(tooltip);
    }

    let removeTooltip = (element: HTMLElement) => {
      if(tooltip.classList.contains('open')) element.removeChild(tooltip);
      showTooltip = false;
    }
  })
</script>

<span
  bind:this={tooltip}
  {...props}
  class={tooltipClasses()}
  class:show={showTooltip}
  class:inline-block={showTooltip}
  class:hidden={!showTooltip}
  style="--bg-color: {bgColor};">
  {@html tooltipText}
</span>

<style lang="postcss">
  /* Tooltip arrow */
  .theui-tooltip::after {
    content: " ";
    @apply absolute h-0 w-0 transform border-transparent border-8;
  }
  .theui-tooltip.tooltip-top::after {
    border-top-color: var(--bg-color);
    @apply border-b-0 -bottom-2 left-1/2 -translate-x-1/2;
  }
  .theui-tooltip.tooltip-right::after {
    border-right-color: var(--bg-color);
    @apply border-l-0 -left-[7px] top-1/2 -translate-y-1/2;
  }
  .theui-tooltip.tooltip-bottom::after {
    border-bottom-color: var(--bg-color);
    @apply border-t-0 -top-2 left-1/2 -translate-x-1/2;
  }
  .theui-tooltip.tooltip-left::after {
    border-left-color: var(--bg-color);
    @apply border-r-0 -right-[7px] top-1/2 -translate-y-1/2;
  }
</style>