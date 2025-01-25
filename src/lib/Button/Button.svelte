<script lang="ts">
  import type { ANIMATE_SPEED, ROUNDED, SHADOW, BUTTON_SIZE } from "$lib/types"
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { animationClass, roundedClass, shadowClass } from "$lib/function"
  import { Svg } from "$lib"

  const CTX: any = getContext('BUTTON_GROUP')
  interface Props {
    children?: Snippet,
    beforeLabel?: Snippet,
    afterLabel?: Snippet,
    animate?: ANIMATE_SPEED,
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
    animate = CTX?.animate || "normal",
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

  let sizeClasses = {
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

  let defaultOutlineButtonClasses = `btn-outline ${CTX?.group ? (CTX?.stacked ? "border-x border-t last:border-b" : "border-y border-s last:border-e") : "border"}`
  let defaultGradientButtonClasses = `btn-gradient ${CTX?.group ? (CTX?.stacked ? "bg-gradient-to-r hover:bg-gradient-to-t" : "bg-gradient-to-b hover:bg-gradient-to-t") : "bg-gradient-to-r hover:bg-gradient-to-br"}`

  let themes = {
    default : {
      brand: "bg-brand-primary-500 hover:bg-brand-primary-600 text-on-brand-primary-500 border-black/20 focus:ring-brand-primary-500/50",
      error: "bg-error-400 hover:bg-error-500 dark:bg-error-600 text-error-50 border-black/20 focus:ring-error-500/50",
      info: "bg-info-500 hover:bg-info-600 dark:bg-info-700 text-info-50 border-black/20 dark:border-black/40 focus:ring-info-500/30",
      success: "bg-success-500 hover:bg-success-600 dark:bg-success-700 text-success-50 border-black/20 dark:border-black/40 focus:ring-success-500/30",
      warning: "bg-warning-400 hover:bg-warning-500 dark:bg-warning-500 dark:hover:bg-warning-400 text-warning-900 border-black/10 dark:border-black/20 focus:ring-warning-500/40",
    },
    outline: {
      brand : `${defaultOutlineButtonClasses} border-brand-primary-500 text-brand-primary-500 hover:bg-brand-primary-500 hover:text-on-brand-primary-500 focus:ring-brand-primary-500/30`,
      error   : `${defaultOutlineButtonClasses} border-error-500 text-error-500 hover:bg-error-500 hover:text-error-50 focus:ring-error-500/30`,
      info    : `${defaultOutlineButtonClasses} border-info-500 text-info-500 hover:bg-info-500 hover:text-info-50 focus:ring-info-500/30`,
      success : `${defaultOutlineButtonClasses} border-success-500 text-success-500 hover:bg-success-500 hover:text-success-50 focus:ring-success-500/30`,
      warning : `${defaultOutlineButtonClasses} border-warning-500 text-warning-500 hover:bg-warning-500 hover:text-warning-900 focus:ring-warning-500/30`,
    },
    light : {
      brand: "bg-brand-primary-50 text-brand-primary-500 hover:bg-brand-primary-400 hover:text-on-brand-primary-500 border-black/10 focus:ring-brand-primary-300",
      error: "bg-error-100 text-error-500 hover:bg-error-400 hover:text-error-50 border-black/10 focus:ring-error-300",
      info: "bg-info-100 text-info-600 hover:bg-info-500 hover:text-info-50 border-black/10 focus:ring-info-300",
      success: "bg-success-100 text-success-600 hover:bg-success-500 hover:text-success-50 border-black/10 focus:ring-success-300",
      warning: "bg-warning-100 text-warning-600 hover:bg-warning-400 hover:text-warning-900 border-black/10 focus:ring-warning-300",
    },
    gradient : {
      brand: `${defaultGradientButtonClasses} from-brand-primary-300 via-brand-primary-400 to-brand-primary-500 text-on-brand-primary-500 border-black/10 focus:ring-brand-primary-300`,
      error: `${defaultGradientButtonClasses} from-error-400 via-error-500 to-error-600 text-error-50 border-black/10 focus:ring-error-300`,
      info: `${defaultGradientButtonClasses} from-info-400 via-info-500 to-info-600 text-info-50 border-black/10 focus:ring-info-300`,
      success: `${defaultGradientButtonClasses} from-success-400 via-success-500 to-success-600 text-success-50 border-black/10 focus:ring-success-300`,
      warning: `${defaultGradientButtonClasses} from-warning-300 via-warning-400 to-warning-600 text-warning-900 border-black/10 focus:ring-warning-300`,
    },
  }

  let utilityClasses = () => {
    let utilClasses = CTX?.group ? 
      `${roundedClass(rounded, CTX.stacked ? "top" : "start", "first")}${roundedClass(rounded, CTX.stacked ? "bottom" : "end", "last")}`
        : `${roundedClass(rounded)}${shadowClass(shadow)}`
    return `${utilClasses} ${(CTX?.variant == "bordered" && !CTX?.outline) ? `${(CTX?.stacked ? "border-b last:border-b-0" : "border-e last:border-e-0")}` : ""}`
  }

  let getButtonClass = () => {
    let baseClasses = `${(href ? "theui-link" : "theui-button")} inline-flex gap-2 focus:ring-4 focus:outline-none ${sizeClasses[square ? "square" : "default"][size]} ${animationClass(animate)} ${utilityClasses()}`

    if(outline){
      return `${baseClasses} ${themes["outline"][color]}`
    }else{
      if(theme === "light"){
        return `${baseClasses} ${themes["light"][color]}`
      }
      if(theme === "gradient"){
        return `${baseClasses} ${themes["gradient"][gradientColor]}`
      }
      return `${baseClasses} ${themes["default"][color]}`
    }
  }
</script>

<svelte:element
  this={href ? "a" : "button"}
  {href}
  {...props}
  class={twMerge(getButtonClass(), CTX?.buttonClasses, (props.class || "") as string)}
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