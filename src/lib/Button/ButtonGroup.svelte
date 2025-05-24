<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, BUTTON_SIZE } from "$lib/types"
  import { setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { roundedClass } from "$lib/function"

  interface Props {
    children : Snippet,
    stacked  ?: boolean,
    variant  ?: 'bordered' | 'flat',
    animationSpeed ?: ANIMATE_SPEED,
    ariaLabel ?: string,
    buttonClasses ?: string, // Not tested
    outline ?: boolean,
    rounded ?: ROUNDED,
    size ?: BUTTON_SIZE,
    square ?: boolean,
    theme ?: 'default' | 'light' | 'gradient'
    color ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    gradientColor ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    [key: string]: unknown // any props
  }

  let {
    children,
    stacked = false,
    variant = "flat",
    ariaLabel = "Button group",
    animationSpeed = "normal",
    buttonClasses = "",
    color = "brand",
    gradientColor = "brand",
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
    animationSpeed,
    buttonClasses,
    outline,
    rounded,
    size,
    square,
    theme,
    color,
    gradientColor,
  });

  let getClasses = twMerge(`theui-btn-group inline-flex ${roundedClass(rounded)}`, props?.class as string)
</script>

{#if children}
<div aria-label={ariaLabel} {...props} class={getClasses} class:flex-col={stacked} class:theui-btn-stacked={stacked} role="group">
  {@render children()}
</div>
{/if}