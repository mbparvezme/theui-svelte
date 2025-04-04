<script lang="ts">
  import type { ANIMATE_SPEED } from "$lib/types"
	import { onMount, type Snippet } from "svelte"
  import { animationClass, generateToken } from "$lib/function"

  interface Props {
    children: Snippet,
    title ?: Snippet,
    content ?: string,
    animationSpeed ?: ANIMATE_SPEED,
    id ?: string,
    ariaLabel ?: string,
    isOpen ?: boolean
  }

  let {
    children,
    title,
    animationSpeed = "fast",
    id = generateToken(),
    ariaLabel = "",
    isOpen = false,
  } : Props = $props();

  let classes = animationClass(animationSpeed)

  let toggleCollapse = (id: string): void => {}
  let handleKeyboard = (e: KeyboardEvent) => {}

  onMount(() => {
    toggleCollapse = (id: string) => {
      let element = document.getElementById(id)!;
      if(element?.classList.contains('collapse-open')){
        isOpen = false;
        if(animationSpeed) element.style.height = "0";
      }else{
        isOpen = true;
        if(animationSpeed) element.style.height = element.scrollHeight + "px";
      }
    }

    handleKeyboard = (e) => {    
      e.preventDefault()
      toggleCollapse(id)
    }
  
  })
</script>

{#if title}
<span  class="theui-collapse-title select-none" class:collapse-active-title={isOpen} role="button" tabindex="0"
  onclick={()=>toggleCollapse(id)} onkeydown={(e: KeyboardEvent)=>handleKeyboard(e)}
  aria-controls={id} aria-expanded={isOpen} aria-label={ariaLabel} aria-describedby={id} id="{id}Collapse">
  {@render title()}
</span>
{/if}

{#if children}
<div {id} class="theui-collapse-body overflow-hidden {classes}" class:invisible={!isOpen} class:collapse-open={isOpen} aria-labelledby="{id}Collapse" aria-hidden={!isOpen}>
  {@render children?.()}
</div>
{/if}

<style lang="postcss">
  .theui-collapse-body.invisible {
    @apply h-0;
  }
</style>