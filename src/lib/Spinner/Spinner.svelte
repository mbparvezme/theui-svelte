<script lang="ts">
  import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { SPINNER_SIZE, SPINNER_VARIANT } from "$lib/types"

  interface Props {
    children?: Snippet,
    variant?: SPINNER_VARIANT,
    size?: SPINNER_SIZE,
    label?: string,
    spinnerClasses?: string,
    [key: string]: unknown
  }

  let {
    children,
    variant = "ring",
    size = "md",
    label = "Loading",
    spinnerClasses = "",
    ...props
  }: Props = $props()

  const SIZES: Record<SPINNER_SIZE, string> = {
    xs: "size-3",
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
    xl: "size-12",
  }

  const BORDERS: Record<SPINNER_SIZE, string> = {
    xs: "border-2",
    sm: "border-2",
    md: "border-[3px]",
    lg: "border-[3px]",
    xl: "border-4",
  }

  const sizeClass = $derived(SIZES[size] ?? SIZES.md)

  // Reduced motion slows the spinner down instead of stopping it, so it still shows that something is loading
  const shapeClasses = $derived(twMerge(
    "theui-spinner-shape inline-block shrink-0",
    sizeClass,
    variant === "ring" ? `rounded-full border-current border-e-transparent animate-spin motion-reduce:[animation-duration:2s] ${BORDERS[size] ?? BORDERS.md}` : "",
    variant === "dots" ? "inline-flex items-center justify-between" : "",
    variant === "ping" ? "relative" : "",
    spinnerClasses
  ))
</script>

<span role="status" {...props} class={twMerge("theui-spinner inline-flex items-center gap-2 text-brand-500 align-middle", props?.class as string)}>
  <span class={shapeClasses} aria-hidden="true">
    {#if variant === "dots"}
      {#each [0, 1, 2] as i (i)}
        <span class="w-1/4 aspect-square rounded-full bg-current animate-bounce motion-reduce:animate-pulse" style="animation-delay: {(i - 2) * 0.15}s"></span>
      {/each}
    {:else if variant === "ping"}
      <span class="absolute inset-0 rounded-full bg-current opacity-75 animate-ping motion-reduce:animate-pulse"></span>
      <span class="absolute inset-1/4 rounded-full bg-current"></span>
    {/if}
  </span>
  {#if children}
    {@render children()}
  {:else}
    <span class="sr-only">{label}</span>
  {/if}
</span>
