<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, BUTTON_SIZE } from "$lib/types"
  import { setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { roundedClass } from "$lib/function"

  interface Props {
    children : Snippet,
    stacked  ?: boolean,
    variant  ?: 'bordered' | 'flat',
    animate ?: ANIMATE_SPEED,
    ariaLabel ?: string|undefined,
    buttonClasses ?: string, // Not tested
    outline ?: boolean,
    rounded ?: ROUNDED,
    size ?: BUTTON_SIZE,
    square ?: boolean,
    theme ?: 'default' | 'light' | 'gradient'
    color ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    gradientColors ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    [key: string]: unknown // any props
  }

  let {
    children,
    stacked = false,
    variant = "bordered",
    ariaLabel = "Button group",
    animate = "normal",
    buttonClasses = "",
    color = "brand",
    gradientColors = "brand",
    outline = false,
    rounded = "md",
    size = "md",
    square = false,
    theme = "default",
    ...props
  } : Props = $props()

  setContext('BUTTON_GROUP', {
    group: true,
    stacked,
    variant,
    animate,
    buttonClasses,
    color,
    gradientColors,
    outline,
    rounded,
    size,
    square,
    theme,
  });

  let getClasses = twMerge(`theui-btn-group inline-flex${roundedClass(rounded)}`, (props?.class as string ?? ""))
</script>

{#if children}
<div class={getClasses} class:flex-col={stacked} class:theui-btn-stacked={stacked} role="group" aria-label={ariaLabel}>
  {@render children()}
</div>
{/if}