<script lang="ts">
	import { setContext, type Snippet, onMount } from "svelte"
	import type { ANIMATE_SPEED, TAB_CONFIG } from "$lib/types"
	import { twMerge } from "tailwind-merge"
	import { generateToken } from "$lib/function"

  interface Props {
    tabList : Snippet,
    tabPanel : Snippet,
    variant ?: 'tabs' | 'pills',
    animate ?: ANIMATE_SPEED,
    borderClasses ?: boolean|string,
    tabListClasses ?: string,
    tabClasses ?: string,
    activeTabClasses ?: string,
    tabPanelClasses ?: string,
    id ?: string,
    [key: string] : unknown
  }

  let {
    tabList,
    tabPanel,
    variant = "pills",
    animate = "normal",
    borderClasses = true,
    tabListClasses = "",
    tabClasses = "",
    activeTabClasses = "",
    tabPanelClasses = "",
    id = generateToken(),
    ...props
  } : Props = $props()

  let classes = {
    active : {
      tabs : "border-0 border-b-2 border-brand-primary-500 text-brand-primary-500",
      pills : "bg-brand-primary-500 text-white",
    },
    inactive : {
      tabs : "border-0 border-b-2 border-transparent",
      pills : "hover:bg-brand-primary-500 hover:text-on-brand-primary-500",
    }
  }

  const ST_TABS: TAB_CONFIG["TABS"] =  $state({ tabs: [], panels: [], selectedTab: null, selectedPanel: null })

  let config: TAB_CONFIG = {
    activeTabClasses : twMerge(classes["active"][variant], activeTabClasses),
		tabClasses : twMerge(classes["inactive"][variant], tabClasses),
		tabPanelClasses,
		animate,
		borderClasses,
		variant,
    TABS: ST_TABS
	}
  

  onMount(() => {
    if(ST_TABS.selectedTab == null){
      ST_TABS.selectedTab = ST_TABS.tabs[0]
      ST_TABS.selectedPanel = ST_TABS.panels[0]
    }
  })

	setContext('TAB', config)
</script>

<div {id} {...props} class="theui-tabs {twMerge("-mb-0.5", props?.class as string)}">
	{#if tabList}
    <div class="theui-tab-list {twMerge((borderClasses ? "" : "mb-4") , tabListClasses)}">
      {@render tabList()}
      {#if borderClasses !== false}
        <div class="theui-tabs-border -mt-0.5 {twMerge("mb-4 border-b-2 border-gray-500/20", borderClasses as string)}"></div>
      {/if}
    </div>
  {/if}
	{#if tabPanel}
    {@render tabPanel()}
  {/if}
</div>