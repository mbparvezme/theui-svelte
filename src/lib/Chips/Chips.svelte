<script lang="ts">
  import type { ROUNDED } from "$lib/types"
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { roundedClass } from "$lib/function"
	import { Close } from "$lib"

  interface Props {
    children?: Snippet,
    close?: boolean,
    fill?: boolean,
    imageUrl?: string,
    imageClasses?: string,
    altText?: string,
    rounded?: ROUNDED,
    size?: 'sm' | 'md' | 'lg',
    [key: string]: unknown // dismissible, icon
  }

  let {
    children,
    content,
    close  = true,
    fill   = true,
    imageUrl,
    imageClasses = "",
    altText = "",
    rounded  = "full",
    size   = "md",
    ...props
  } : Props = $props();

	let nodeRef: HTMLSpanElement

  let chipsClasses = [
    "flex items-center w-max gap-4 cursor-pointer pe-4",
    fill ? "text-gray-500 bg-brand-primary-50 font-semibold text-sm" : "border border-gray-100",
    roundedClass(rounded)
  ].join(" ");

  let chipsImgClass = twMerge([
    "max-w-none", size === "sm" ? "w-9 h-9" : size === "lg" ? "w-14 h-14" : "w-11 h-11", roundedClass(rounded)
  ].join(" "), imageClasses);

  const hideChips = () => nodeRef.parentNode?.removeChild(nodeRef)
</script>

<span class={"theui-chips " + twMerge(chipsClasses, (props?.class ?? "") as string)} class:ps-4={!imageUrl} class:py-2={!imageUrl} bind:this={nodeRef} role="button">
  {#if imageUrl}<img class={chipsImgClass} alt={altText} src={imageUrl}>{/if}

  {@render children?.()}

  {#if close}
    <Close ariaLabel="Hide chips" size={1} onclick={hideChips} />
  {/if}
</span>