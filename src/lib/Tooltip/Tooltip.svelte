<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { browser } from "$app/environment";
  import type { ANIMATE_SPEED, ROUNDED, POSITION_TYPES, ENTRANCE_ANIMATION } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, resetAndToggle, removeElement, setInitialStyle } from "$lib/function"

  interface Props{
    animate ?: ANIMATE_SPEED,
    animation ?: ENTRANCE_ANIMATION,
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
  let tooltipId: string = $state(`tooltip-${Math.random().toString(36).substring(2, 9)}`)

  // Define position classes
  let positionClasses = {
    top: "tooltip-top after:left-1/2 after:-bottom-2 after:border-b-0 after:border-x-transparent after:border-b-transparent after:-translate-x-1/2",
    right: "tooltip-right after:top-1/2 after:-left-[7px] after:border-l-0 after:border-y-transparent after:border-l-transparent after:-translate-y-1/2",
    bottom: "tooltip-bottom after:left-1/2 after:-top-2 after:border-t-0 after:border-x-transparent after:border-t-transparent after:-translate-x-1/2",
    left: "tooltip-left after:top-1/2 after:-right-[7px] after:border-r-0 after:border-y-transparent after:border-r-transparent after:-translate-y-1/2",
  }

  // Define animation classes
  let animationClasses = {slide: 'tooltip-slide', "slide-in": "", "slide-out": "", "zoom-in": 'tooltip-zoom-in', "zoom-out": 'tooltip-zoom-out', fade: 'tooltip-fade'}
  let defaultClasses = $derived(`theui-tooltip hidden z-[60] absolute after:content-[''] after:absolute after:h-0 after:w-0 after:border-8 after:transform ${positionalClasses} ${animationClasses[animation ?? 'fade']}`)
  let customClasses = `min-w-[100px] max-w-xs text-sm text-center px-3 py-2 text-alt ${colorClasses} ${roundedClass(rounded)} ${animationClass(animate, "opacity")}`

  onMount(() => {
    let triggerElement: HTMLElement[]|[] = [...document.querySelectorAll<HTMLElement>("[data-tooltip]")]
    triggerElement.forEach((element: HTMLElement) => {
      if (element) {
        let triggerEvent = element.dataset?.tooltipEvent ?? tooltipEvent

        // Making trigger focusable
        if (element.tabIndex < 0){
          element.tabIndex = 0
        }

        // Setting relative class if not available
        if(!element.classList.contains("relative")){
          element.classList.add("relative")
        }

        // Click trigger event
        if (triggerEvent == "click") {
          element.addEventListener("click", () => COMPONENT_ITEM.classList.contains("hidden") ? createElement(element) : removeElement(element, COMPONENT_ITEM))
          element.onblur = () => removeElement(element, COMPONENT_ITEM)
        } else {
          element.addEventListener("mouseenter", () => createElement(element))
          element.onmouseleave = () => removeElement(element, COMPONENT_ITEM)
        }

        if (browser) {
          window.addEventListener("resize", handleResize)
        }

      }
    })
  })

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("resize", handleResize)
    }
  })

  let handleResize = () => {
    if (!COMPONENT_ITEM.classList.contains("hidden")) {
      const triggerElement = document.querySelector(`[data-tooltip-id="${tooltipId}"]`)
      if (triggerElement) {
        createElement(triggerElement as HTMLElement)
      }
    }
  }

  let createElement = (element: HTMLElement) => {
    elementContent = element?.dataset?.tooltip ?? ""
    const finalPosition = element?.dataset.tooltipPosition as POSITION_TYPES ?? position
    positionalClasses = positionClasses[finalPosition]
    animation = element?.dataset.animation as ENTRANCE_ANIMATION ?? animation
    COMPONENT_ITEM.classList.remove("hidden")
    document.body.appendChild(COMPONENT_ITEM)
    setInitialStyle(COMPONENT_ITEM)
    setTimeout(() => resetAndToggle(element, COMPONENT_ITEM, finalPosition, positionClasses, offset), 0)
  }
</script>

<span bind:this={COMPONENT_ITEM} {...props} class="{defaultClasses} {twMerge(customClasses, props?.class as string)}" data-tooltip-id={tooltipId}>
  {@html elementContent}
</span>