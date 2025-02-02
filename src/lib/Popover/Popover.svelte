<script lang="ts">
	import { animationClass, roundedClass, shadowClass } from "$lib/function"
	import type { ANIMATE_SPEED, ROUNDED, SHADOW } from "$lib/types"
  import { onMount, type Snippet } from "svelte"
	import { twMerge } from "tailwind-merge"

  type PopupPosition = 'top' | 'bottom' | 'left' | 'right'
  interface Props {
    children?: Snippet,
    triggerID: string,
    offset?: number,
    position?: PopupPosition,
    animate?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    shadow?: SHADOW,
    event?: 'click'|'hover',
    closeOnClick?: boolean,
    [key: string]: unknown,
  }

  let {
    children,
    triggerID,
    offset = 16,
    position = "top",
    event = "click",
    closeOnClick = true,
    animate = "slower",
    rounded = "md",
    shadow = "md",
    ...props
  }: Props = $props()

  let trigger: HTMLElement
  let popover: HTMLElement|null = $state(null)

  let getOptimalPopupPosition = (): PopupPosition => {

    if (!(popover instanceof HTMLElement)) {
      return "top";
    }

    const triggerRect = trigger.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const space = {
      top: triggerRect.top,
      bottom: viewportHeight - triggerRect.bottom,
      left: triggerRect.left,
      right: viewportWidth - triggerRect.right,
    }

    const tooltipDimensions = {
      width: popoverRect.width + offset,
      height: popoverRect.height + offset,
    }

    // Check if the preferred position fits
    if (position) {
      const fits = {
        top: space.top >= tooltipDimensions.height,
        bottom: space.bottom >= tooltipDimensions.height,
        left: space.left >= tooltipDimensions.width,
        right: space.right >= tooltipDimensions.width,
      };

      if (fits[position]) {
        return position;
      }
    }

    // If preferred position doesn't fit, fall back to the optimal position
    const finalPosition = (Object.keys(space) as PopupPosition[]).find(
      (key) =>
        space[key] >=
        (key === 'top' || key === 'bottom'
          ? tooltipDimensions.height
          : tooltipDimensions.width)
    );

    // If no position fits, choose the side with the largest space
    const largestSpaceSide = (Object.keys(space) as PopupPosition[]).reduce((largest, current) =>
      space[current] > space[largest] ? current : largest
    );

    return finalPosition || largestSpaceSide;
  }


  let applyPopupPosition = () => {

    if (!(popover instanceof HTMLElement)) {
      return null;
    }

    const position = getOptimalPopupPosition();
    const triggerRect = trigger.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    const styles: Record<PopupPosition, { left: number; top: number }> = {
      top: {
        left: triggerRect.left + triggerRect.width / 2 - popover.offsetWidth / 2 + scrollLeft,
        top: triggerRect.top - popover.offsetHeight - offset + scrollTop,
      },
      bottom: {
        left: triggerRect.left + triggerRect.width / 2 - popover.offsetWidth / 2 + scrollLeft,
        top: triggerRect.bottom + offset + scrollTop,
      },
      left: {
        left: triggerRect.left - popover.offsetWidth - offset + scrollLeft,
        top: triggerRect.top + triggerRect.height / 2 - popover.offsetHeight / 2 + scrollTop,
      },
      right: {
        left: triggerRect.right + offset + scrollLeft,
        top: triggerRect.top + triggerRect.height / 2 - popover.offsetHeight / 2 + scrollTop,
      },
    };

    const appliedStyle = styles[position]

    if (position === 'left' || position === 'right') {
      appliedStyle.top = Math.max(
        scrollTop,
        Math.min(
          appliedStyle.top,
          scrollTop + window.innerHeight - popover.offsetHeight
        )
      );
    }

    // Prevent overflow for top and bottom positions
    if (position === 'top' || position === 'bottom') {
      appliedStyle.left = Math.max(
        scrollLeft,
        Math.min(
          appliedStyle.left,
          scrollLeft + window.innerWidth - popover.offsetWidth
        )
      );
    }

    Object.assign(popover.style, {
      position: 'absolute',
      zIndex: '1000',
      left: `${appliedStyle.left}px`,
      top: `${appliedStyle.top}px`,
    });
  }

  let handleClick = () => {
    popover?.classList.toggle('hidden');
    if(!popover?.classList.contains('hidden')){
      popover?.classList.remove('opacity-0');
      popover?.classList.add('opacity-100');
      applyPopupPosition();
    }else{
      popover?.classList.remove('opacity-100');
      popover?.classList.add('opacity-0');
    }
  }

  let handleMouseEnter = () => {
    popover?.classList.remove('hidden');
    applyPopupPosition();
  }

  let handleMouseLeave = () => {
    popover?.classList.add('hidden');
  }

  let handleBlur = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.hasAttribute("data-popover") && (closeOnClick || !target.classList.contains("popover"))) {
      popover?.classList.add('hidden');
    }
	}

  onMount(() => {
    trigger = document.getElementById(triggerID) as HTMLElement
    // if(!children){
    //   popover = document.querySelector(`[data-popover-id="${triggerID}"]`) as HTMLElement
    // }
    if (trigger && popover) {
      if(event == "hover"){
        trigger.addEventListener('mouseenter', () => {
          handleMouseEnter()
        })
        trigger.addEventListener('mouseleave', () => {
          handleMouseLeave()
        })
      }
      if(event == "click"){
        trigger.addEventListener('click', () => {
          handleClick()
        })
      }
      applyPopupPosition();
    }
  })

  let popoverClasses = `p-2 max-w-64 ${roundedClass(rounded)}${animationClass(animate, "opacity")}${shadowClass(shadow)}`
</script>

<svelte:window onclick={(e: MouseEvent)=>handleBlur(e)} />

{#if children}
<div bind:this={popover} class="popover hidden opacity-0 {twMerge(popoverClasses, props?.class as string)}">
  {@render children()}
</div>
{/if}