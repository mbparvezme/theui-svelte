<script lang="ts">
  import { getContext, onMount, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { ACCORDION_CONTEXT, ACCORDION_SIZE, ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { generateToken, roundedClass, animationClass, coreSpeed } from "$lib/function"
  import { ST_ACTIVE_ACCORDIONS } from "$lib/state.svelte"

  interface Props {
    children?: Snippet,
    title?: string | Snippet,
    size?: ACCORDION_SIZE,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    containerClasses?: string,
    openContainerClasses?: string,
    titleClasses?: string,
    openTitleClasses?: string,
    contentClasses?: string,
    // Open when the page loads
    open?: boolean,
    // Borderless look, inherited from the Accordion when it sets it
    flush?: boolean,
    [key: string]: unknown  // class, id, data-*
  }

  const CTX: ACCORDION_CONTEXT = getContext("ACCORDION") || {}

  let {
    children,
    title,
    animationSpeed       = CTX?.animationSpeed ?? coreSpeed("fast"),
    size                 = CTX?.size ?? "default",
    rounded              = CTX?.rounded ?? "md",
    containerClasses     = CTX?.containerClasses ?? "",
    openContainerClasses = CTX?.openContainerClasses ?? "",
    titleClasses         = CTX?.titleClasses ?? "",
    openTitleClasses     = CTX?.openTitleClasses ?? "",
    contentClasses       = CTX?.contentClasses ?? "",
    open                 = false,
    flush                = false,
    ...props
  }: Props = $props()

  const id      = generateToken()
  const groupId = CTX?.id ?? "_default"
  const isFlush = $derived(!!(flush || CTX?.flush))

  let accordionEl: HTMLElement | null = null

  let active = $derived((ST_ACTIVE_ACCORDIONS.value[groupId] ?? []).includes(id))

  const openAccordion = (el: HTMLElement) => {
    el.style.transition = "none"
    el.style.height = "auto"
    const targetHeight = el.getBoundingClientRect().height
    el.style.height = "0px"
    el.style.overflow = "hidden"
    void el.offsetHeight  // force reflow - browser commits 0px as start point

    el.style.transition = ""
    el.style.height = `${targetHeight}px`

    if (!animationSpeed || animationSpeed === "none") {
      el.style.height = "auto"
      el.style.overflow = ""
      return
    }

    // The opening ends by letting the height go back to auto, so the content can grow later
    const finish = (e: TransitionEvent) => {
      if (e.target !== el || e.propertyName !== "height") return
      el.removeEventListener("transitionend", finish)
      // A close that started before the opening finished leaves the body at 0px.
      // Setting the height back to auto here would show the item as open again.
      if (el.style.height === "0px") return
      el.style.height = "auto"
      el.style.overflow = ""
    }
    el.addEventListener("transitionend", finish)
  }

  const closeAccordion = (el: HTMLElement) => {
    if (!animationSpeed || animationSpeed === "none") {
      el.style.height = "0px"
      el.style.overflow = "hidden"
      return
    }

    const currentHeight = el.getBoundingClientRect().height
    el.style.height = `${currentHeight}px`
    el.style.overflow = "hidden"
    void el.offsetHeight  // force reflow - browser commits currentHeight px as start point
    el.style.height = "0px"
  }

  const closeSibling = (accordionID: string) => {
    const el = document.querySelector(`#${CTX?.id} #${accordionID}`) as HTMLElement | null
    if (el) closeAccordion(el)
  }

  const toggle = () => {
    if (!accordionEl) return
    if (active) {
      ST_ACTIVE_ACCORDIONS.value[groupId] = (ST_ACTIVE_ACCORDIONS.value[groupId] ?? []).filter(i => i !== id)
      closeAccordion(accordionEl)
    } else {
      if (CTX?.standalone) {
        ;(ST_ACTIVE_ACCORDIONS.value[groupId] ?? []).forEach(closeSibling)
        ST_ACTIVE_ACCORDIONS.value[groupId] = []
      }
      ST_ACTIVE_ACCORDIONS.value[groupId] = [...(ST_ACTIVE_ACCORDIONS.value[groupId] ?? []), id]
      openAccordion(accordionEl)
    }
  }

  // Read once on purpose. It only sets the height the body starts at; from then on the
  // open and close handlers set the height themselves, and a reactive style attribute
  // would overwrite them mid-animation.
  // svelte-ignore state_referenced_locally
  const initialBodyStyle = open ? "height: auto;" : "height: 0px; overflow: hidden;"

  onMount(() => {
    if (open) {
      if (CTX?.standalone) ST_ACTIVE_ACCORDIONS.value[groupId] = []
      ST_ACTIVE_ACCORDIONS.value[groupId] = [...(ST_ACTIVE_ACCORDIONS.value[groupId] ?? []), id]
    }
  })

  const titlePadding: Record<"default" | "flush", Record<ACCORDION_SIZE, string>> = {
    default: { compact: "p-3", default: "p-4", large: "p-5" },
    flush:   { compact: "py-3 px-2", default: "py-4 px-3", large: "py-5 px-3" }
  }

  const contentPadding: Record<"default" | "flush", Record<ACCORDION_SIZE, string>> = {
    default: { compact: "p-3", default: "p-4", large: "p-5" },
    flush:   { compact: "p-3", default: "p-4", large: "p-5" }
  }

  const containerBorder = $derived(isFlush
    ? "border-b"
    : CTX?.group ? "border-x border-t last:border-b" : "border")

  const containerRounded = $derived(isFlush
    ? ""
    : CTX?.group
      ? `${roundedClass(rounded, "top", "first")}${roundedClass(rounded, "bottom", "last")} [&:not(:first-child)_button]:rounded-t-none!`
      : roundedClass(rounded))

  const triggerTheme = {
    default:       "bg-brand-500 text-on-brand dark:bg-brand-600",
    flushActive:   "border-b border-brand-200 dark:border-brand-700 bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-100",
    flushInactive: "border-b border-gray-300 dark:border-gray-700"
  }

  const containerClass = $derived(twMerge(
    "theui-accordion border-gray-300 dark:border-gray-700",
    active ? "accordion-active" : "",
    containerBorder,
    containerRounded,
    containerClasses,
    active ? openContainerClasses : ""
  ))

  const titleClass = $derived(twMerge(
    "theui-accordion-trigger flex items-center w-full cursor-pointer",
    titlePadding[isFlush ? "flush" : "default"][size],
    isFlush ? "" : roundedClass(rounded, "top"),
    animationClass(animationSpeed),
    isFlush
      ? active ? triggerTheme.flushActive : triggerTheme.flushInactive
      : active ? triggerTheme.default : "",
    titleClasses,
    active ? "focus:ring-4 focus:ring-brand-300" : "",
    active ? openTitleClasses : ""
  ))

  const contentClass = $derived(twMerge(
    "theui-accordion-content h-full",
    contentPadding[isFlush ? "flush" : "default"][size],
    isFlush ? "" : roundedClass(rounded, "bottom"),
    contentClasses
  ))
</script>

<div {...props} class={twMerge(containerClass, props?.class as string)}>
  <div id="theui-accordion-heading{id}" class="theui-accordion-title" aria-controls={id} aria-expanded={active}>
    {#if title}
      {@render accordionHeading()}
    {/if}
  </div>
  <div
    bind:this={accordionEl}
    {id}
    style={initialBodyStyle}
    class="theui-accordion-body {animationClass(animationSpeed)}"
    aria-labelledby="theui-accordion-trigger{id}"
    aria-hidden={!active}
  >
    <div id="theui-accordion-content{id}" class={contentClass}>
      {@render children?.()}
    </div>
  </div>
</div>

{#snippet accordionHeading()}
  <button
    id="theui-accordion-trigger{id}"
    class={titleClass}
    onclick={toggle}
    aria-controls={id}
    aria-label="{typeof title === 'string' ? title : ''} Accordion"
    aria-expanded={active}
    type="button"
  >
    {#if typeof title === "string"}
      {title}
    {:else}
      {@render title?.()}
    {/if}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 ms-auto {animationClass(animationSpeed, 'transform')}"
      class:-rotate-180={active}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
{/snippet}