<script lang="ts">
  import { onMount, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { ROUNDED } from "$lib/types"
  import { roundedClass, backdropClasses } from "$lib/function"

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

  const safeGetItem = (key: string): string | null => {
    try { return localStorage.getItem(key) } catch { return null }
  }
  const safeSetItem = (key: string, value: string): void => {
    try { localStorage.setItem(key, value) } catch { /* storage unavailable */ }
  }

  let cleanupExitListener: (() => void) | undefined

  const showEntryPopup = () => {
    if (repeat === false) {
      if (safeGetItem("entryPopUp")) return
      safeSetItem("entryPopUp", "true")
    } else if (repeat === "page") {
      try {
        const epData: string[] = JSON.parse(safeGetItem("entryPopUp") || "[]")
        if (epData.includes(window.location.href)) return
        epData.push(window.location.href)
        safeSetItem("entryPopUp", JSON.stringify(epData))
      } catch { /* corrupted data, proceed */ }
    }
    entryPopup = true
  }

  onMount(() => {
    if (trigger === "onEntry" || trigger === "onEntryExit") {
      showEntryPopup()
    }

    if (trigger === "onExit" || trigger === "onEntryExit") {
      const showExitPopup = (e: MouseEvent) => {
        const target = e.target instanceof Element ? e.target : null
        if (e.clientY < 50 && e.relatedTarget === null && target?.nodeName.toLowerCase() !== 'select') {
          entryPopup = false
          if (repeat === false) {
            if (safeGetItem("exitPopUp")) {
              document.removeEventListener("mouseout", showExitPopup)
              return
            }
            safeSetItem("exitPopUp", "true")
          } else if (repeat === "page") {
            try {
              const epData: string[] = JSON.parse(safeGetItem("exitPopUp") || "[]")
              if (epData.includes(window.location.href)) {
                document.removeEventListener("mouseout", showExitPopup)
                return
              }
              epData.push(window.location.href)
              safeSetItem("exitPopUp", JSON.stringify(epData))
            } catch { /* corrupted data, proceed */ }
          }
          exitPopup = true
          if (repeat !== true) {
            document.removeEventListener("mouseout", showExitPopup)
          }
        }
      }

      document.addEventListener("mouseout", showExitPopup)
      cleanupExitListener = () => document.removeEventListener("mouseout", showExitPopup)
      return () => { cleanupExitListener?.() }
    }
  })

	const handleKeyboard = (e: KeyboardEvent) => {
		if (e.code === "Escape"){
      e.preventDefault()
      entryPopup = false
      exitPopup = false
    }
	}

  const handleBackdrop = () => {
		if (!staticBackdrop){
      entryPopup = false
      exitPopup = false
    }
  }
</script>

<svelte:body onkeydown={(e)=>handleKeyboard(e)}></svelte:body>

{#if entryPopup || exitPopup}
<div {...props} class="theui-popup z-500 fixed inset-0 overflow-y-hidden flex items-center justify-center" class:entry-popup={trigger === "onEntry"} class:exit-popup={trigger === "onExit"} role="dialog" aria-modal="true">
  {#if backdrop}
    <div role="presentation" class={backdropClasses(backdrop)} onclick={()=>staticBackdrop ? false : handleBackdrop()}></div>
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
