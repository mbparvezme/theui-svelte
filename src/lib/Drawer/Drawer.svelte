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
    ...props
  } : Props = $props()

  const id = props?.id as string ?? generateToken()
  let drawerElement:HTMLElement|null = $state(null)

  let openDrawer = () => {
    drawerElement?.setAttribute("data-drawer-open", "true")
    document.getElementById(`theui-drawer-trigger${id}`)?.setAttribute("aria-expanded", "false")
    document.getElementById(`{id}-drawer`)?.setAttribute("aria-hidden", "true")
  }
  
  let closeDrawer = () => {
    drawerElement?.removeAttribute("data-drawer-open")
    document.getElementById(`theui-drawer-trigger${id}`)?.setAttribute("aria-expanded", "true")
    document.getElementById(`{id}-drawer`)?.setAttribute("aria-hidden", "false")
  }

  let toggle = () => {
    drawerElement?.hasAttribute('data-drawer-open') ? closeDrawer() : openDrawer()
  }

  let handleKeyboardEsc = (e: KeyboardEvent) => {
    if (drawerElement?.hasAttribute('data-drawer-open') && e.key === "Escape") {
      closeDrawer();
    }
  }

  let handleKeyboardEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      toggle();
    }
  }

  let positionCls = () => {
    const positions: { [key: string]: string } = {
      top: "drawer-top",
      end: "drawer-end",
      bottom: "drawer-bottom",
      start: "drawer-start"
    }
    return positions[position] || "drawer-start"
  }

  let bodyPositionClasses = () => {
    const transform: { [key: string]: string } = {
      top: "transform -translate-y-full group-data-drawer-open:translate-y-0",
      end: "transform translate-x-full rtl:-translate-x-full group-data-drawer-open:translate-x-0",
      bottom: "transform translate-y-full group-data-drawer-open:translate-y-0",
      start: "transform -translate-x-full rtl:translate-x-full group-data-drawer-open:translate-x-0"
    }
    return transform[position] || transform["start"]
  }

  let sizeCls = () => {
    const sizes: { [key: string]: string } = {
      top: "w-full min-h-[160px] inset-x-0 top-0",
      bottom: "w-full min-h-[160px] inset-x-0 bottom-0",
      start: "w-full sm:w-96 inset-y-0 start-0",
      end: "w-full sm:w-96 inset-y-0 end-0",
      fullscreen: "start-0 top-0 end-0 bottom-0"
    }

    return sizes[props?.fullscreen ? "fullscreen" : position] || sizes["start"]
  }

  let getClass = twMerge(`drawer-body fixed bg-white dark:bg-secondary ${sizeCls()} ${bodyPositionClasses()}${animationClass(animationSpeed)}`, (props?.class ?? "") as string)
</script>

<svelte:body onkeydown={(e)=>handleKeyboardEsc(e)}></svelte:body>

{#if label}
  {#if typeof label == "string"}
    <Button id={`theui-drawer-trigger${id}`} aria-controls={`${id}-drawer`} aria-expanded="false" {ariaLabel} onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)} class={buttonClasses}>{@html label}</Button>
  {:else}
    <span id={`theui-drawer-trigger${id}`} class={buttonClasses} aria-controls={`${id}-drawer`} aria-expanded="false" aria-label={ariaLabel} role="button" onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)} tabindex="0">
      {@render label?.()}
    </span>
  {/if}
{/if}

{#if children}
  <div {id} class="theui-drawer fixed inset-0 z-40 not-data-drawer-open:invisible not-data-drawer-open:opacity-0 group{animationClass(animationSpeed)} {positionCls()}" role="complementary" class:animate={animationSpeed} bind:this={drawerElement}>

    {#if backdrop && !props?.fullscreen}
      <div role="presentation" class={backdropClasses(backdrop)} onclick={()=>staticBackdrop ? false : toggle()}></div>
    {/if}

    <div id="drawer{id}" class={getClass} aria-labelledby={`theui-drawer-trigger${id}`} aria-hidden="true">
      <Close class="text-default flex-grow-0 opacity-25 hover:opacity-75 transition-opacity absolute top-4 end-4 p-1" onclick={()=>toggle()}/>
      {@render children()}
    </div>

  </div>
{/if}