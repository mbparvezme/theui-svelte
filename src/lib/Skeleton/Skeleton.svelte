<script lang="ts">
  import { twMerge } from "tailwind-merge"
  import type { ROUNDED, SKELETON_ANIMATION, SKELETON_VARIANT } from "$lib/types"
  import { roundedClass } from "$lib/function"

  interface Props {
    variant?: SKELETON_VARIANT,
    animation?: SKELETON_ANIMATION,
    lines?: number,
    rounded?: ROUNDED,
    lineClasses?: string,
    [key: string]: unknown
  }

  let {
    variant = "rect",
    animation = "pulse",
    lines = 1,
    rounded = "md",
    lineClasses = "",
    ...props
  }: Props = $props()

  const count = $derived(Math.max(1, Math.floor(lines)))

  // The shimmer is an ::after overlay that slides across the shape
  const WAVE = "theui-skeleton-wave after:absolute after:inset-0 after:-translate-x-full after:bg-linear-to-r after:from-transparent after:via-white/55 after:to-transparent after:animate-theui-skeleton-wave dark:after:via-white/10 rtl:after:[animation-direction:reverse] motion-reduce:after:animate-none"

  const shapeClasses = (extra = "") => twMerge(
    "theui-skeleton-shape relative block overflow-hidden bg-gray-200 dark:bg-gray-700",
    animation === "pulse" ? "animate-pulse motion-reduce:animate-none" : "",
    animation === "wave" ? WAVE : "",
    extra
  )
</script>

{#if variant === "text"}
  <span aria-hidden="true" {...props} class={twMerge("theui-skeleton flex w-full flex-col gap-2", props?.class as string)}>
    {#each { length: count }, i (i)}
      <span class={shapeClasses(twMerge("h-[0.8lh] w-full", count > 1 && i === count - 1 ? "w-3/5" : "", roundedClass(rounded), lineClasses))}></span>
    {/each}
  </span>
{:else}
  <span
    aria-hidden="true"
    {...props}
    class="theui-skeleton {shapeClasses(twMerge(
      variant === "circle" ? "size-12 rounded-full" : `h-24 w-full ${roundedClass(rounded)}`,
      props?.class as string
    ))}"
  ></span>
{/if}
