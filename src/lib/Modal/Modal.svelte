<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { animationClass, roundedClass, generateToken, backdropClasses, coreSpeed } from "$lib/function"
  import { ST_OPEN_MODALS, registerModal, unregisterModal } from "$lib/state.svelte"
  import { Close, Button } from "$lib"

  interface Props{
    children?: Snippet,
    label?: Snippet | string,
    header?: Snippet | string,
    footer?: Snippet,
    position?: 'top' | 'center' | 'bottom',
    size?: 'sm' | 'md' | 'lg' | 'full',
    animation?: 'slide-down' | 'slide-up' | 'fade' | 'zoom-in' | 'zoom-out',
    animationSpeed?: ANIMATE_SPEED,
    backdrop?: boolean|string,
    staticBackdrop?: boolean,
    closeButton?: boolean|string,
    ariaLabel?: string,
    rounded?: ROUNDED,
    open?: boolean,
    buttonClasses?: string,
    containerClasses?: string,
    bodyClasses?: string,
    headerClasses?: string,
    footerClasses?: string
  }

  let {
    children,
    label,
    header,
    footer,
    position = "center",
    size = "md",
    animation = "fade",
    animationSpeed = coreSpeed("fast"),
    backdrop = true,
    staticBackdrop = false,
    closeButton = true,
    ariaLabel = "Modal",
    rounded = "md",
    open = $bindable(false),
    buttonClasses,
    containerClasses,
    bodyClasses,
    headerClasses,
    footerClasses,
  } : Props = $props()

  const id = generateToken()

  const toggle = () => open = !open

  const handleKeyboard = (e: KeyboardEvent) => {
    if (open && e.code === "Escape") {
      const topmost = ST_OPEN_MODALS[ST_OPEN_MODALS.length - 1]
      if (topmost === id) {
        e.preventDefault()
        open = false
      }
    }
  }

  const handleKeyboardEnterSpace = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggle()
    }
  }

  const positionClasses = $derived({
    top : "modal-top mb-auto",
    center : "modal-center my-auto",
    bottom : "modal-bottom mt-auto"
  }[position ?? 'center'])

  const sizeClasses = $derived({
    sm : "modal-sm w-full sm:w-96",
    md : "modal-md w-full md:w-[640px]",
    lg : "modal-lg w-full lg:w-[960px]",
    full : "modal-full w-full min-h-screen",
  }[size ?? "md"])

  const transformClasses: string = $derived({
    "slide-up": "transform translate-y-8",
    "slide-down": "transform -translate-y-8",
    "fade": "",
    "zoom-in": "transform scale-90",
    "zoom-out": "transform scale-110"
  }[animation ?? "fade"])

  const openTransformClasses: string = $derived({
    "slide-up": "transform translate-y-0",
    "slide-down": "transform translate-y-0",
    "fade": "",
    "zoom-in": "transform scale-100",
    "zoom-out": "transform scale-100"
  }[animation ?? "fade"])

  const containerCls = $derived(twMerge(`theui-modal z-400 flex fixed inset-0 ${animationClass(animationSpeed)}`, containerClasses))

  const bodyCls: string = $derived(
    twMerge(
      "modal-body flex flex-col p-8 relative mx-auto bg-white dark:bg-secondary relative",
      sizeClasses, positionClasses, animationClass(animationSpeed),
      size !== "full" && "p-8",
      transformClasses, open && openTransformClasses,
      bodyClasses,
      size !== "full" && roundedClass(rounded),
    )
  )

  const headerCls: string = $derived(twMerge("theui-modal-header flex justify-between w-full gap-8 items-start relative", header && "border-b border-black/10 dark:border-black/50 pb-2 mb-6", headerClasses))

  const footerCls: string = $derived(twMerge("theui-modal-footer border-t border-black/10 dark:border-black/50 pt-4 mt-8", footerClasses))

  const closeButtonCls: string = $derived(twMerge("text-default flex-grow-0 opacity-25 hover:opacity-75 transition-opacity ms-auto absolute -top-4 -end-4", typeof closeButton === "string" && closeButton))

  let dialogEl = $state<HTMLElement>()

  // Closing or removing the modal runs the cleanup, which takes it off the list
  $effect(() => {
    if (!open) return
    registerModal(id)
    return () => unregisterModal(id)
  })

  // Body scroll lock
  $effect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  })

  let previousFocus = $state<HTMLElement | null>(null)
  const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

  $effect(() => {
    if (!open || !dialogEl) return
    previousFocus = document.activeElement as HTMLElement
    const focusable = dialogEl.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (focusable.length) {
      focusable[0].focus()
    } else {
      dialogEl.focus()
    }

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      const focusable = dialogEl!.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", trapFocus)

    return () => {
      document.removeEventListener("keydown", trapFocus)
      if (previousFocus) previousFocus.focus()
    }
  })
</script>

<svelte:body onkeydown={(e)=>handleKeyboard(e)}></svelte:body>

{#if label}
  {#if typeof label === "string"}
    <Button id={`theui-modal-trigger-${id}`}
    aria-controls={id}
    aria-expanded={open}
    aria-haspopup="dialog"
    onclick={()=>toggle()}
    class={buttonClasses}>{label}</Button>
  {:else}
    <span id={`theui-modal-trigger-${id}`}
      aria-controls={id}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label={ariaLabel}
      onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnterSpace(e)} role="button" tabindex="0"
      class={buttonClasses}>
      {@render label?.()}
    </span>
  {/if}
{/if}

{#if children}
  <div {id} class={containerCls} class:invisible={!open} class:opacity-0={!open} inert={!open}>
    {#if backdrop && open}
      <div class={backdropClasses(backdrop)} onclick={() => { if (!staticBackdrop) toggle() }} aria-hidden="true"></div>
    {/if}

    <div bind:this={dialogEl} class={bodyCls} role="dialog" tabindex="-1" aria-modal="true" aria-hidden={!open} aria-labelledby={header ? `theui-modal-heading-${id}` : undefined} aria-label={header ? undefined : ariaLabel} aria-describedby={`${id}-modal-body`}>
      {#if header || closeButton}
        <div class={headerCls}>
          {#if typeof header === "function"}
            <div id="theui-modal-heading-{id}" class="contents">{@render header?.()}</div>
          {:else if header}
            <h5 id="theui-modal-heading-{id}" class="text-xl font-medium text-muted">{header}</h5>
          {/if}
          {#if closeButton!==false}
            <Close class={closeButtonCls} onclick={()=>toggle()}/>
          {/if}
        </div>
      {/if}

      <div id="{id}-modal-body" class="theui-modal-content w-full">
        {@render children()}
      </div>

      {#if footer}
        <div class={footerCls}>
          {@render footer?.()}
        </div>
      {/if}

    </div>
  </div>
{/if}
