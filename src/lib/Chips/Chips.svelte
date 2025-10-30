<script lang="ts">
  import type { ROUNDED } from "$lib/types"
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { roundedClass } from "$lib/function"
	import { Close } from "$lib"

  interface Props {
    children?: Snippet,
    close?: boolean,
    imgSrc?: string,
    imgClasses?: string,
    altText?: string,
    rounded?: ROUNDED,
    size?: 'sm' | 'md' | 'lg',
    href?: 'string',
    [key: string]: unknown // dismissible, icon
  }

  let {
    children,
    content,
    close = false,
    imgSrc,
    imgClasses = "",
    altText = "",
    rounded = "full",
    size = "md",
    href,
    ...props
  } : Props = $props();

	let nodeRef: HTMLSpanElement

  let chipsClasses = `flex items-center w-max gap-4 ${!imgSrc?"pe-4 py-2":""} cursor-pointer text-sm border border-gray-200 dark:border-gray-700 text-gray-500 bg-gray-100 font-semibold ${roundedClass(rounded)}`

  let chipsImgClass = twMerge([
    "max-w-none", size === "sm" ? "w-9 h-9" : size === "lg" ? "w-14 h-14" : "w-11 h-11", roundedClass(rounded)
  ].join(" "), imgClasses);

  const hideChips = () => nodeRef.parentNode?.removeChild(nodeRef)
</script>

<svelte:element this={href ? "a" : "span"} {...props} class={`theui-chips ${twMerge(chipsClasses, props?.class as string)}`} bind:this={nodeRef} role={href ? "" : "button"}>
  {#if imgSrc}<img class={chipsImgClass} alt={altText} src={imgSrc}>{/if}

  {@render children?.()}

  {#if close}
    <Close ariaLabel="Hide chips" size={1} onclick={hideChips} />
  {/if}
</svelte:element>