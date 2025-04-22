<script lang="ts">
  import type { ANIMATE_SPEED } from "$lib/types"
	import { onMount, type Snippet } from "svelte"
  import { animationClass, generateToken } from "$lib/function"

  interface Props {
    children: Snippet,
    trigger ?: Snippet,
    animationSpeed ?: ANIMATE_SPEED,
    ariaLabel ?: string,
    isOpen ?: boolean
  }

  let {
    children,
    trigger,
    animationSpeed = "fast",
    ariaLabel = "",
    isOpen = false,
  } : Props = $props();
  
  const id = generateToken()
  let element: HTMLElement|null = $state(null)

  const openCollapse = () => {
    if(animationSpeed){
      (element as HTMLElement).style.height = (element as HTMLElement).scrollHeight + "px"
    }
    isOpen = true
  }

  const hideCollapse = () => {
    if(animationSpeed) (element as HTMLElement).style.height = "0"
    isOpen = false
    console.log(isOpen)
  }

  let toggleCollapse = (): void => {
    if(isOpen){
      hideCollapse()
    }else{
      openCollapse()
    }
  }

  let handleKeyboard = (e: KeyboardEvent) => {
    e.preventDefault()
    if(isOpen) {
      if (e.code === "Escape" || e.code === "Space" || e.code === "Enter") {
        hideCollapse()
      }
    }
    else{
      if(e.code === "Enter" || e.code === "Space") {
        openCollapse()
      }
    }
  }

  onMount(() => { element = document.getElementById(id)! })
</script>

{#if trigger}
<span  class="theui-collapse-trigger select-none" class:collapse-active-title={isOpen} role="button" tabindex="0"
  onclick={()=>toggleCollapse()} onkeydown={(e: KeyboardEvent)=>handleKeyboard(e)}
  aria-controls={id} aria-expanded={isOpen} aria-label={ariaLabel} aria-describedby={id} id="{id}Collapse">
  {@render trigger()}
</span>
{/if}

{#if children}
<div {id} class="theui-collapse-body overflow-hidden {animationClass(animationSpeed)}" class:invisible={!isOpen} class:collapse-open={isOpen} aria-labelledby="{id}Collapse" aria-hidden={!isOpen}>
  {@render children?.()}
</div>
{/if}

<style lang="postcss">
  .theui-collapse-body.invisible {
    @apply h-[0];
  }
</style>