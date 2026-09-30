<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
	import type { ACCORDION_SIZE, ACCORDION_CONTEXT, ANIMATE_SPEED, ROUNDED } from "$lib/types"
  import { generateToken, coreSpeed } from "$lib/function"

  interface Props {
    children: Snippet,
    size?: ACCORDION_SIZE,
    standalone?: boolean,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    containerClasses?: string,
    openContainerClasses?: string,
    titleClasses?: string,
    openTitleClasses?: string,
    contentClasses?: string,
    // Borderless look, passed down to every item
    flush?: boolean,
    [key: string] : unknown // class, id, data-*
  }

  let {
    children,
    size = "default",
    standalone = true,
    animationSpeed = coreSpeed("fast"),
    rounded = "md",
    containerClasses = "",
    openContainerClasses = "",
    titleClasses = "",
    openTitleClasses = "",
    contentClasses = "",
    flush = false,
    ...props
  } : Props = $props()

  // Generated once, so the id stays the same when another attribute changes
  const fallbackId: string = generateToken()
  const id: string = $derived(typeof props?.id === "string" ? props.id : fallbackId)

  // Getters, so an item reads each prop as it is now. Written as plain values the items
  // would keep whatever the group happened to hold the moment it first ran.
  setContext<ACCORDION_CONTEXT>("ACCORDION", {
    group: true,
    get size() { return size },
    get standalone() { return standalone },
    get animationSpeed() { return animationSpeed },
    get flush() { return flush },
    get rounded() { return rounded },
    get containerClasses() { return containerClasses },
    get openContainerClasses() { return openContainerClasses },
    get titleClasses() { return titleClasses },
    get openTitleClasses() { return openTitleClasses },
    get contentClasses() { return contentClasses },
    get id() { return id }
  })
</script>

<div {...props} {id} class={twMerge("theui-accordion-group flex flex-col", props?.class as string)} role="group">
  {@render children()}
</div>