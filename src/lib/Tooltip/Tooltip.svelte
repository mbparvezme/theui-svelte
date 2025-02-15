<script lang="ts">
  import { onMount } from "svelte"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass } from "$lib/function"

  type POSITION_TYPES = 'left' | 'top' | 'right' | 'bottom'
  type TOOLTIP_ANIMATION = 'fade' | 'slide' | 'zoom-in' | 'zoom-out'

  interface Props{
    animate ?: ANIMATE_SPEED,
    animation ?: TOOLTIP_ANIMATION,
    colorClasses ?: string,
    position ?: POSITION_TYPES,
    tooltipEvent ?: 'hover' | 'click' | string,
    rounded ?: ROUNDED,
    offset?: number,
    [key: string] : unknown // class
  }

  let{
    animate = "slower",
    animation = "fade",
    colorClasses = "bg-alt after:border-alt",
    position = "top",
    tooltipEvent = "hover",
    rounded = "lg",
    offset = 8,
    ...props
  } : Props = $props()

  let COMPONENT_ITEM: HTMLSpanElement
  let elementContent: string = $state("")
  let positionalClasses: string = $state("")

  // Define position classes
  let positionClasses = {
    top: "tooltip-top after:left-1/2 after:-bottom-2 after:border-b-0 after:border-x-transparent after:border-b-transparent after:-translate-x-1/2",
    right: "tooltip-right after:top-1/2 after:-left-[7px] after:border-l-0 after:border-y-transparent after:border-l-transparent after:-translate-y-1/2",
    bottom: "tooltip-bottom after:left-1/2 after:-top-2 after:border-t-0 after:border-x-transparent after:border-t-transparent after:-translate-x-1/2",
    left: "tooltip-left after:top-1/2 after:-right-[7px] after:border-r-0 after:border-y-transparent after:border-r-transparent after:-translate-y-1/2",
  }

  // Define animation classes
  let animationClasses = {slide: 'tooltip-slide', "zoom-in": 'tooltip-zoom-in', "zoom-out": 'tooltip-zoom-out', fade: 'tooltip-fade'}
  let defaultClasses = $derived(`theui-tooltip hidden z-[60] absolute after:content-[''] after:absolute after:h-0 after:w-0 after:border-8 after:transform ${positionalClasses} ${animationClasses[animation ?? 'fade']}`)
  let customClasses = `min-w-[100px] max-w-xs text-sm text-center px-3 py-2 text-alt ${colorClasses} ${roundedClass(rounded)} ${animationClass(animate, "opacity")}`

  onMount(() => {
    let triggerElement: HTMLElement[]|[] = [...document.querySelectorAll<HTMLElement>("[data-tooltip]")]
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
          element.addEventListener("click", () => COMPONENT_ITEM.classList.contains("hidden") ? createElement(element) : removeElement(element));
          element.onblur = () => removeElement(element);
        }
        else{
          element.addEventListener("mouseenter", () => createElement(element));
          element.onmouseleave = () => removeElement(element);
        }
      }
    })
  })

  let createElement = (element: HTMLElement) => {
    // Getting tooltip content
    elementContent = element?.dataset?.tooltip ?? ""
    // Getting tooltip position
    const finalPosition = element?.dataset.tooltipPosition as POSITION_TYPES ?? position
    // let finalPosition = preferredPosition;
    positionalClasses = positionClasses[finalPosition]
    // Getting tooltip animation
    animation = element?.dataset.animation as TOOLTIP_ANIMATION ?? animation
    COMPONENT_ITEM.classList.remove("hidden")
    document.body.appendChild(COMPONENT_ITEM)
    // Hide tooltip off-screen initially
    setInitialStyle(COMPONENT_ITEM)
    // Wait for DOM update
    setTimeout(() => resetAndToggle(element, finalPosition), 0)
  }

  let resetAndToggle = (el: HTMLElement, finalPosition: POSITION_TYPES) => {
    const rect: DOMRect = el.getBoundingClientRect();
    const elemRect: DOMRect = COMPONENT_ITEM.getBoundingClientRect();
    let { top: newTop, left: newLeft } = calculatePosition(finalPosition, rect, elemRect)
    if (isOverflowing(newTop, newLeft, elemRect)) {
      const alternatePositions = ["bottom", "top", "right", "left"] as POSITION_TYPES[]
      for (let pos of alternatePositions) {
        ({ top: newTop, left: newLeft } = calculatePosition(pos, rect, elemRect))
        if (!isOverflowing(newTop, newLeft, elemRect)) {
          finalPosition = pos
          positionalClasses = positionClasses[finalPosition]
          break;
        }
      }
    }

    // Final check: Keep tooltip inside screen bounds
    ({ top: newTop, left: newLeft } = keepInBounds(newTop, newLeft, elemRect));
    // Apply position styles
    setVisibleStyle(COMPONENT_ITEM, newTop, newLeft)
  }

  let setInitialStyle = (el: HTMLElement) => {
    Object.assign(el.style, {visibility: "hidden", display: "block", opacity: 0, top: "-9999px", left: "-9999px"});
  }

  const isOverflowing = (top: number, left: number, elemRect: DOMRect) => {
    return (top < 0 || left < 0 || top + elemRect.height > window.innerHeight || left + elemRect.width > window.innerWidth)
  }

  const keepInBounds = (top: number, left: number, elemRect: DOMRect) => {
    return {
      top: Math.max(8, Math.min(window.innerHeight - elemRect.height - 8, top)),
      left: Math.max(8, Math.min(window.innerWidth - elemRect.width - 8, left)),
    }
  }

  const calculatePosition = (pos: POSITION_TYPES, rect: DOMRect, elemRect: DOMRect) => {
    switch (pos) {
      case "top":
        return {
          top: rect.top - offset - elemRect.height,
          left: rect.left + rect.width / 2 - elemRect.width / 2,
        };
      case "bottom":
        return {
          top: rect.bottom + offset,
          left: rect.left + rect.width / 2 - elemRect.width / 2,
        };
      case "left":
        return {
          top: rect.top + rect.height / 2 - elemRect.height / 2,
          left: rect.left - elemRect.width - offset,
        };
      case "right":
        return {
          top: rect.top + rect.height / 2 - elemRect.height / 2,
          left: rect.right + offset,
        };
    }
  }

  let setVisibleStyle = (el: HTMLElement, newTop: number, newLeft: number) => {
    Object.assign(el.style, {top: `${newTop}px`, left: `${newLeft}px`, visibility: "visible", opacity: 1});
  }

  let removeElement = (element: HTMLElement) => {
    if(COMPONENT_ITEM.classList.contains('open')) element.removeChild(COMPONENT_ITEM)
    COMPONENT_ITEM.classList.contains("hidden")
    Object.assign(COMPONENT_ITEM.style, {visibility: "hidden"});
  }
</script>

<span bind:this={COMPONENT_ITEM} {...props} class="{defaultClasses} {twMerge(customClasses, props?.class as string)}">
  {@html elementContent}
</span>