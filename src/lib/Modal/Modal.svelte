<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, generateToken, backdropClasses } from "$lib/function"
  import { Close, Button } from "$lib"
	import type { Snippet } from "svelte"

  interface Props{
    label?: string | Snippet,
    children?: Snippet,
    header?: Snippet,
    footer?: Snippet,
    animationSpeed?: ANIMATE_SPEED,
    animation?: 'slide-down' | 'slide-up' | 'fade' | 'zoom-in' | 'zoom-out',
    backdrop?: boolean|string,
    closeButton?: boolean,
    closeOnEsc?: boolean,
    modalFooterClasses?: string,
    modalHeaderClasses?: string,
    modalBodyClasses?: string,
    modalOuterClasses?: string,
    position?: 'top' | 'center' | 'bottom',
    rounded?: ROUNDED,
    buttonClasses?: string,
    size?: 'sm' | 'md' | 'lg' | 'full',
    staticBackdrop?: boolean,
    open?: boolean
  }

  let {
    label = "",
    children,
    header,
    footer,
    animationSpeed = "fast",
    animation = "fade",
    backdrop = true,
    closeButton = true,
    closeOnEsc = true,
    modalFooterClasses = "",
    modalHeaderClasses = "",
    modalBodyClasses = "",
    modalOuterClasses = "",
    position = "center",
    rounded = "md",
    buttonClasses = "",
    size = "md",
    staticBackdrop = false,
    open = $bindable(false),
  } : Props = $props()

  const id = generateToken()

  let toggle = ( closeButton = true ) => {
    open = !(document.getElementById(id)?.classList.contains('open') && (closeButton || (!closeButton && !staticBackdrop)))
  }

	let handleKeyboard = (e: KeyboardEvent) => {
		if (open && (closeOnEsc && e.code === "Escape")) {
      e.preventDefault()
      open = false
    }
	}

  let handleKeyboardEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      toggle();
    }
  }

  let sizes = {
    sm : "modal-sm w-full sm:w-96",
    md : "modal-md w-full md:w-[640px]",
    lg : "modal-lg w-full lg:w-[960px]",
    full : "modal-full w-full min-h-screen",
  }

  let positionClass = {top : "modal-top mb-auto", center : "modal-center my-auto", bottom : "modal-bottom mt-auto"}
  let modalCls = $derived(() => `theui-modal z-50 flex fixed inset-0 visible opacity-100 ${animationClass(animationSpeed)}`)
  let modalBodyCls = $derived(() => `modal-body flex flex-col p-8 relative mx-auto bg-white dark:bg-secondary ${sizes[size]} ${positionClass[position]} ${animationClass(animationSpeed)} ${((animationSpeed && animation) ? animation : "")}`)
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
  <div {id} class={twMerge(modalCls(), modalOuterClasses)} class:open={open} class:animate={animationSpeed}>
    {#if backdrop}
      <div class={backdropClasses(backdrop)} onclick={()=>toggle(false)} aria-hidden="true"></div>
    {/if}

    <div class={twMerge(modalBodyCls(), (size !== "full" ? roundedClass(rounded) : ""), modalBodyClasses)} role="dialog" aria-modal="true" aria-hidden={!open}>
      {#if header || closeButton}
        <div id="theui-modal-heading{id}" class={twMerge("theui-modal-header flex justify-between w-full gap-8 items-start", header && "border-b border-black/10 dark:border-black/50 pb-4 mb-8", modalHeaderClasses)}>
          {@render header?.()}
          {#if closeButton!==false}
            <Close class="text-default flex-grow-0 opacity-25 hover:opacity-75 transition-opacity ms-auto" onclick={()=>toggle()}/>
          {/if}
        </div>
      {/if}

      <div class="theui-modal-content w-full">
        {@render children()}
      </div>

      {#if footer}
        <div class={twMerge("theui-modal-footer border-t border-black/10 dark:border-black/50 pt-4 mt-8", modalFooterClasses)}>
          {@render footer?.()}
        </div>
      {/if}

    </div>
  </div>
{/if}

<style lang="postcss">
  @reference "../style.css";
  .theui-modal:not(.open){
    @apply invisible opacity-0;
  }
  .theui-modal .modal-body:not(.modal-full){
    @apply p-8;
  }
  .theui-modal.theui-animate .backdrop{
    @apply opacity-0;
  }
  .theui-modal.open .backdrop{
    @apply opacity-50 dark:opacity-75;
  }
  .theui-modal.theui-animate .modal-body.slide-down{
    @apply transform -translate-y-8;
  }
  .theui-modal.theui-animate .modal-body.slide-up{
    @apply transform translate-y-8;
  }
  .theui-modal.theui-animate .modal-body.zoom-in{
    @apply transform scale-90;
  }
  .theui-modal.theui-animate .modal-body.zoom-out{
    @apply transform scale-110;
  }
  .theui-modal.theui-animate.open .modal-body.slide-down, .theui-modal.theui-animate.open .modal-body.slide-up{
    @apply translate-y-0;
  }
  .theui-modal.theui-animate.open .modal-body.zoom-in, .theui-modal.theui-animate.open .modal-body.zoom-out{
    @apply scale-100;
  }
</style>