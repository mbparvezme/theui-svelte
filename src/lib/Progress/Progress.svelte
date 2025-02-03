<script lang="ts">
  import { twMerge } from "tailwind-merge"
  import { roundedClass, generateToken } from "$lib/function"
	import { onMount } from "svelte"
    import type { ROUNDED } from "$lib/types";

  interface Props {
    start ?: number,
    end ?: number,

    label ?: string,
    labelVariant ?: 'default' | 'bubble'
    bubbleClasses ?: string,
    thickness ?: 'px' | 'sm' | 'md' | 'lg' | 'xl',
    barClasses ?: string,

    vertical ?: boolean,    
    rounded?: ROUNDED,
    id ?: string,
    [key: string] : unknown,
  }

  let {
    id = generateToken(),
    label,
    start = 0,
    end = 0,
    barClasses = "",
    bubbleClasses = "",
    thickness = "md",
    vertical = false,
    labelVariant = "bubble",
    rounded = "full",
    ...props
  } : Props = $props()

  const sizes: Record<'vertical' | 'default', Record<Exclude<Props['thickness'], undefined>, string>> = {
    vertical: {
      px: "w-px",
      sm: "w-1",
      md: "w-2",
      lg: "w-4",
      xl: "w-6"
    },
    default: {
      px: "h-px",
      sm: "h-1",
      md: "h-2",
      lg: "h-4",
      xl: "h-6"
    }
  }

  const bubblePosition: Record<'vertical' | 'default', Record<Exclude<Props['thickness'], undefined>, string>> = {
    vertical: {
      px: "-end-8 bottom-0 translate-y-3",
      sm: "-end-8 bottom-0 translate-y-3",
      md: "-end-8 bottom-0 translate-y-3",
      lg: "-end-8 bottom-0 translate-y-3",
      xl: "-end-8 bottom-0 translate-y-3"
    },
    default: {
      px: "-top-2 end-0 -translate-y-full translate-x-3",
      sm: "-top-2 end-0 -translate-y-full translate-x-3",
      md: "-top-2 end-0 -translate-y-full translate-x-3",
      lg: "-top-2 end-0 -translate-y-full translate-x-[11px]",
      xl: "-top-2 end-0 -translate-y-full translate-x-[10px]",
    }
  }

  let trackCls = () => {
    const sizeClass = vertical ? (sizes['vertical'][thickness] ?? sizes['vertical'].md) : (sizes['default'][thickness] ?? sizes['default'].md)
    return `select-none ${sizeClass} ${(vertical ? "inline-flex h-full min-h-[50vh]" : "flex w-full")} ${roundedClass(rounded)}`
  }

  let barCls = () => `progress-bar absolute ${twMerge(`flex items-center justify-center bg-brand-primary-500 text-on-brand-primary-500 ${roundedClass(rounded)}`, barClasses)}`

  let labelCls = () => {
    const bubblePositionCls: any = vertical ? bubblePosition['vertical'][thickness] : bubblePosition['default'][thickness]
    return  labelVariant == "bubble" || thickness == "px" || thickness == "sm" || thickness == "md"
            ? `progress-label transform absolute text-[80%] bg-brand-primary-500 text-on-brand-primary-500 w-6 h-6 justify-center flex items-center ${vertical ? "rounded-t-full rounded-r-full rotate-45" : "rounded-t-full rounded-bl-full rotate-45"} ${bubblePositionCls}`
            : ""
  }

  let updateProgress = (container: any) => {
    let bar = document.querySelector(`#${id} .progress-bar`);
    let isRTL = getComputedStyle(container).direction === 'rtl';
    if (vertical) {
      (bar as HTMLElement).style.inset = `${start}% 0 ${100 - end}% 0`;
    } else {
      if (isRTL) {
        (bar as HTMLElement).style.inset = `0 ${start}% 0 ${100 - end}%`; // Swap for RTL
      } else {
        (bar as HTMLElement).style.inset = `0 ${100 - end}% 0 ${start}%`;
      }
    }
  }

  $effect(() => updateProgress(document.documentElement))

  onMount(() => {
    let container = document.documentElement
    let observer = new MutationObserver(() => updateProgress(container))
    observer.observe(container, { attributes: true, attributeFilter: ['dir'] })
  })
</script>

<div {id} {...props} class="theui-progress relative {twMerge(`text-on-brand-primary text-xs bg-secondary`,trackCls(), props?.class as string)}">
  <div class={barCls()}>
    {#if label}<span class={twMerge(labelCls(), bubbleClasses)}><b>{label}</b></span>{/if}
  </div>
</div>

<style lang="postcss">
  .rotate-45 > *{
    @apply transform -rotate-45;
  }
</style>