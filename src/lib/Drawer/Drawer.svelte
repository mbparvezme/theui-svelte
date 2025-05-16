<script lang="ts">
	import type { Snippet } from "svelte"
  import type { ANIMATE_SPEED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken, backdropClasses } from "$lib/function"
	import { Close, Button } from "$lib"

  interface Props {
    children ?: Snippet,
    label ?: string | Snippet,
    animationSpeed ?: ANIMATE_SPEED,
    backdrop ?: boolean|string,
    position ?: 'top' | 'end' | 'bottom' | 'start',
    staticBackdrop ?: boolean,
    buttonClasses?: string,
    ariaLabel ?: string,
    isOpen: boolean,
    [key: string]: unknown
  }

  let {
    children,
    label,
    animationSpeed = "fast",
    backdrop = true,
    position = "start",
    staticBackdrop = false,
    buttonClasses = "",
    ariaLabel = "Drawer component",
    isOpen = $bindable(false),
    ...props
  } : Props = $props()

  const id = generateToken()

  let toggle = () => isOpen = !isOpen

  let handleKeyboardEsc = (e: KeyboardEvent) => {
    if (isOpen && e.key === "Escape") {
      isOpen = false
    }
  }

  let handleKeyboardEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      toggle();
    }
  }

  const positionClasses: string = {
    top: "drawer-top",
    end: "drawer-end",
    bottom: "drawer-bottom",
    start: "drawer-start"
  }[position ?? "start"]

  const transformClasses: string = {
    top: "-translate-y-full",
    end: "translate-x-full rtl:-translate-x-full",
    bottom: "translate-y-full",
    start: "-translate-x-full rtl:translate-x-full",
  }[position ?? "start"]

  const openTransformClasses: string = {
    top: "translate-y-0",
    end: "translate-x-0",
    bottom: "translate-y-0",
    start: "translate-x-0",
  }[position ?? "start"]

  const sizeClasses: string = {
    top: "w-full min-h-[160px] inset-x-0 top-0",
    end: "w-full sm:w-96 inset-y-0 end-0",
    bottom: "w-full min-h-[160px] inset-x-0 bottom-0",
    start: "w-full sm:w-96 inset-y-0 start-0",
    fullscreen: "inset-0",
  }[props?.fullscreen ? "fullscreen" : (position ?? "start")]

  const drawerClass: string = $derived(
    twMerge(
      `fixed bg-white dark:bg-secondary z-40 transition-transform duration-200 ${transformClasses} ${sizeClasses}${animationClass(animationSpeed)}`,
      isOpen && openTransformClasses,
      props?.class as string
    )
  )
</script>

<svelte:body onkeydown={(e)=>handleKeyboardEsc(e)}></svelte:body>

{#if label}
  {#if typeof label == "string"}
    <Button id={`theui-drawer-trigger${id}`} class={buttonClasses} aria-controls={`${id}-drawer`} aria-expanded={isOpen} {ariaLabel} onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)}>{@html label}</Button>
  {:else}
    <span id={`theui-drawer-trigger${id}`} class={buttonClasses} aria-controls={`${id}-drawer`} aria-expanded={isOpen} aria-label={ariaLabel} onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)} role="button" tabindex="0">
      {@render label?.()}
    </span>
  {/if}
{/if}

{#if children}
  <div {id} class="theui-drawer fixed inset-0 z-40 group {positionClasses}{animationClass(animationSpeed)}" class:invisible={!isOpen} class:opacity-0={!isOpen} role="complementary">

    {#if backdrop && !props?.fullscreen}
      <div role="presentation" class={backdropClasses(backdrop)} onclick={()=>staticBackdrop ? false : toggle()}></div>
    {/if}

    <div id="drawer{id}" class={drawerClass} aria-labelledby={`theui-drawer-trigger${id}`} aria-hidden={!isOpen}>
      <Close class="text-default flex-grow-0 opacity-25 hover:opacity-75 transition-opacity absolute top-4 end-4 p-1" onclick={()=>toggle()}/>
      {@render children()}
    </div>
  </div>
{/if}