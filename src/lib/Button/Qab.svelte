<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { fly } from 'svelte/transition'
  import { setContext, type Snippet } from "svelte"
  import { animationClass, generateToken, roundedClass } from "$lib/function"
  import { twMerge } from "tailwind-merge"
  import { QabButton } from "$lib"
  import Svg from "$lib/Utility/Svg.svelte";

  interface Props {
    children?: Snippet,
    icon?: Snippet,
    animate?: ANIMATE_SPEED,
    align?: 'start' | 'end',
    size?: 'sm' | 'md' | 'lg' | 'xl',
    rounded?: ROUNDED,
    href?: string,
    triggerEvent?: 'click' | 'hover',
    btnClasses?: string,
    iconClasses?: string,
    direction?: 'horizontal' | 'vertical',
    [key: string] : unknown
  }

  let {
    children,
    icon,
    animate = "normal",
    align = "end",
    size = "md",
    rounded = "full",
    href,
    triggerEvent = "click",
    btnClasses = "",
    iconClasses = "",
    direction = "vertical",
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

  let alignClasses = {start: "fab-start start-6 bottom-6", end: "fab-end end-6 bottom-6"}

  let animObj = {
    horizontal: {
      end: {x: 16, duration: animSpeed[animate]},
      start: {x: -16, duration: animSpeed[animate]},
    },
    vertical: {
      end: {y: 16, duration: animSpeed[animate]},
      start: {y: 16, duration: animSpeed[animate]},
    }
  }

  let directionClasses = {
    horizontal: "flex-row bottom-1/2 translate-y-1/2 space-x-3",
    vertical: "flex-col end-1/2 translate-x-1/2",
  }

  let fabSpaces = {
    horizontal: {
      end: {
        sm: "end-12 space-x-2 pe-3",
        md: "end-14 space-x-2 pe-4",
        lg: "end-16 space-x-3 pe-5",
        xl: "end-20 space-x-4 pe-6",
      },
      start: {
        sm: "start-12 space-x-2 ps-3",
        md: "start-14 space-x-2 ps-4",
        lg: "start-16 space-x-3 ps-5",
        xl: "start-20 space-x-4 ps-6",
      }
    },
    vertical: {
      end: {
        sm: "bottom-12 space-y-2 pb-3",
        md: "bottom-14 space-y-2 pb-4",
        lg: "bottom-16 space-y-3 pb-5",
        xl: "bottom-20 space-y-4 pb-6",
      },
      start: {
        sm: "bottom-12 space-y-2 pb-3",
        md: "bottom-14 space-y-2 pb-4",
        lg: "bottom-16 space-y-3 pb-5",
        xl: "bottom-20 space-y-4 pb-6",
      }
    }
  }

  let fabSize  = {sm: "w-12 h-12", md: "w-14 h-14", lg: "w-16 h-16", xl: "w-20 h-20"}
  
  let fabClasses = `theui-fab-trigger ${twMerge(`static flex items-center justify-center bg-brand-primary-500 text-on-brand-primary-500 shadow-2xl hover:bg-brand-primary-600 ${fabSize[size]}${roundedClass(rounded)}${animationClass(animate)}`, btnClasses)}`
  
  let iconSizeClasses = {sm: "w-[1.25em] h-[1.25em]", md: "w-[1.5em] h-[1.5em]", lg: "w-[1.75em] h-[1.75em]", xl: "w-[2em] h-[2em]"}

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

  setContext('FAB', {size, rounded, iconClasses})
</script>

<svelte:window onclick={(e: MouseEvent)=>handleBlur(e)} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  {id}
  class={`theui-fab fixed ${alignClasses[align]}`}
  class:fab-vertical={direction == "vertical"}
  class:fab-horizontal={direction == "horizontal"}
  onclick={()=>handleClick()}
  onmouseenter={(e: MouseEvent)=>handleMouse(e)}
  onmouseleave={(e: MouseEvent)=>handleMouse(e)}
>
  {#if children && visible}
  <div class="theui-fab-items flex absolute {fabSpaces[direction][align][size]} {directionClasses[direction]}" in:fly={animObj[direction][align]}>
    {@render children?.()}
  </div>
  {/if}
  <QabButton class={twMerge(fabClasses, props?.classes as string)} {href}>
    {#if icon}
      {@render icon()}
    {:else}
      <Svg class="w-[60%] h-[60%]">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
      </Svg>
    {/if}
  </QabButton>
</div>