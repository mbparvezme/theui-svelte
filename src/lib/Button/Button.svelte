<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, SHADOW, BUTTON_SIZE } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, shadowClass, coreSpeed, coreShadow } from "$lib/function"
  import { Svg } from "$lib"
  import { buttonTheme, type ButtonContext } from "./button"

  const CTX: ButtonContext = getContext('BUTTON_GROUP')

  interface Props {
    children?: Snippet,
    beforeLabel?: Snippet,
    afterLabel?: Snippet,
    animationSpeed?: ANIMATE_SPEED,
    ariaLabel?: string,
    newTabIcon?: boolean,
    href?: string,
    isActive?: boolean,
    outline ?: boolean,
    rounded ?: ROUNDED,
    loading?: boolean,
    loadingText?: string,
    shadow ?: SHADOW,
    size ?: BUTTON_SIZE,
    square ?: boolean,
    theme ?: ButtonContext['theme'],
    color ?: ButtonContext['color'],
    gradientColor ?: ButtonContext['gradientColor'],
    type ?: 'button' | 'submit' | 'reset',
    actions?: [fn: (node: HTMLElement, params?: unknown) => { destroy?: () => void } | void, params?: unknown][],
    [key: string]: unknown // Any props
  }

  let {
    children,
    beforeLabel,
    afterLabel,
    ariaLabel,
    animationSpeed = CTX?.animationSpeed || coreSpeed(),
    newTabIcon = true,
    href,
    isActive = false,
    outline = CTX?.outline || false,
    rounded = CTX?.rounded || "md",
    loading = false,
    loadingText = "Loading...",
    shadow = coreShadow(),
    size = CTX?.size || "md",
    square = CTX?.square || false,
    theme = CTX?.theme || "default",
    color = CTX?.color || "brand",
    gradientColor = CTX?.gradientColor || "brand",
    type = "button",
    actions,
    ...props
  } : Props = $props()

  let sizeClasses: Record<'default' | 'square', Record<BUTTON_SIZE, string>> = {
    default : {
      xs: "btn-xs py-1 px-2 text-xs",
      sm: "btn-sm px-3 py-2 text-sm",
      md: "btn-md px-4 py-2.5 text-base",
      lg: "btn-lg px-6 py-3 text-lg",
      xl: "btn-xl px-8 py-4 text-xl",
      auto: "btn-auto p-0",
    },
    square : {
      xs    : "btn-square-xs inline-flex justify-center items-center p-1 w-6 h-6",
      sm    : "btn-square-sm inline-flex justify-center items-center p-2 w-9 h-9",
      md    : "btn-square-md inline-flex justify-center items-center p-3 w-12 h-12",
      lg    : "btn-square-lg inline-flex justify-center items-center p-3 w-16 h-16",
      xl    : "btn-square-xl inline-flex justify-center items-center p-4 w-24 h-24",
      auto  : "btn-square-auto inline-flex justify-center items-center p-0",
    }
  }

  let el = $state<HTMLElement>()

  $effect(() => {
    if (!el || !actions?.length) return
    const domEl = el
    const cleanups = actions.map(([fn, p]) => fn(domEl, p)?.destroy)
    return () => cleanups.forEach(fn => fn?.())
  })

  let utilityClasses = () => {
    let utilClasses = CTX?.group ? 
      `${roundedClass(rounded, CTX.stacked ? "top" : "start", "first")}${roundedClass(rounded, CTX.stacked ? "bottom" : "end", "last")}`
        : `${roundedClass(rounded)}${shadowClass(shadow)}`
    return `${utilClasses} ${(CTX?.variant == "bordered" && !CTX?.outline) ? `${(CTX?.stacked ? "border-b last:border-b-0" : "border-e last:border-e-0")}` : ""}`
  }

  let activeClasses = $derived(
    isActive
      ? outline
        ? "brightness-90 ring-2 ring-inset ring-current/20"
        : "brightness-75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]"
      : ""
  )

  let getButtonClass = () => {
    let baseClasses = `${(href ? "theui-link" : "theui-button")} inline-flex items-center gap-2 cursor-pointer focus:ring-4 focus:outline-none ${sizeClasses[square ? "square" : "default"][size]} ${animationClass(animationSpeed)} ${utilityClasses()} ${props?.disabled ? "opacity-50 pointer-events-none shadow-none" : ''} ${activeClasses}`

    if(outline){
      return `${baseClasses} ${buttonTheme(CTX, "outline", color)}`
    }else{
      if(theme === "soft"){
        return `${baseClasses} ${buttonTheme(CTX, "soft", color)}`
      }
      if(theme === "gradient"){
        return `${baseClasses} ${buttonTheme(CTX, "gradient", gradientColor)}`
      }
      return `${baseClasses} ${buttonTheme(CTX, "default", color)}`
    }
  }

  let buttonClass = $derived(twMerge(getButtonClass(), (loading && "cursor-wait opacity-75 pointer-events-none"), CTX?.buttonClasses, props?.class as string))
</script>

<svelte:element
  bind:this={el}
  this={href ? "a" : "button"}
  {...props}
  href={props?.disabled ? undefined : href}
  class={buttonClass}
  type={href ? undefined : type}
  role={href ? "link" : "button"}
  aria-disabled={props?.disabled ? true : undefined}
  disabled={href ? undefined : (props?.disabled ? true : undefined)}
  aria-label={ariaLabel}
  aria-pressed={!href && isActive ? true : undefined}
>

  {#if beforeLabel}
    <span>{@render beforeLabel?.()}</span>
  {/if}

  {#if loading}
    <span class="animate-spin shrink-0">
      <!-- The path is drawn on a 24 grid, so it needs the matching viewBox. Left on the
           default "0 0 16 16" it was scaled up and cropped. -->
      <Svg size={1} viewBox="0 0 24 24">
        <path d="M10.72,19.9a8,8,0,0,1-6.5-9.7A8,8,0,0,1,10.72,2.06a1,1,0,0,1,1.06,1.7,6,6,0,1,0,8.48,8.47,1,1,0,0,1,1.71,1.07A8,8,0,0,1,10.72,19.9Z"/>
      </Svg>
    </span>
  {/if}

  {@render children?.()}

  {#if loading && loadingText}
    <span>{loadingText}</span>
  {/if}

  {#if afterLabel}
    <span>{@render afterLabel?.()}</span>
  {/if}

  {#if newTabIcon && props?.target}
    <span class="self-start rtl:transform rtl:-rotate-90">
      <Svg size={.6}>
        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
      </Svg>
    </span>
  {/if}

</svelte:element>
