<script lang="ts">
	import type { Snippet } from "svelte"
	import type { ROUNDED, ROUNDED_SIDES, SHADOW } from "$lib/types"
	import { backdropClasses, roundedClass, shadowClass, generateToken } from "$lib/function"
	import { twMerge } from "tailwind-merge"

  interface Props {
    children?: Snippet,
    title?: Snippet | string,
    rounded?: ROUNDED,
    shadow?: SHADOW,
    topImage?: Snippet | {class?: string, src?: string, alt?: string, [key: string]: unknown}
    bottomImage?: Snippet | {class?: string, src?: string, alt?: string, [key: string]: unknown}
    contentClasses?: string,
    titleClasses?: string,
    imageOverlay?: boolean | string,
    [key: string]: unknown
  }

  let {
    children,
    title,
    rounded = "md",
    topImage,
    shadow = "md",
    bottomImage,
    contentClasses = "",
    titleClasses = "",
    imageOverlay = false,
    ...props
  }: Props = $props()

  let id: string = generateToken()

  let cardContainerClasses = `${!props?.horizontal?"flex-col":"justify-between"}${roundedClass(rounded)}${shadowClass(shadow)}`;
  let cardContentClasses = `flex flex-col gap-4 p-4 ${imageOverlay ? `absolute inset-0 text-white z-[0]` : ""}`
  let imgClasses = (side: ROUNDED_SIDES) => `block w-full ${props?.horizontal && !imageOverlay ?"max-w-[30%]":""}${roundedClass(rounded, imageOverlay ? "all" : side)}`
</script>

<div {id} class="card relative {twMerge("flex bg-primary", props?.class as string)} {cardContainerClasses}" aria-labelledby={title && typeof title === "string" ? {id}+"-title" : {id}+"-content"}>

  {#if topImage}
    {#if typeof topImage === "function"}
      {@render topImage?.()}
    {:else if topImage.src}
      <img class={twMerge(imgClasses(props?.horizontal?"start":"top"), topImage?.class as string)} src={topImage?.src} alt={topImage?.alt}>
    {/if}
  {/if}

  {#if children}
  <div id="{id}-content" class="card-content {twMerge(cardContentClasses, contentClasses)}">
    {#if imageOverlay}
      <div class={backdropClasses( typeof imageOverlay === "boolean" ? "absolute" : imageOverlay + " absolute")}></div>
    {/if}
    {#if title}
      {#if typeof title === "string"}
          <h4 id="{id}-title" class={twMerge("text-xl font-semibold", titleClasses)}>{@html title}</h4>
          {:else}
          {@render title?.()}
        {/if}
    {/if}
    {@render children?.()}
  </div>
  {/if}

  {#if bottomImage}
    {#if typeof bottomImage === "function"}
      {@render bottomImage?.()}
    {:else if bottomImage.src}
      <img class={twMerge(imgClasses(props?.horizontal?"end":"bottom"), bottomImage?.class as string)} src={bottomImage?.src} alt={bottomImage?.alt}>
    {/if}
  {/if}

</div>