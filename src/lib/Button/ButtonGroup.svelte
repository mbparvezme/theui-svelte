<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, BUTTON_SIZE } from "$lib/types"
  import { setContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { roundedClass, coreSpeed } from "$lib/function"
  import { type ButtonContext } from "./button"

  interface Props {
    children : Snippet,
    stacked  ?: boolean,
    variant  ?: ButtonContext['variant'],
    animationSpeed ?: ANIMATE_SPEED,
    ariaLabel ?: string,
    buttonClasses ?: string, // Not tested
    outline ?: boolean,
    rounded ?: ROUNDED,
    size ?: BUTTON_SIZE,
    square ?: boolean,
    theme ?: ButtonContext['theme'],
    color ?: ButtonContext['color'],
    gradientColor ?: ButtonContext['gradientColor'],
    [key: string]: unknown // any props
  }

  let {
    children,
    stacked = false,
    variant = "flat",
    ariaLabel = "Button group",
    animationSpeed = coreSpeed(),
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

  // Getters keep the buttons in sync when these props change after mount
  const BUTTON_GROUP_CTX: ButtonContext = {
    group: true,
    get stacked() { return stacked },
    get variant() { return variant },
    get animationSpeed() { return animationSpeed },
    get buttonClasses() { return buttonClasses },
    get outline() { return outline },
    get rounded() { return rounded },
    get size() { return size },
    get square() { return square },
    get theme() { return theme },
    get color() { return color },
    get gradientColor() { return gradientColor },
  }

  setContext('BUTTON_GROUP', BUTTON_GROUP_CTX)

  let getClasses = $derived(twMerge(`theui-btn-group inline-flex ${roundedClass(rounded)}`, props?.class as string))
</script>

{#if children}
<div aria-label={ariaLabel} {...props} class={getClasses} class:flex-col={stacked} class:theui-btn-stacked={stacked} role="group">
  {@render children()}
</div>
{/if}