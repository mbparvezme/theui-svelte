<script lang="ts">
	import { getContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
  import { getSlideClasses } from "./slider"
  import { twMerge } from "tailwind-merge"

  interface Props {
    children?: Snippet,
    href?: string|undefined,
    src: string,
    alt: string,
    [key: string] : unknown
  }

  let {children, href, src, alt, ...props} : Props = $props()

  let id: string = generateToken()
  let CTX = getContext('SLIDER') as any
  CTX.slides.push(id)
</script>

<div class="slide {getSlideClasses(CTX?.slideClasses, (src ? "" : props?.class as string))}">

  {#if src}
    <img {src} {alt} {...props} class={twMerge("block w-full", (src ? props?.class as string : "" ))} />
  {:else}
    {@render children?.()}
  {/if}

  {#if href}
    <a class="absolute inset-0" aria-hidden="true" href={href}></a>
  {/if}

</div>