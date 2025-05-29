<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken, roundedClass } from "$lib/function"
	import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
	import { Svg } from "$lib"
  import { QABTheme } from "./button";

  interface Props {
    children?:Snippet,
    size?: 'sm' | 'md' | 'lg' | 'xl',

    href?: string,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,
    
    color ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    theme ?: 'default' | 'soft' | 'gradient',
    gradientColor ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    
    ariaLabel ?: string,
    iconClasses?: string,
    [key: string]: unknown
  }

  let CTX: any = getContext('QAB') as any
  let {
    children,
    animationSpeed = "normal",
    href = undefined,
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "full",
    iconClasses = "",

    theme = CTX?.theme || "default",
    color = CTX?.color || "brand",
    gradientColor = CTX?.gradientColor || "brand",

    ariaLabel = "Quick Action Item",

    ...props
  } : Props = $props()

  const id: string = `${generateToken()}-qab-btn`
  const qabItemSize  = {sm: "w-10 h-10", md: "w-12 h-12", lg: "w-14 h-14", xl: "w-16 h-16"}
  const qabTheme = () => QABTheme(theme, theme === "gradient" ? gradientColor : color)
  let qabItemClasses = twMerge(`flex items-center justify-center shadow-2xl cursor-pointer ${qabItemSize[size]} ${qabTheme()} ${roundedClass(rounded)}${animationClass(animationSpeed)}`, props?.class as string)
</script>

<svelte:element
  {id}
  aria-label={ariaLabel}
   {...props}
  {href}
  this={href ? "a" : "button"}
  role={href ? "link" : "button"}
  class={qabItemClasses}
  >
  {#if children}
    {@render children()}
  {:else}
    <Svg class={twMerge("w-[50%] h-[50%]", CTX?.iconClasses)}>
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </Svg>
  {/if}
</svelte:element>
