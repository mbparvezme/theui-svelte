<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { fly } from "svelte/transition"
  import { setContext, type Snippet } from "svelte"
  import { animationClass, generateToken, roundedClass } from "$lib/function"
  import { twMerge } from "tailwind-merge"
  import { QabItem, Svg } from "$lib"

  interface Props {
    children?: Snippet,
    icon?: Snippet,
    align?: 'start' | 'end',
    size?: 'sm' | 'md' | 'lg' | 'xl',
    direction?: 'horizontal' | 'vertical',
    triggerEvent?: 'click' | 'hover',

    href?: string,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,

    color ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    theme ?: 'default' | 'soft' | 'gradient'
    gradientColor ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    
    ariaLabel ?: string,
    iconClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    icon,
    animationSpeed = "normal",
    align = "end",
    size = "md",
    rounded = "full",
    href, 
    triggerEvent = "click",
    iconClasses = "",
    direction = "vertical",
    theme = "default",
    color = "brand",
    gradientColor = "brand",
    ariaLabel = "Quick Action Button",
    ...props
  } : Props = $props()

  let id: string = generateToken()

  let animSpeed: Record<ANIMATE_SPEED, number> = {
    none: 0,
    slower: 700,
    slow: 500,
    normal: 300,
    fast: 150,
    faster: 100,
  }

  let visible = $state(false)

  const qabPosition = {
    start: "qab-start start-6 bottom-6",
    end: "qab-end end-6 bottom-6"
  }

  const optionPosition = {
    start: {
      horizontal: {
        sm: "qab-btn-start start-12 bottom-12 space-x-2 ps-3",
        md: "qab-btn-start start-14 bottom-14 space-x-2 ps-4",
        lg: "qab-btn-start start-16 bottom-16 space-x-3 ps-5",
        xl: "qab-btn-start start-20 bottom-20 space-x-4 ps-6",
      },
      vertical: {
        sm: "qab-btn-start start-12 bottom-12 space-y-2 pb-3",
        md: "qab-btn-start start-14 bottom-14 space-y-2 pb-4",
        lg: "qab-btn-start start-16 bottom-16 space-y-3 pb-5",
        xl: "qab-btn-start start-20 bottom-20 space-y-4 pb-6",
      }
    },
    end: {
      horizontal: {
        sm: "qab-btn-end end-12 bottom-12 space-x-2 pe-3",
        md: "qab-btn-end end-14 bottom-14 space-x-2 pe-4",
        lg: "qab-btn-end end-16 bottom-16 space-x-3 pe-5",
        xl: "qab-btn-end end-20 bottom-20 space-x-4 pe-6",
      },
      vertical: {
        sm: "qab-btn-end end-12 bottom-12 space-y-2 pb-3",
        md: "qab-btn-end end-14 bottom-14 space-y-2 pb-4",
        lg: "qab-btn-end end-16 bottom-16 space-y-3 pb-5",
        xl: "qab-btn-end end-20 bottom-20 space-y-4 pb-6",
      }
    }
  }

  const animObj = {
    horizontal: {
      end: {x: 16, duration: animSpeed[animationSpeed]},
      start: {x: -16, duration: animSpeed[animationSpeed]},
    },
    vertical: {
      end: {y: 16, duration: animSpeed[animationSpeed]},
      start: {y: 16, duration: animSpeed[animationSpeed]},
    }
  }

  const directionClasses = {
    horizontal: "flex-row bottom-1/2 translate-y-1/2 space-x-3",
    vertical: "flex-col end-1/2 translate-x-1/2",
  }

  const qabSize = {sm: "w-12 h-12", md: "w-14 h-14", lg: "w-16 h-16", xl: "w-20 h-20"}
  
  let propClass = props?.class as string
  let mainButtonClasses = `theui-qab-trigger ${twMerge(`static flex items-center justify-center shadow-2xl ${qabSize[size]}${roundedClass(rounded)}${animationClass(animationSpeed)}`, propClass)}`

	let handleClick = $derived(() => {
    if(triggerEvent == "click"){
      visible = !visible
    }
	})

	let handleMouse = $derived((e: MouseEvent) => {
    if(triggerEvent === "hover"){
			e.preventDefault()
			visible = !visible
		}
	})

  let handleBlur = $derived((e: MouseEvent) => {
		if (visible && e.target instanceof Element && !e.target.closest(`#${id}`)) {
      e.preventDefault()
			visible = false
		}
	})

  $effect(()=>console.log(visible))

  setContext('QAB', {size, rounded, iconClasses, theme, color, gradientColor, mainButtonClasses})
</script>

<svelte:window onclick={(e: MouseEvent)=>handleBlur(e)} />

<!-- <div
  
  class={`theui-qab fixed ${positionClasses[align]}`}
  class:qab-vertical={direction == "vertical"}
  class:qab-horizontal={direction == "horizontal"}
  onclick={()=>handleClick()}
  onmouseenter={(e: MouseEvent)=>handleMouse(e)}
  onmouseleave={(e: MouseEvent)=>handleMouse(e)}
> -->
<QabItem
  {id}
  {ariaLabel}
  {href}
  class="theui-qab fixed {qabPosition[align]}"
  onclick={()=>handleClick()}
  onmouseenter={(e: MouseEvent)=>handleMouse(e)}
  onmouseleave={(e: MouseEvent)=>handleMouse(e)}
  {...props}
>
  {#if icon}
    {@render icon()}
  {:else}
    <Svg class="w-[60%] h-[60%]">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </Svg>
  {/if}
</QabItem>

{#if children && visible}
  <div class="theui-qab-items flex absolute {optionPosition[align][direction][size]} {directionClasses[direction]}" in:fly={animObj[direction][align]}>
    {@render children?.()}
  </div>
{/if}




















<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- <div
  {id}
  class={`theui-qab fixed ${positionClasses[align]}`}
  class:qab-vertical={direction == "vertical"}
  class:qab-horizontal={direction == "horizontal"}
  onclick={()=>handleClick()}
  onmouseenter={(e: MouseEvent)=>handleMouse(e)}
  onmouseleave={(e: MouseEvent)=>handleMouse(e)}
>
  {#if children && visible}
  <div class="theui-qab-items flex absolute {qabSpaces[direction][align][size]} {directionClasses[direction]}" in:fly={animObj[direction][align]}>
    {@render children?.()}
  </div>
  {/if}
  <QabItem mainButton {ariaLabel} {href}>
    {#if icon}
      {@render icon()}
    {:else}
      <Svg class="w-[60%] h-[60%]">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
      </Svg>
    {/if}
  </QabItem>
</div> -->