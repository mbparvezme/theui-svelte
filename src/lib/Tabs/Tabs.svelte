<script lang="ts">
	import { setContext, type Snippet, onMount } from "svelte"
	import type { ANIMATE_SPEED, TABS_CONTEXT } from "$lib/types"
	import { twMerge } from "tailwind-merge"
	import { generateToken, coreSpeed } from "$lib/function"

  interface Props {
    tabs : Snippet,
    children : Snippet,
    variant ?: 'tabs' | 'pills',
    animationSpeed ?: ANIMATE_SPEED,
    border ?: boolean|string,
    tabContainerClasses ?: string,
    tabClasses ?: string,
    tabActiveClasses ?: string,
    tabPanelClasses ?: string,
    id ?: string,
    [key: string] : unknown
  }

  let {
    tabs,
    children,
    variant = "pills",
    animationSpeed = coreSpeed(),
    border = true,
    tabContainerClasses = "",
    tabClasses = "",
    tabActiveClasses = "",
    tabPanelClasses = "",
    id = generateToken(),
    ...props
  } : Props = $props()

  let classes = {
    active : {
      tabs : "border-0 border-b-2 border-brand-500 text-brand-500",
      pills : "bg-brand-500 text-on-brand",
    },
    inactive : {
      tabs : "border-0 border-b-2 border-transparent",
      pills : "",
    }
  }

	const ST_TABS: TABS_CONTEXT["TABS"] = $state({
    tabIds: [],
    panelIds: [],
    selectedTabId: null,
    selectedPanelId: null,
    selectedValue: null,
    tabIdByValue: {},
    panelIdByValue: {}
  })

  const activeCls = $derived(twMerge(classes["active"][variant], tabActiveClasses))
  const inactiveCls = $derived(twMerge(classes["inactive"][variant], tabClasses))

  // Getters, so a tab reads each prop as it is now. Written as plain values the tabs would
  // keep whatever the tab list happened to hold the moment it first ran.
  const config: TABS_CONTEXT = {
    get tabActiveClasses() { return activeCls },
    get tabClasses() { return inactiveCls },
    get tabPanelClasses() { return tabPanelClasses },
    get animationSpeed() { return animationSpeed },
    get border() { return border },
    get variant() { return variant },
    TABS: ST_TABS
  }

  onMount(() => {
    if (ST_TABS.selectedTabId == null && ST_TABS.tabIds.length > 0) {
      ST_TABS.selectedTabId = ST_TABS.tabIds[0]
      ST_TABS.selectedPanelId = ST_TABS.panelIds[0]
    }
  })

  const handleTabKeydown = (e: KeyboardEvent) => {
    // Only this tab list's own tabs, not tabs of Tabs nested inside a panel
    const tabElements = Array.from(
      (e.currentTarget as HTMLElement).querySelectorAll(':scope > [role="tab"]')
    ) as HTMLElement[]
    const currentIndex = tabElements.findIndex(
      (t) => t.getAttribute('aria-selected') === 'true'
    )
    if (currentIndex === -1) return

    let nextIndex: number | null = null

    if (e.key === 'ArrowRight')       nextIndex = (currentIndex + 1) % tabElements.length
    else if (e.key === 'ArrowLeft')   nextIndex = (currentIndex - 1 + tabElements.length) % tabElements.length
    else if (e.key === 'Home')        nextIndex = 0
    else if (e.key === 'End')         nextIndex = tabElements.length - 1
    else return

    e.preventDefault()
    tabElements[nextIndex]?.focus()
    tabElements[nextIndex]?.click()
  }

  // Listener added here: the tablist is not a tab stop itself, its tabs are
  let tabList: HTMLDivElement | null = $state(null)
  $effect(() => {
    if (!tabList) return
    const el = tabList
    el.addEventListener('keydown', handleTabKeydown)
    return () => el.removeEventListener('keydown', handleTabKeydown)
  })

	setContext('TAB', config)
</script>


<div {id} {...props} class="theui-tabs {twMerge("-mb-0.5", props?.class as string)}">
	{#if tabs}
    <div class="theui-tab-list {twMerge((border ? "" : "mb-4") , tabContainerClasses)}" bind:this={tabList} role="tablist">
      {@render tabs()}
    </div>

    {#if border !== false}
      <hr class="theui-tabs-border -mt-0.5 {twMerge("mb-4 border-b-2 border-gray-500/20", border as string)}" role="presentation" />
    {/if}
  {/if}

  {@render children?.()}
</div>
