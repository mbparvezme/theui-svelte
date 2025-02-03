<script lang="ts">
  import { onMount, onDestroy, type Snippet } from "svelte"
  import type { ROUNDED } from "$lib/types"
  import { roundedClass, backdropClasses } from "$lib/function"
  import { twMerge } from "tailwind-merge"

  interface Props {
    children ?: Snippet,
    entryContent ?: Snippet,
    exitContent ?: Snippet,
    trigger ?: 'onEntry' | 'onExit' | 'onEntryExit',
    repeat ?: boolean | 'page',
    backdrop ?: boolean|string,
    staticBackdrop ?: boolean,
    rounded ?: ROUNDED,
    [key: string]: unknown // class
  }

  let {
    children,
    entryContent,
    exitContent,
    trigger = "onEntry", 
    repeat = true,
    backdrop = true,
    staticBackdrop = false,
    rounded = "xl",
    ...props // class
  } : Props = $props()

  let entryPopup = $state(false)
  let exitPopup = $state(false)

  const showEntryPopup = () => {
    // Logic for controlling entry popup display based on repeat settings
    if (repeat === false) {
      if (localStorage.getItem("entryPopUp")) return;
      localStorage.setItem("entryPopUp", "true");
    } else if (repeat === "page") {
      let epData = JSON.parse(localStorage.getItem("entryPopUp") || "[]");
      if (!epData.includes(window.location.href)) {
        epData.push(window.location.href);
        localStorage.setItem("entryPopUp", JSON.stringify(epData));
      }
    }
    entryPopup = true;
  };

  const showExitPopup = (e: any) => {
    const target = e.target;
    if (e.clientY < 50 && e.relatedTarget === null && target?.nodeName.toLowerCase() !== 'select') {
      entryPopup = false; // Hide entry popup if exit popup is shown
      if (repeat === false) {
        if (localStorage.getItem('exitPopUp')) return;
        localStorage.setItem('exitPopUp', 'true');
      } else if (repeat === "page") {
        let epData = JSON.parse(localStorage.getItem('exitPopUp') || '[]');
        if (!epData.includes(window.location.href)) {
          epData.push(window.location.href);
          localStorage.setItem('exitPopUp', JSON.stringify(epData));
        }
      }
      exitPopup = true;
      document.removeEventListener("mouseout", showExitPopup); // Remove after triggering once if repeat is "page"
    }
  };

  onMount(() => {
    if (typeof window !== 'undefined') {
      if (trigger === "onEntry" || trigger === "onEntryExit") {
        showEntryPopup();
      }
      if (trigger === "onExit" || trigger === "onEntryExit") {
        document.addEventListener("mouseout", showExitPopup);
      }
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      document.removeEventListener("mouseout", showExitPopup);
    }
  });

	let handleKeyboard = (e: KeyboardEvent) => {
		if (e.code === "Escape"){
      e.preventDefault()
      entryPopup = false
      exitPopup = false
    }
	}

  let handleBackdrop = () => {
		if (staticBackdrop === false){
      entryPopup = false
      exitPopup = false
    }
  }
</script>

<svelte:body on:keydown={(e)=>handleKeyboard(e)}></svelte:body>

{#if entryPopup || exitPopup}
<div {...props} class="theui-popup !z-[80] fixed inset-0 overflow-y-hidden flex items-center justify-center" class:entry-popup={trigger == "onEntry"} class:exit-popup={trigger == "onExit"} role='dialog'>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  {#if backdrop !== false}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class={backdropClasses(backdrop)} onclick={()=>handleBackdrop()}></div>
  {/if}
  <div class="popup-content overflow-y-auto relative {twMerge("bg-secondary max-w-3xl max-h-screen p-8", props?.class as string)} {roundedClass(rounded)}">
    
    {@render children?.()}

    {#if entryPopup}
      {@render entryContent?.()}
    {/if}
    {#if exitPopup}
      {@render exitContent?.()}
    {/if}

  </div>
</div>
{/if}