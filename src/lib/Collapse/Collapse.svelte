<script lang="ts">
	import { type Snippet } from "svelte"
  import type { ANIMATE_SPEED } from "$lib/types"
  import { animationClass, generateToken, coreSpeed } from "$lib/function"

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
    animationSpeed = coreSpeed("fast"),
    ariaLabel = "",
    isOpen = $bindable(false),
  } : Props = $props();
  
  const id = generateToken()
  let element: HTMLElement | null = $state(null)
  let contentHeight = $state("")

  const openCollapse = () => {
    if (animationSpeed && animationSpeed !== "none") {
      contentHeight = element?.scrollHeight + "px"
    }
    isOpen = true
  }

  const hideCollapse = () => {
    if (animationSpeed && animationSpeed !== "none") contentHeight = "0"
    isOpen = false
  }

  const toggleCollapse = (): void => isOpen ? hideCollapse() : openCollapse()

  // isOpen can also change from outside (bind:isOpen); keep the animated height in sync
  $effect(() => {
    if (!animationSpeed || animationSpeed === "none") return
    if (isOpen && contentHeight === "0") contentHeight = element?.scrollHeight + "px"
    else if (!isOpen && contentHeight !== "0") contentHeight = "0"
  })

  let handleKeyboard = (e: KeyboardEvent) => {
    if (e.code === "Space") e.preventDefault()
    if(isOpen) {
      if (e.code === "Escape" || e.code === "Enter" || e.code === "Space") hideCollapse()
    } else {
      if (e.code === "Enter" || e.code === "Space") openCollapse()
    }
  }
</script>

{#if trigger}
<span  class="theui-collapse-trigger select-none" class:collapse-active-title={isOpen} role="button" tabindex="0"
  onclick={()=>toggleCollapse()} onkeydown={(e: KeyboardEvent)=>handleKeyboard(e)}
  aria-controls={id} aria-expanded={isOpen} aria-label={ariaLabel} aria-describedby={id} id="{id}Collapse">
  {@render trigger()}
</span>
{/if}

{#if children}
<div {id} bind:this={element} class="theui-collapse-body overflow-hidden {animationClass(animationSpeed)}" class:h-0={!isOpen} class:collapse-open={isOpen} style={animationSpeed && animationSpeed !== "none" ? `height: ${contentHeight}` : undefined} aria-labelledby="{id}Collapse" aria-hidden={!isOpen}>
  {@render children?.()}
</div>
{/if}