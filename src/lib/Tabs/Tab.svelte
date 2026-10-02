<script lang="ts">
  import { getContext, onDestroy, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
	import type { TABS_CONTEXT } from "$lib/types"
  import { animationClass, generateToken, roundedClass } from "$lib/function"

  let {value, children, ...props} : {value: string, children : Snippet, [key: string] : unknown} = $props()
  const CTX: TABS_CONTEXT = getContext('TAB')
  const id: string = generateToken()
  CTX.TABS.tabIds.push(id)

  // Kept in an effect so the lookup follows `value` if it changes, and clears itself when
  // this tab goes away.
  $effect(() => {
    CTX.TABS.tabIdByValue[value] = id
    return () => { delete CTX.TABS.tabIdByValue[value] }
  })

  const selectTabL = (tab: string) => {
    CTX.TABS.selectedTabId = tab
    CTX.TABS.selectedValue = value
    CTX.TABS.selectedPanelId = CTX.TABS.panelIdByValue[value] ?? null
  }

  let getClass = $derived(`${(CTX.variant == "pills" ? "theui-tab-pill" : "theui-tab")} px-8 py-3 text-center font-medium cursor-pointer ${roundedClass("md", (CTX.variant == "tabs" ? "top" : (CTX.border ? "top" : "all")))} ${animationClass(CTX.animationSpeed)}`)
  const panelId = $derived(CTX.TABS.panelIdByValue[value] ?? undefined)

  let mergedClass = $derived(twMerge(getClass, CTX?.tabClasses, (CTX.TABS.selectedTabId == id ? CTX?.tabActiveClasses : ""), props?.class as string))

  onDestroy(() => {
    const idx = CTX.TABS.tabIds.indexOf(id)
    if (idx !== -1) CTX.TABS.tabIds.splice(idx, 1)
  })

</script>

<button
  {id}
  {...props}
  class={mergedClass}
  class:theui-tab-selected={CTX.TABS.selectedTabId === id}

  role="tab"
  aria-selected={CTX.TABS.selectedTabId === id ? "true" : "false"}
  aria-controls={panelId}

  onclick={() => selectTabL(id)}
>
  {@render children?.()}
</button>
