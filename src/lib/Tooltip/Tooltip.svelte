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
    offset?: number,
    [key: string] : unknown // class
  }

  let{
    animate = "slower",
    animation = "fade",
    bgColor = "#1F2937",
    position = "top",
    tooltipEvent = "hover",
    rounded = "lg",
    offset = 8,
    ...props
  } : Props = $props()

  let tooltip: HTMLSpanElement;
  let tooltipText: string = $state("")
  let showTooltip: boolean = $state(false)

  // Define position classes
  let positionClasses = {
    left: 'tooltip-left after:border-r-0 after:-right-[7px] after:top-1/2 after:-translate-y-1/2',
    right: 'tooltip-right after:border-l-0 after:-left-[7px] after:top-1/2 after:-translate-y-1/2',
    bottom: 'tooltip-bottom after:border-t-0 after:-top-2 after:left-1/2 after:-translate-x-1/2',
    top: "tooltip-top after:border-b-0 after:-bottom-2 after:left-1/2 after:-translate-x-1/2"
    // after:border-t-4 after:border-t-gray-500 after:-bottom-2 after:left-1/2 after:-translate-x-1/2"
  };

  // Define animation classes
  let animationClasses = {
    slide: 'tooltip-slide',
    "zoom-in": 'tooltip-zoom-in',
    "zoom-out": 'tooltip-zoom-out',
    fade: 'tooltip-fade'
  };

  let defaultClasses = `theui-tooltip z-[60] absolute after:content-[''] after:absolute after:h-0 after:w-0 after:transform after:border-transparent after:border-8 ${positionClasses[position]} ${animationClasses[animation ?? 'fade']}`;
  let customClasses = `min-w-[100px] max-w-xs text-sm text-center px-2 py-3 bg-alt after:bg-alt text-white ${roundedClass(rounded)}${animationClass(animate)}`;

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

      console.log(positionClasses[position])
      // Getting tooltip animation
      animation = element?.dataset.animation as TOOLTIP_ANIMATION ?? animation;
      showTooltip = true;
      // element.prepend(tooltip);
      document.body.appendChild(tooltip);

      Object.assign(tooltip.style, {
        visibility: "hidden",
        display: "block",
      });

      const rect = element.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      let top = 0, left = 0;

      switch (position) {
        case "top":
          top = rect.top - offset - tooltipRect.height;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          break;
        case "bottom":
          top = rect.bottom + offset;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
          break;
        case "left":
          top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.left - tooltipRect.width - offset;
          break;
        case "right":
          top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.right + offset;
          break;
      }

      // Apply position styles
      Object.assign(tooltip.style, {
        top: `${top}px`,
        left: `${left}px`,
        visibility: "visible",
      });

    }

    let removeTooltip = (element: HTMLElement) => {
      if(tooltip.classList.contains('open')) element.removeChild(tooltip);
      showTooltip = false;
      Object.assign(tooltip.style, {
        visibility: "hidden", // Hide temporarily to avoid flickering
        display: "none",
      });
    }
  })
</script>

<span
  bind:this={tooltip}
  {...props}
  class="{defaultClasses} ${twMerge(customClasses, props?.class as string)}}"
  class:show={showTooltip}
  class:inline-block={showTooltip}
  class:hidden={!showTooltip}
  style="--bg-color: {bgColor};">
  {@html tooltipText}
</span>



<!-- <style lang="postcss">
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
</style> -->