<script lang="ts">
  import type { ANIMATE_SPEED } from "$lib/types"
	import { onMount, type Snippet } from "svelte"
  import { animationClass, generateToken } from "$lib/function"

  interface Props {
    children?: Snippet,
    title ?: Snippet,
    content ?: string,
    animation ?: ANIMATE_SPEED,
    id ?: string,
    ariaLabel ?: string,
    isOpen ?: boolean
  }

  let {
    children,
    title,
    content,
    animation = "fast",
    id = generateToken(),
    ariaLabel = "",
    isOpen = false,
  } : Props = $props();

  let classes = animationClass(animation)
  let toggleCollapse = (id: string): void => {}

  onMount(() => {
    toggleCollapse = (id: string) => {
      let element = document.getElementById(id)!;
      if(element?.classList.contains('collapse-open')){
        isOpen = false;
        if(animation) element.style.height = "0";
      }else{
        isOpen = true;
        if(animation) element.style.height = element.scrollHeight + "px";
      }
    }
  })
</script>

{#if title}
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<span  class="theui-collapse-title select-none" class:collapse-active-title={isOpen} role="button" tabindex="0"
  onclick={()=>toggleCollapse(id)} aria-controls={id} aria-expanded={isOpen} aria-label={ariaLabel} aria-describedby={id} id="{id}Collapse">
  {@render title()}
</span>
{/if}

{#if content || children}
<div {id} class="theui-collapse-body overflow-hidden {classes}" class:invisible={!isOpen} class:collapse-open={isOpen} aria-labelledby="{id}Collapse" aria-hidden={!isOpen}>
  {#if content}
    {@html content}
  {:else if children}
    {@render children()}
  {/if}
</div>
{/if}

<style lang="postcss">
  .theui-collapse-body.invisible {
    @apply h-0;
  }
</style>