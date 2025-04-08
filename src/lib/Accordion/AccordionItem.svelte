<script lang="ts">
  import type { ACCORDION_SIZE, ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { getContext, onMount, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { generateToken, roundedClass, animationClass } from "$lib/function"
  import { ST_ACTIVE_ACCORDIONS } from "$lib/state.svelte"

  interface Props {
    children?: Snippet,
    title?: string|Snippet,
    size?: ACCORDION_SIZE,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    containerClasses?: string,
    openContainerClasses?: string,
    titleClasses?: string,
    openTitleClasses?: string,
    contentClasses?: string,
    [key: string] : unknown   // open, flush
	}

  const CTX: any = getContext("ACCORDION") || {}

  let {
    children,
    title,
    animationSpeed        = CTX?.animationSpeed ?? "fast",
    size                  = CTX?.size ?? "default",
    rounded               = CTX?.rounded ?? "md",
    containerClasses      = CTX?.containerClasses ?? "",
    openContainerClasses  = CTX?.openContainerClasses ?? "",
    titleClasses          = CTX?.titleClasses ?? "",
    openTitleClasses      = CTX?.openTitleClasses ?? "",
    contentClasses        = CTX?.contentClasses ?? "",
    ...props
  } : Props = $props()
  
  const id = props?.id as string ?? generateToken()
  const isFlush = props?.flush || CTX?.flush

  const toggle = () => {
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

  const titleClass = {
    default: {
      compact: "p-3",
      default: "p-4",
      large: "p-5"
    },
    flush: {
      compact: "py-3 px-2",
      default: "py-4 px-3",
      large: "py-5 px-3"
    }
  }

  const contentClass = {
    default: {
      compact: "p-3",
      default: "p-4",
      large: "p-5"
    },
    flush: {
      compact: "p-3",
      default: "p-4",
      large: "p-5"
    }
  }

  const getContainerClasses = () => {
    let cls = `theui-accordion ${ST_ACTIVE_ACCORDIONS.value.includes(id) ? "accordion-active " : ""}`;
    if(isFlush){
      cls += "border-b ";
    }else{
      cls += `${CTX?.group ? `border-x border-t last:border-b ${roundedClass(rounded, "top", "first")} ${roundedClass(rounded, "bottom", "last")}` : `border ${roundedClass(rounded)}`}`;
    }
    cls += " border-gray-300 dark:border-gray-700 overflow-hidden ";
    return ST_ACTIVE_ACCORDIONS.value.includes(id) ? twMerge(cls, openContainerClasses) : twMerge(cls, containerClasses);
  }

  const getTitleClasses = () => {
    let cls = `theui-accordion-title flex items-center w-full ${titleClass[isFlush ? "flush" : "default"][size]}${animationClass(animationSpeed)} `;
    if(isFlush){
      cls += ST_ACTIVE_ACCORDIONS.value.includes(id) ? "border-b border-brand-primary-200 bg-brand-primary-50 text-brand-primary-500 dark:border-brand-primary-700 dark:bg-brand-primary-900 dark:text-on-brand-primary-500 " : "border-b border-gray-300 dark:border-gray-700 ";
    }else{
      cls += ST_ACTIVE_ACCORDIONS.value.includes(id) ? "bg-brand-primary-500 text-on-brand-primary-300 dark:bg-brand-primary-700" : " ";
    }
    return twMerge(cls, ST_ACTIVE_ACCORDIONS.value.includes(id) ? openTitleClasses : titleClasses);
  }

  const getContentClasses = () => {
    return twMerge(`theui-accordion-content ${contentClass[isFlush ? "flush" : "default"][size]} ${(!isFlush ? roundedClass(rounded, "bottom") : "")} h-full`, contentClasses);
  }
</script>

<div class={getContainerClasses()}>
  <div id='{id}-heading' class='accordion-title' aria-controls={id} aria-label={`${title ?? ""} Accordion`} aria-expanded={ST_ACTIVE_ACCORDIONS.value.includes(id)} aria-describedby={id}>
    {@render accordionHeading()}
  </div>
  <div {id} class="accordion-body overflow-hidden {animationClass(animationSpeed)}" class:h-0={!ST_ACTIVE_ACCORDIONS.value.includes(id)} class:open={ST_ACTIVE_ACCORDIONS.value.includes(id)} aria-labelledby='{id}-heading' aria-hidden={!ST_ACTIVE_ACCORDIONS.value.includes(id)}>
    <div class={getContentClasses()}>
      {@render children?.()}
    </div>
  </div>
</div>

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