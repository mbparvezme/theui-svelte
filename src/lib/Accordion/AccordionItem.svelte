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
  
  const id = generateToken()
  const isFlush = props?.flush || CTX?.flush
  let active = $derived(ST_ACTIVE_ACCORDIONS.value.includes(id))

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
      active = true
    }
  })

  const titleClass: Record<'default'|'flush', Record<keyof ACCORDION_SIZE, string>> = {
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

  const contentClass: Record<'default'|'flush', Record<keyof ACCORDION_SIZE, string>> = {
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

  const containerBorder: string = isFlush ? "border-b" : `${CTX?.group ? "border-x border-t last:border-b" : "border"}`
  const containerRounded: string = isFlush ? "" : `${CTX?.group ? `${roundedClass(rounded, "top", "first")}${roundedClass(rounded, "bottom", "last")} [&:not(:first-child)_button]:rounded-t-none!` : roundedClass(rounded)}`

  const triggerClasses = {
    default: "bg-brand-primary-500 text-on-brand-primary dark:bg-brand-primary-600",
    flush: {
      notActive: "border-b border-gray-300 dark:border-gray-700",
      active: "border-b border-brand-primary-200 dark:border-brand-primary-700 bg-brand-primary-100 dark:bg-brand-primary-900 text-brand-primary-800 dark:text-brand-primary-100",
    }
  }

  const getContainerClasses = $derived(() => twMerge(
    `theui-accordion border-gray-300 dark:border-gray-700 ${active ? "accordion-active " : ""}
    ${containerBorder} ${containerRounded}`, (active ? openContainerClasses : containerClasses)
  ))

  const getTitleClasses = $derived(() => {
    let cls = `theui-accordion-trigger flex items-center w-full cursor-pointer ring-4 theui-ring-brand
      ${titleClass[isFlush ? "flush" : "default"][size]}
      ${isFlush ? "" : roundedClass(rounded, "top")}${animationClass(animationSpeed)}
      ${isFlush ? (active ? triggerClasses.flush.active : triggerClasses.flush.notActive) : (active ? triggerClasses.default : " ")}`
    return twMerge(cls, active ? openTitleClasses : titleClasses);
  })

  const getContentClasses = () => twMerge(`theui-accordion-content ${contentClass[isFlush ? "flush" : "default"][size]} ${(!isFlush ? roundedClass(rounded, "bottom") : "")} h-full`, contentClasses)
</script>

<div class={getContainerClasses()}>
  <div id='theui-accordion-heading{id}' class='theui-accordion-title' aria-controls={id} aria-expanded={active}>
    {#if title}
      {@render accordionHeading()}
    {/if}
  </div>
  <div {id} class="theui-accordion-body overflow-hidden {animationClass(animationSpeed)}" class:h-0={!active} class:open={active} aria-labelledby='theui-accordion-trigger{id}' aria-hidden={!active}>
    <div id="theui-accordion-content{id}" class={getContentClasses()}>
      {@render children?.()}
    </div>
  </div>
</div>

{#snippet accordionHeading()}
  <button id="theui-accordion-trigger{id}" class={getTitleClasses()} onclick={()=>toggle()} aria-controls={id} aria-label={`${typeof title === "string" ? title : ""} Accordion`} aria-expanded={active} aria-describedby={id} type="button">
    {#if typeof title === "string"}
      {@html title}
    {:else}
      {@render title?.()}
    {/if}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ms-auto" class:transition-transform={animationSpeed} class:transform={!animationSpeed} class:-rotate-180={active} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
{/snippet}