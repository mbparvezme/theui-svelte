<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { fly } from "svelte/transition"
  import { setContext, type Snippet } from "svelte"
  import { generateToken } from "$lib/function"
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

  const id: string = generateToken()

  let visible = $state(false)

  let animSpeed: Record<ANIMATE_SPEED, number> = {
    none: 0,
    slower: 700,
    slow: 500,
    normal: 300,
    fast: 150,
    faster: 100,
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

  const triggerPosition = {start: "start-6 bottom-6", end: "end-6 bottom-6"}

  const qabSize = {sm: "w-12 h-12", md: "w-14 h-14", lg: "w-16 h-16", xl: "w-20 h-20"}

  const optionPosition = {
    start: {
      horizontal: {
        sm: "start-20 bottom-7 space-x-2",
        md: "start-22 bottom-7 space-x-2",
        lg: "start-26 bottom-7 space-x-3",
        xl: "start-32 bottom-8 space-x-4",
      },
      vertical: {
        sm: "start-7 bottom-20 space-y-2",
        md: "start-7 bottom-22 space-y-2",
        lg: "start-7 bottom-26 space-y-3",
        xl: "start-8 bottom-32 space-y-4",
      }
    },
    end: {
      horizontal: {
        sm: "end-20 bottom-7 space-x-2",
        md: "end-22 bottom-7 space-x-2",
        lg: "end-26 bottom-7 space-x-3",
        xl: "end-32 bottom-8 space-x-4",
      },
      vertical: {
        sm: "end-7 bottom-20 space-y-2",
        md: "end-7 bottom-22 space-y-2",
        lg: "end-7 bottom-26 space-y-3",
        xl: "end-8 bottom-32 space-y-4",
      }
    }
  }

  const directionClasses = {horizontal: "flex-row", vertical: "flex-col"}

	const handleClick = $derived(() => {
    if(triggerEvent == "click"){
      visible = !visible
    }
	})

	const handleMouse = $derived((e: MouseEvent) => {
    if(triggerEvent === "hover"){
			e.preventDefault()
			visible = !visible
		}
	})

  const handleBlur = $derived((e: MouseEvent) => {
		if (visible && e.target instanceof Element && !e.target.closest(`#${id}`)) {
      e.preventDefault()
			visible = false
		}
	})

  setContext('QAB', {size, rounded, iconClasses, theme, color, gradientColor})
</script>

<svelte:window onclick={(e: MouseEvent)=>handleBlur(e)} />

<QabItem
  {id}
  {ariaLabel}
  {href}
  class="theui-qab fixed {twMerge(`${triggerPosition[align]} ${qabSize[size]}`, props?.class as string)}"
  onclick={() => handleClick()}
  onmouseenter={(e: MouseEvent) => handleMouse(e)}
  onmouseleave={(e: MouseEvent) => handleMouse(e)}
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
  <div class="theui-qab-items flex fixed {optionPosition[align][direction][size]} {directionClasses[direction]}" in:fly={animObj[direction][align]}>
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