<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { ROUNDED } from "$lib/types"
  import { roundedClass } from "$lib/function"
	import { Close } from "$lib"

  interface Props {
    children?: Snippet,
    close?: boolean,
    imgSrc?: string,
    imgClasses?: string,
    altText?: string,
    rounded?: ROUNDED,
    size?: 'sm' | 'md' | 'lg', // Only for image
    href?: string,
    [key: string]: unknown // dismissible, icon
  }

  let {
    children,
    close = false,
    imgSrc,
    imgClasses = "",
    altText = "",
    rounded = "full",
    size = "md", // Only for image
    href,
    ...props
  } : Props = $props();

  let visible = $state(true)

  let chipsClasses = $derived(twMerge("theui-chips flex items-center w-max gap-4 cursor-pointer text-sm border border-gray-200 dark:border-gray-700 text-gray-500 bg-gray-100 font-semibold", (!imgSrc?"py-2 px-3":""), roundedClass(rounded), props?.class as string))

  let chipsImgClass = $derived(twMerge("max-w-none", (size === "sm" ? "w-9 h-9" : size === "lg" ? "w-14 h-14" : "w-11 h-11"), roundedClass(rounded), imgClasses))

  const hideChips = () => { visible = false }
</script>

{#if visible}
  <svelte:element this={href ? "a" : "span"} {...props} class={chipsClasses} role={href ? undefined : "button"}>
    {#if imgSrc}<img class={chipsImgClass} alt={altText} src={imgSrc}>{/if}

    {@render children?.()}

    {#if close}
      <Close ariaLabel="Hide chips" size={1} onclick={hideChips} />
    {/if}
  </svelte:element>
{/if}
