<script lang="ts">
  import { generateToken } from "$lib/function";
	import type { ACCORDION_SIZE, ANIMATE_SPEED, ROUNDED } from "$lib/types";
  import { setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge";

  interface Props {
    children: Snippet,
    size?: ACCORDION_SIZE,
    standalone?: boolean,
    animationSpeed: ANIMATE_SPEED,
    rounded?: ROUNDED,
    containerClasses?: string,
    openContainerClasses?: string,
    titleClasses?: string,
    openTitleClasses?: string,
    contentClasses?: string,
    [key: string] : unknown
  }

  let {
    children,
    size = "default",
    standalone = true,
    animationSpeed = "fast",
    rounded = "md",
    containerClasses = "",
    openContainerClasses = "",
    titleClasses = "",
    openTitleClasses = "",
    contentClasses = "",
    ...props
  } : Props = $props()

  const id: string = props?.id as string ?? generateToken()

  setContext("ACCORDION", {
    group: true,
    size,
    standalone,
    animationSpeed,
    flush: props?.flush,
    rounded,
    containerClasses,
    openContainerClasses,
    titleClasses,
    openTitleClasses,
    contentClasses,
    id
  })
</script>

<div {id} class={twMerge("theui-accordion-group flex flex-col", props?.class as string)} role="group">
  {@render children()}
</div>