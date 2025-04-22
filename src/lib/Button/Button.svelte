<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, SHADOW, BUTTON_SIZE } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, shadowClass } from "$lib/function"
  import { Svg } from "$lib"
  import { buttonTheme } from "./button";

  const CTX: any = getContext('BUTTON_GROUP')
  interface Props {
    children?: Snippet,
    beforeLabel?: Snippet,
    afterLabel?: Snippet,
    animationSpeed?: ANIMATE_SPEED,
    ariaLabel?: string,
    newTabIcon?: boolean,
    href?: string,
    outline ?: boolean,
    rounded ?: ROUNDED,
    shadow ?: SHADOW,
    size ?: BUTTON_SIZE,
    square ?: boolean,
    theme ?: 'default' | 'light' | 'gradient'
    color ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    gradientColor ?: 'brand' | 'error' | 'info' | 'success' | 'warning',
    type ?: 'button' | 'submit' | 'reset',
    [key: string]: unknown // Any props
  }

  let {
    children,
    beforeLabel,
    afterLabel,
    ariaLabel = "Button",
    animationSpeed = CTX?.animationSpeed || "normal",
    newTabIcon = true,
    href,
    isActive = false,
    outline = CTX?.outline || false,
    rounded = CTX?.rounded || "md",
    shadow = "md",
    size = CTX?.size || "md",
    square = CTX?.square || false,
    theme = CTX?.theme || "default",
    color = CTX?.color || "brand",
    gradientColor = CTX?.gradientColor || "brand",
    type = "button",
    ...props
  } : Props = $props()

  let sizeClasses: Record<'default'|'square', Record<keyof BUTTON_SIZE, string>> = {
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

  let utilityClasses = () => {
    let utilClasses = CTX?.group ? 
      `${roundedClass(rounded, CTX.stacked ? "top" : "start", "first")}${roundedClass(rounded, CTX.stacked ? "bottom" : "end", "last")}`
        : `${roundedClass(rounded)}${shadowClass(shadow)}`
    return `${utilClasses} ${(CTX?.variant == "bordered" && !CTX?.outline) ? `${(CTX?.stacked ? "border-b last:border-b-0" : "border-e last:border-e-0")}` : ""}`
  }

  let getButtonClass = () => {
    let baseClasses = `${(href ? "theui-link" : "theui-button")} inline-flex gap-2 cursor-pointer focus:ring-4 focus:outline-none ${sizeClasses[square ? "square" : "default"][size]} ${animationClass(animationSpeed)} ${utilityClasses()}`

    if(outline){
      return `${baseClasses} ${buttonTheme(CTX, "outline", color)}`
    }else{
      if(theme === "light"){
        return `${baseClasses} ${buttonTheme(CTX, "light", color)}`
      }
      if(theme === "gradient"){
        return `${baseClasses} ${buttonTheme(CTX, "gradient", gradientColor)}`
      }
      return `${baseClasses} ${buttonTheme(CTX, "default", color)}`
    }
  }
</script>

<svelte:element
  this={href ? "a" : "button"}
  {href}
  {...props}
  class={twMerge(getButtonClass(), CTX?.buttonClasses, props?.class as string)}
  type={href ? undefined : type}
  role={href ? "link" : "button"}
  aria-disabled={props?.disabled==true}
  aria-label={ariaLabel}
>

  {#if beforeLabel}
    <span>{@render beforeLabel?.()}</span>
  {/if}

	{@render children?.()}

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

<style lang="postcss">
  button[disabled]:not(.btn-outline){
    @apply opacity-75 pointer-events-none;
  }
  button[disabled].btn-outline{
    @apply opacity-50 pointer-events-none;
  }
  :global(.theui-btn-group:not(:first-child, :last-child)){
    @apply !rounded-none;
  }
</style>