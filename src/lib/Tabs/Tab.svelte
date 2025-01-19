<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken, roundedClass } from "$lib/function"

  let {children, ...props} : {children : Snippet, [key: string] : unknown} = $props()
  const CTX = getContext('TAB') as any
  const id: string = generateToken()
  CTX.TABS.tabs.push(id)

  let selectTabL = (tab: string) => {
    const i = CTX.TABS.tabs.indexOf(tab)
    CTX.TABS.selectedTab = tab
    CTX.TABS.selectedPanel = CTX.TABS.panels[i]
  }

  let getClass = $derived(`${(CTX.variant == "pills" ? "theui-tab-pill" : "theui-tab")} px-8 py-3 text-center font-medium ${(CTX.TABS.selectedTab == id ? CTX?.activeTabClasses : CTX?.tabClasses)} ${roundedClass("md", (CTX.variant == "tabs" ? "top" : (CTX.borderClasses ? "top" : "all")))} ${animationClass(CTX.animate)}`)
</script>

<button {...props} class={twMerge(getClass, props?.class as string)} class:theui-tab-selected={CTX.TABS.selectedTab === id} onclick={() => selectTabL(id)}>
  {@render children?.()}
</button>