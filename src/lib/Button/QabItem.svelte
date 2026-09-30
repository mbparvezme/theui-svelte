<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken, roundedClass, coreSpeed } from "$lib/function"
	import type { ANIMATE_SPEED, ROUNDED, BTN_QAB_CTX } from "$lib/types"
	import { Svg } from "$lib"
  import { QABTheme } from "./button"

  interface Props {
    children?:Snippet,
    size?: BTN_QAB_CTX['size'],

    href?: string,
    animationSpeed?: ANIMATE_SPEED,
    rounded?: ROUNDED,

    color ?: BTN_QAB_CTX['color'],
    theme ?: BTN_QAB_CTX['theme'],
    gradientColor ?: BTN_QAB_CTX['gradientColor'],

    ariaLabel ?: string,
    iconClasses?: string,
    [key: string]: unknown
  }

  let CTX: BTN_QAB_CTX = getContext('QAB') as BTN_QAB_CTX

  let {
    children,
    animationSpeed = coreSpeed(),
    href = undefined,
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "full",
    iconClasses = CTX?.iconClasses ?? "",

    theme = CTX?.theme || "default",
    color = CTX?.color || "brand",
    gradientColor = CTX?.gradientColor || "brand",

    ariaLabel,

    ...props
  } : Props = $props()

  const id: string = `${generateToken()}-qab-btn`
  const qabItemSize  = {sm: "w-10 h-10", md: "w-12 h-12", lg: "w-14 h-14", xl: "w-16 h-16"}
  let qabItemClasses = $derived(twMerge(`flex items-center justify-center shadow-2xl cursor-pointer ${qabItemSize[size]} ${QABTheme(theme, theme === "gradient" ? gradientColor : color)} ${props?.disabled ? "opacity-50 pointer-events-none shadow-none" : ''} ${roundedClass(rounded)}${animationClass(animationSpeed)}`, props?.class as string))
</script>

<!-- Content is the accessible name; the default icon has no text, so it falls back to a generic label -->
<svelte:element
  {id}
  aria-label={ariaLabel ?? (children ? undefined : "Quick Action Item")}
  {...props}
  href={props?.disabled ? undefined : href}
  this={href ? "a" : "button"}
  role={href ? "link" : "button"}
  class={qabItemClasses}
  type={href ? undefined : "button"}
  aria-disabled={props?.disabled ? true : undefined}
  disabled={!href && props?.disabled ? true : undefined}
  >
  {#if children}
    {@render children()}
  {:else}
    <Svg class={twMerge("w-[50%] h-[50%]", iconClasses)}>
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </Svg>
  {/if}
</svelte:element>
