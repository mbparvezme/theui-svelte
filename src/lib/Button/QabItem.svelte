<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken, roundedClass } from "$lib/function"
	import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
	import { Svg } from "$lib"
  import { QABTheme } from "./button";

  interface Props {
    children?:Snippet,
    animationSpeed?: ANIMATE_SPEED,
    href?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl',
    rounded?: ROUNDED,
    iconClasses?: string,

    theme ?: 'default' | 'light' | 'gradient',
    color ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    gradientColor ?: 'brand' | 'error' | 'info' | 'success' | 'warning',

    ariaLabel ?: string,

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
  let qabItemClasses = twMerge(`flex items-center justify-center shadow-2xl ${qabItemSize[size]} ${qabTheme()} ${roundedClass(rounded)}${animationClass(animationSpeed)}`, (props?.mainButton ? CTX.mainButtonClasses : ""), props?.class as string)
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
