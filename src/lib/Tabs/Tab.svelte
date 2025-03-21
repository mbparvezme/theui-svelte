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

  let getClass = $derived(`${(CTX.variant == "pills" ? "theui-tab-pill" : "theui-tab")} px-8 py-3 text-center font-medium ${roundedClass("md", (CTX.variant == "tabs" ? "top" : (CTX.border ? "top" : "all")))} ${animationClass(CTX.animationSpeed)}`)
</script>

<button
  {id}
  {...props}
  class={twMerge(getClass, CTX?.tabClasses, (CTX.TABS.selectedTab == id ? CTX?.tabActiveClasses : ""), props?.class as string)}
  class:theui-tab-selected={CTX.TABS.selectedTab === id}

  role="tab"
  aria-selected={CTX.TABS.selectedTab === id ? "true" : "false"}
  aria-controls={CTX.TABS.selectedPanel}

  onclick={() => selectTabL(id)}
>
  {@render children?.()}
</button>