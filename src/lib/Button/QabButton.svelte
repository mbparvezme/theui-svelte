<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, generateToken, roundedClass } from "$lib/function"
	import type { ANIMATE_SPEED, ROUNDED } from "$lib/types"
	import { Svg } from "$lib"

  interface Props {
    children?:Snippet,
    animate?: ANIMATE_SPEED,
    href?: string,
    size?: 'sm' | 'md' | 'lg' | 'xl',
    rounded?: ROUNDED,
    iconClasses?: string,
    [key: string]: unknown
  }
  
  let CTX: any = getContext('FAB') as any
  let {
    children,
    animate = "normal",
    href = undefined,
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "full",
    iconClasses = "",
    ...props
  } : Props = $props()

  let id: string = `${generateToken()}-fab-btn`

  let fabItemSize  = {sm: "w-10 h-10", md: "w-12 h-12", lg: "w-14 h-14", xl: "w-16 h-16"}
  let fabItemClasses = `flex items-center justify-center bg-brand-primary-500 text-on-brand-primary-500 shadow-2xl hover:bg-brand-primary-600 ${fabItemSize[size]}${roundedClass(rounded)}${animationClass(animate)}`
</script>

<svelte:element
  {id}
  {href}
  this={href ? "a" : "button"}
  role={href ? "link" : "button"}
  class={twMerge(fabItemClasses, props?.class as string)}
  aria-label={"button"} {...props}>
  {#if children}
    {@render children()}
  {:else}
    <Svg class={twMerge("w-[50%] h-[50%]", CTX?.iconClasses)}>
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
    </Svg>
  {/if}
</svelte:element>
