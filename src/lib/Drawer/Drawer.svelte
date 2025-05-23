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

  let openDrawer = (el: HTMLElement) => {
    el.classList.add('open')
    document.getElementById(`drawer-trigger-${id}`)?.setAttribute("aria-expanded", "false")
    document.getElementById(`{id}-drawer`)?.setAttribute("aria-hidden", "true")
  }
  
  let closeDrawer = (el: HTMLElement) => {
    el.classList.remove('open')
    document.getElementById(`drawer-trigger-${id}`)?.setAttribute("aria-expanded", "true")
    document.getElementById(`{id}-drawer`)?.setAttribute("aria-hidden", "false")
  }

  let toggle = () => {
    let el = document.getElementById(id) as HTMLElement
    el.classList.contains('open') ? closeDrawer(el) : openDrawer(el)
  }

  let handleKeyboardEsc = (e: KeyboardEvent) => {
    let el = document.getElementById(id) as HTMLElement
    if (el.classList.contains("open") && e.key === "Escape") {
      closeDrawer(el);
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

  let getClass = twMerge(`drawer-body fixed bg-white ${sizeCls()} dark:bg-secondary${animationClass(animationSpeed)}`, (props?.class ?? "") as string)
</script>

<svelte:body onkeydown={(e)=>handleKeyboardEsc(e)}></svelte:body>

{#if label}
  {#if typeof label == "string"}
    <Button id={`drawer-trigger-${id}`} aria-controls={`${id}-drawer`} aria-expanded="false" {ariaLabel} onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)} class={buttonClasses}>{@html label}</Button>
  {:else}
    <span id={`drawer-trigger-${id}`} class={buttonClasses} aria-controls={`${id}-drawer`} aria-expanded="false" aria-label={ariaLabel} role="button" onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)} tabindex="0">
      {@render label?.()}
    </span>
  {/if}
{/if}

{#if children}
  <div {id} class="theui-drawer fixed inset-0 z-40 {animationClass(animationSpeed)} {positionCls()}" role="complementary" class:animate={animationSpeed}>

    {#if backdrop && !props?.fullscreen}
      <div role="presentation" class={backdropClasses(backdrop)} onclick={()=>staticBackdrop ? false : toggle()}></div>
    {/if}

    <div id="{id}-drawer" class={getClass} aria-labelledby={`drawer-trigger-${id}`} aria-hidden="true">
      <Close class="text-default flex-grow-0 opacity-25 hover:opacity-75 transition-opacity absolute top-4 end-4 p-1" onclick={()=>toggle()}/>
      {@render children()}
    </div>

  </div>
{/if}

<style lang="postcss">
  @reference "../style.css";
  .theui-drawer.open{
    @apply visible opacity-100;
  }
  .theui-drawer{
    @apply invisible opacity-0;
  }
  .theui-drawer.animate .drawer-body{
    @apply transform;
  }
  .theui-drawer.animate.drawer-start .drawer-body{
    @apply -translate-x-full rtl:translate-x-full;
  }
  .theui-drawer.animate.drawer-end .drawer-body{
    @apply translate-x-full rtl:-translate-x-full;
  }
  .theui-drawer.animate.drawer-start.open .drawer-body, .theui-drawer.animate.drawer-end.open .drawer-body{
    @apply translate-x-0;
  }
  .theui-drawer.animate.drawer-top .drawer-body{
    @apply -translate-y-full;
  }
  .theui-drawer.animate.drawer-bottom .drawer-body{
    @apply translate-y-full;
  }
  .theui-drawer.animate.drawer-top.open .drawer-body, .theui-drawer.animate.drawer-bottom.open .drawer-body{
    @apply translate-y-0;
  }
</style>