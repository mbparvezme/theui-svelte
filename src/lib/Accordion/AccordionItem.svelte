<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { getContext, onMount, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { generateToken, roundedClass, animationClass } from "$lib/function"
  import { ST_ACTIVE_ACCORDIONS } from "$lib/state.svelte"

  interface Props {
    children?: Snippet,
    title?: string|Snippet,
    content?: string,
    id?: string,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    size?: "compact" | "default" | "large",
    containerClasses?: string,
    contentClasses?: string,
    titleClasses?: string,
    openContainerClasses?: string,
    openContentClasses?: string,
    openTitleClasses?: string,
    [key: string] : unknown // open, flush
	}

  const CTX: any = getContext("ACCORDION") ?? {}

  let {
    children,
    title,
    content,
    id = generateToken(),
    animationSpeed = "fast",
    rounded = "md",
    size = CTX?.size ?? "default",
    containerClasses = "",
    contentClasses = "",
    titleClasses = "",
    openContainerClasses = "",
    openContentClasses = "",
    openTitleClasses = "",
    ...props
  } : Props = $props()

  let toggle = () => {
    const accordion = document.getElementById(id)
    if (!accordion) return

    if(CTX?.standalone){
      if(ST_ACTIVE_ACCORDIONS.value.includes(id)){
        ST_ACTIVE_ACCORDIONS.value = ST_ACTIVE_ACCORDIONS.value.filter(item => item !== id)
        accordion.style.height = '0px'
        accordion.classList.add('overflow-hidden')
      }else{
        ST_ACTIVE_ACCORDIONS.value.forEach((accordionID) => {
          if(accordionID !== ""){
            let activeAccordionEL = document.querySelector(`#${CTX?.id} #${accordionID}`) as HTMLElement
            if(!activeAccordionEL) return;
            ST_ACTIVE_ACCORDIONS.value = ST_ACTIVE_ACCORDIONS.value.filter(item => item !== accordionID)
            activeAccordionEL.style.height = `0px`
            activeAccordionEL.classList.add('overflow-hidden')
          }
        })

        ST_ACTIVE_ACCORDIONS.value.push(id)
        accordion.style.height = `${accordion.scrollHeight + 20}px`
        accordion.classList.remove('overflow-hidden')
      }
    }else{
      if(ST_ACTIVE_ACCORDIONS.value.includes(id)){
        ST_ACTIVE_ACCORDIONS.value = ST_ACTIVE_ACCORDIONS.value.filter(item => item !== id)
        accordion.style.height = '0px'
        accordion.classList.add('overflow-hidden')
      }else{
        ST_ACTIVE_ACCORDIONS.value.push(id)
        accordion.style.height = `${accordion.scrollHeight + 20}px`
        accordion.classList.remove('overflow-hidden')
      }
    }
  }

  onMount(() => {
    if(props?.open){
      if(CTX?.standalone) ST_ACTIVE_ACCORDIONS.value = [""]
      ST_ACTIVE_ACCORDIONS.value.push(id)
    }
  })

  let getContainerClasses = () => {
    let cls = `theui-accordion ${props?.flush ? "accordion-flush " : "accordion-default "} space-${size} ${ST_ACTIVE_ACCORDIONS.value.includes(id) ? " accordion-active " : " "}`;
    if(props?.flush){
      cls += `${ST_ACTIVE_ACCORDIONS.value.includes(id) ? "accordion-active " : ""} border-b `;
    }else{
      cls += `${CTX?.group ? `border-x border-t last:border-b ${roundedClass(rounded, "top", "first")} ${roundedClass(rounded, "bottom", "last")}` : `border ${roundedClass(rounded)}`}`;
    }
    cls += " border-gray-300 dark:border-gray-700 overflow-hidden ";
    return ST_ACTIVE_ACCORDIONS.value.includes(id) ? twMerge(cls, openContainerClasses) : twMerge(cls, containerClasses);
  }

  let getTitleClasses = () => {
    let cls = `accordion-title flex items-center w-full${animationClass(animationSpeed)} `;
    if(props?.flush){
      cls += ST_ACTIVE_ACCORDIONS.value.includes(id) ? "border-b border-brand-primary-200 bg-brand-primary-50 text-brand-primary-500 dark:border-brand-primary-700 dark:bg-brand-primary-900 dark:text-on-brand-primary-500 " : "border-b border-gray-300 dark:border-gray-700 ";
    }else{
      cls += ST_ACTIVE_ACCORDIONS.value.includes(id) ? "bg-brand-primary-500 text-on-brand-primary-300 dark:bg-brand-primary-700" : " ";
    }
    return ST_ACTIVE_ACCORDIONS.value.includes(id) ? twMerge(cls, openTitleClasses) : twMerge(cls, titleClasses);
  }

  let getContentClasses = () => {
    let cls = "accordion-content " + (!props?.flush ? roundedClass(rounded, "bottom") : "") + " h-full ";
    return ST_ACTIVE_ACCORDIONS.value.includes(id) ? twMerge(cls, openContentClasses) : twMerge(cls, contentClasses);
  }
</script>

<!-- Main component -->
<div class={getContainerClasses()}>
  <div id='{id}Heading' class='accordion-title' aria-controls={id} aria-label={`${title ?? ""} Accordion`} aria-expanded={ST_ACTIVE_ACCORDIONS.value.includes(id)}>
    {@render accordionHeading()}
  </div>
  <div {id} class='accordion-body{animationClass(animationSpeed)}' class:accordion-close={!ST_ACTIVE_ACCORDIONS.value.includes(id)} class:open={ST_ACTIVE_ACCORDIONS.value.includes(id)} aria-labelledby='{id}Heading' aria-hidden={!ST_ACTIVE_ACCORDIONS.value.includes(id)}>
    {@render accordionContent()}
  </div>
</div>

<!-- Component Snippet -->
{#snippet accordionHeading()}
  <button class={twMerge(getTitleClasses(), ST_ACTIVE_ACCORDIONS.value.includes(id) && 'accordion-active')} class:accordion-active={ST_ACTIVE_ACCORDIONS.value.includes(id)} onclick={()=>toggle()}>
    {#if typeof title === "string"}
      {@html title}
    {:else}
      {@render title?.()}
    {/if}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ms-auto" class:transition-transform={animationSpeed} class:transform={!animationSpeed} class:-rotate-180={ST_ACTIVE_ACCORDIONS.value.includes(id)} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
{/snippet}

{#snippet accordionContent()}
  <div class={getContentClasses()}>
  {#if content}
		{@html content}
	{:else}
		{#if children}
			{@render children?.()}
		{/if}
	{/if}
  </div>
{/snippet}

<style lang='postcss'>
  .theui-accordion.space-compact:not(.accordion-flush) .accordion-title button, .theui-accordion.space-compact .accordion-content{
    @apply p-3;
  }
  .theui-accordion.space-compact.accordion-flush .accordion-title button{
    @apply py-3 px-2;
  }
  .theui-accordion.space-default:not(.accordion-flush) .accordion-title button, .theui-accordion.space-default .accordion-content{
    @apply p-4;
  }
  .theui-accordion.space-default.accordion-flush .accordion-title button{
    @apply py-4 px-3;
  }
  .theui-accordion.space-large:not(.accordion-flush) .accordion-title button, .theui-accordion.space-large .accordion-content{
    @apply p-5;
  }
  .theui-accordion.space-large.accordion-flush .accordion-title button{
    @apply py-5 px-3;
  }
  .theui-accordion.space-default.accordion-flush .accordion-content{
    @apply py-4;
  }
  .theui-accordion.space-large.accordion-flush .accordion-content{
    @apply py-5;
  }
  .accordion-body{
    @apply overflow-hidden;
  }
  .accordion-body.accordion-close {
    @apply h-0;
  }
</style>