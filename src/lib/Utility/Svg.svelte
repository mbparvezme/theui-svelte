  <script lang="ts">
	import { type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"

	interface Props {
    children ?: Snippet,
    size ?: number,
    viewBox ?: string,
    focusable ?: "true"|"false",
    [key: string]: unknown // dismissible, icon
	}

  let {
    children,
    size = 1,
    viewBox = "0 0 16 16",
    focusable = "true",
	  ...props // dismissible, icon
  } : Props = $props()

  let cls = $derived(`theui-svg-icon shrink-0 ${(props?.stroke ? "stroke-current fill-transparent" : "fill-current")}`)
</script>

{#if children}
<svg
  width="{size}rem" height="{size}rem"
  {viewBox}
  {focusable}
  aria-hidden="{!focusable}"
  {...props}
  class={twMerge(cls, props?.class as string)}
  class:stroke-icon={props?.stroke}
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
>
  {@render children()}
</svg>
{/if}