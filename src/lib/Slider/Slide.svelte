<script lang="ts">
  import { getContext, onDestroy, untrack, type Snippet } from "svelte"
  import type { SLIDER_CTX } from "$lib/types"
  import { twMerge } from "tailwind-merge"

  interface Props {
    children?: Snippet,
    href?: string,
    src?: string,
    alt?: string,
    // Image for the thumbnail navigation, the slide image by default
    thumbnail?: string,
    [key: string]: unknown
  }

  let { children, href, src, alt, thumbnail, ...props }: Props = $props()

  const id = $props.id()
  const CTX = getContext<SLIDER_CTX>("SLIDER")

  CTX.add(id, {
    get thumbnail() { return thumbnail ?? src },
    get alt() { return alt }
  })
  onDestroy(() => CTX.remove(id))

  const slide = $derived(CTX.slide(id))

  // Ken Burns: a slow zoom and pan on the image while its slide is shown
  const PANS = [[-4, -3], [4, 3], [-4, 3], [4, -3]]
  let image: HTMLImageElement | undefined = $state()
  let burns: Animation | undefined

  $effect(() => {
    const on = CTX.kenBurns
    const active = slide.active
    const visible = slide.visible
    untrack(() => {
      if (!on || !image?.animate) {
        burns?.cancel()
        burns = undefined
      } else if (active && !burns) {
        // Each slide pans a different way
        const [x, y] = PANS[slide.index % PANS.length]
        burns = image.animate(
          [{ transform: "scale(1) translate(0, 0)" }, { transform: `scale(1.15) translate(${x}%, ${y}%)` }],
          { duration: CTX.kenBurnsDuration, easing: "linear", fill: "forwards" }
        )
      } else if (!active && !visible && burns) {
        // It starts again the next time the slide is shown
        burns.cancel()
        burns = undefined
      }
    })
  })

  onDestroy(() => burns?.cancel())

  // Parallax: a transform along the slider's direction, flipped in a right-to-left page
  let root: HTMLElement | undefined = $state()

  const move = (amount: number, unit: string) => CTX.vertical
    ? `translate3d(0,${amount}${unit},0)`
    : `translate3d(${CTX.rtl ? -amount : amount}${unit},0,0)`

  // The image moves slower than the slide
  const imageStyle = $derived(CTX.parallax && slide.parallax
    ? `transform:${move(Math.round(-slide.parallax * CTX.parallax * 10000) / 100, "%")};`
    : undefined)

  // Layers inside the slide: data-parallax moves them by a part of the slide size,
  // data-parallax-opacity and data-parallax-scale are their opacity and scale when the slide is out of view
  $effect(() => {
    const shift = slide.parallax
    const visible = slide.visible
    if (!root || !visible) return
    const layers = root.querySelectorAll<HTMLElement>("[data-parallax], [data-parallax-opacity], [data-parallax-scale]")
    if (!layers.length) return
    const size = CTX.vertical ? root.clientHeight : root.clientWidth
    const distance = Math.abs(shift)
    for (const layer of layers) {
      const speed = parseFloat(layer.dataset.parallax ?? "")
      const scale = parseFloat(layer.dataset.parallaxScale ?? "")
      const opacity = parseFloat(layer.dataset.parallaxOpacity ?? "")
      const transform: string[] = []
      if (!isNaN(speed)) transform.push(move(Math.round(-shift * speed * size * 100) / 100, "px"))
      if (!isNaN(scale)) transform.push(`scale(${1 - (1 - scale) * distance})`)
      layer.style.transform = transform.join(" ")
      if (!isNaN(opacity)) layer.style.opacity = String(1 - (1 - opacity) * distance)
    }
  })

  const classes = $derived(twMerge(
    "theui-slide relative [grid-area:1/1] flex items-center justify-center min-h-48 overflow-hidden outline-none",
    CTX.slideClasses,
    props?.class as string
  ))
</script>

{#snippet content()}
  {#if src}
    <!-- Slides out of view load when they come near -->
    <!-- The wrapper takes the parallax move, the image keeps its own transform for Ken Burns -->
    <div class="size-full" style={imageStyle}>
      <img bind:this={image} {src} {alt} loading={slide.active ? "eager" : "lazy"} draggable="false" class="block size-full object-cover" />
    </div>
  {:else}
    {@render children?.()}
  {/if}
{/snippet}

<div
  {...props}
  bind:this={root}
  data-slide-id={id}
  class={classes}
  style="{slide.style}{props?.style ?? ''}"
  role="group"
  aria-roledescription="slide"
  aria-label="{slide.index + 1} of {slide.total}"
  aria-hidden={!slide.current}
  inert={!slide.current}
  tabindex="-1"
>
  {#if href}
    <!-- The whole slide is the link, named by the image alt or the slide content -->
    <a {href} draggable="false" class="flex items-center justify-center size-full">{@render content()}</a>
  {:else}
    {@render content()}
  {/if}
</div>
