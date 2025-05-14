<script lang="ts">
	import { getContext, type Snippet } from "svelte"
	import { generateToken } from "$lib/function"
  import { twMerge } from "tailwind-merge"

  interface Props {
    children?: Snippet,
    href?: string|undefined,
    src?: string,
    alt?: string,
    [key: string] : unknown
  }

  let {children, href, src, alt, ...props} : Props = $props()

  let id: string = generateToken()
  let CTX = getContext('SLIDER') as any
  CTX.slides.push(id)

  const getSlideClasses = (slideClasses: string, classes: string) =>
    twMerge("relative flex-shrink-0 w-full min-h-48 flex items-center justify-center", slideClasses, classes)
</script>

<div class="slide {getSlideClasses(CTX?.slideClasses, (src ? "" : props?.class as string))}" aria-label={`Slide ${CTX.slides.indexOf(id) + 1} of ${CTX.slides.length}`}>
  {#if src}
    <img {src} {alt} {...props} class={twMerge("block w-full", (src ? props?.class as string : "" ))} />
  {:else}
    {@render children?.()}
  {/if}
  {#if href}
    <a class="absolute inset-0" aria-hidden="true" href={href}></a>
  {/if}
</div>