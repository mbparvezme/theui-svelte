<script lang="ts">
	import { setContext, type Snippet, onMount } from "svelte"
	import type { ANIMATE_SPEED, TAB_CONFIG } from "$lib/types"
	import { twMerge } from "tailwind-merge"
	import { generateToken } from "$lib/function"

  interface Props {
    tabs : Snippet,
    children : Snippet,
    variant ?: 'tabs' | 'pills',
    animate ?: ANIMATE_SPEED,
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
    animate = "normal",
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
      tabs : "border-0 border-b-2 border-brand-primary-500 text-brand-primary-500",
      pills : "bg-brand-primary-500 text-white",
    },
    inactive : {
      tabs : "border-0 border-b-2 border-transparent",
      pills : "",
    }
  }

  const ST_TABS: TAB_CONFIG["TABS"] =  $state({ tabs: [], panels: [], selectedTab: null, selectedPanel: null })

  let config: TAB_CONFIG = {
    tabActiveClasses : twMerge(classes["active"][variant], tabActiveClasses),
		tabClasses : twMerge(classes["inactive"][variant], tabClasses),
		tabPanelClasses,
		animate,
		border,
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

<div {id} {...props} class="theui-tabs {twMerge("-mb-0.5", props?.class as string)}" role="tablist">
	{#if tabs}
    <div class="theui-tab-list {twMerge((border ? "" : "mb-4") , tabContainerClasses)}">
      {@render tabs()}
    </div>

    {#if border !== false}
      <hr class="theui-tabs-border -mt-0.5 {twMerge("mb-4 border-b-2 border-gray-500/20", border as string)}" role="presentation" />
    {/if}
  {/if}

  {@render children?.()}
</div>