<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, generateToken, backdropClasses } from "$lib/function"
  import { Close, Button } from "$lib"
	import type { Snippet } from "svelte"

  interface Props{
    children?: Snippet,
    header?: Snippet | string,
    footer?: Snippet,
    label?: Snippet | string,
    animationSpeed?: ANIMATE_SPEED,
    animation?: 'slide-down' | 'slide-up' | 'fade' | 'zoom-in' | 'zoom-out',
    backdrop?: boolean|string,
    closeButton?: boolean|string,
    closeOnEsc?: boolean,
    footerClasses?: string,
    headerClasses?: string,
    bodyClasses?: string,
    containerClasses?: string,
    position?: 'top' | 'center' | 'bottom',
    rounded?: ROUNDED,
    buttonClasses?: string,
    size?: 'sm' | 'md' | 'lg' | 'full',
    staticBackdrop?: boolean,
    open?: boolean
  }

  let {
    children,
    header,
    footer,
    label = "",
    animationSpeed = "fast",
    animation = "fade",
    backdrop = true,
    closeButton = true,
    closeOnEsc = true,
    footerClasses = "",
    headerClasses = "",
    bodyClasses = "",
    containerClasses = "",
    position = "center",
    rounded = "md",
    buttonClasses = "",
    size = "md",
    staticBackdrop = false,
    open = $bindable(false),
  } : Props = $props()

  const id = generateToken()

  const toggle = () => open = !open

	const handleKeyboard = (e: KeyboardEvent) => {
		if (open && (closeOnEsc && e.code === "Escape")) {
      e.preventDefault()
      open = false
    }
	}

  const handleKeyboardEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      toggle()
    }
  }

  const positionClasses = {
    top : "modal-top mb-auto",
    center : "modal-center my-auto",
    bottom : "modal-bottom mt-auto"
  }[position ?? 'center']

  const sizeClasses = {
    sm : "modal-sm w-full sm:w-96",
    md : "modal-md w-full md:w-[640px]",
    lg : "modal-lg w-full lg:w-[960px]",
    full : "modal-full w-full min-h-screen",
  }[size ?? "md"]

  const transformClasses: string = {
    "slide-up": "transform translate-y-8",
    "slide-down": "transform -translate-y-8",
    "fade": "",
    "zoom-in": "transform scale-90",
    "zoom-out": "transform scale-110"
  }[animation ?? "fade"]

  const openTransformClasses: string = {
    "slide-up": "transform translate-y-0",
    "slide-down": "transform translate-y-0",
    "fade": "",
    "zoom-in": "transform scale-100",
    "zoom-out": "transform scale-100"
  }[animation ?? "fade"]

  const containerCls = twMerge(`theui-modal z-400 flex fixed inset-0 ${animationClass(animationSpeed)}`, containerClasses)

  const bodyCls: string = $derived(
    twMerge(
      `modal-body flex flex-col p-8 relative mx-auto bg-white dark:bg-secondary ${sizeClasses} ${positionClasses}${animationClass(animationSpeed)}`,
      size !== "full" && "p-8",
      transformClasses, open && openTransformClasses,
      bodyClasses,
      size !== "full" && roundedClass(rounded),
    )
  )

  const headerCls: string = twMerge("theui-modal-header flex justify-between w-full gap-8 items-start", header && "border-b border-black/10 dark:border-black/50 pb-4 mb-4", headerClasses)

  const footerCls: string = twMerge("theui-modal-footer border-t border-black/10 dark:border-black/50 pt-4 mt-8", footerClasses)

  const closeButtonCls: string = twMerge("text-default flex-grow-0 opacity-25 hover:opacity-75 transition-opacity ms-auto", typeof closeButton == "string" && closeButton)
</script>

<svelte:body onkeydown={(e)=>handleKeyboard(e)}></svelte:body>

{#if label}
  {#if typeof label == "string"}
    <Button id={`theui-modal-trigger${id}`}
    aria-controls={id}
    aria-expanded={open}
    aria-haspopup="dialog"
    aria-labelledby={header ? `$theui-modal-heading{id}` : `theui-modal-trigger${id}`}
    aria-describedby={`${id}-modal-body`}
    onclick={()=>toggle()}
    class={buttonClasses}>{label}</Button>
  {:else}
    <span id={`theui-modal-trigger${id}`}
      aria-controls={id}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-labelledby={header ? `$theui-modal-heading{id}` : `theui-modal-trigger${id}`}
      aria-describedby={`${id}-modal-body`}
      onclick={()=>toggle()} onkeydown={(e: KeyboardEvent)=>handleKeyboardEnter(e)} role="button" tabindex="0"
      class={buttonClasses}>
      {@render label?.()}
    </span>
  {/if}
{/if}

{#if children}
  <div {id} class={containerCls} class:invisible={!open} class:opacity-0={!open}>
    {#if backdrop && open}
      <div class={backdropClasses(backdrop)} onclick={()=>staticBackdrop ? false : toggle()} aria-hidden="true"></div>
    {/if}

    <div class={bodyCls} role="dialog" aria-modal="true" aria-hidden={!open}>
      {#if header || closeButton}
        <div id="theui-modal-heading{id}" class={headerCls}>
          {#if typeof header === "function"}
            {@render header?.()}
          {:else}
            <h5 class="text-xl font-medium text-muted">{@html header}</h5>
          {/if}
          {#if closeButton!==false}
            <Close class={closeButtonCls} onclick={()=>toggle()}/>
          {/if}
        </div>
      {/if}

      <div class="theui-modal-content w-full">
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