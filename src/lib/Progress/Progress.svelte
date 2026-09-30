<script lang="ts">
	import { onMount } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { ROUNDED } from "$lib/types";
  import { roundedClass, generateToken } from "$lib/function"

  interface Props {
    start ?: number,
    end ?: number,
    label ?: string,
    labelVariant ?: 'bubble' | 'inline'
    thickness ?: 'px' | 'sm' | 'md' | 'lg' | 'xl',
    rounded?: ROUNDED,
    id ?: string,
    barClasses ?: string,
    bubbleClasses ?: string,
    // Fills from the bottom up instead of left to right
    vertical ?: boolean,
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
    labelVariant = "bubble",
    rounded = "full",
    vertical = false,
    ...props
  } : Props = $props()

  let containerEl: HTMLDivElement
  let barEl: HTMLDivElement

  // The bar and the aria values share these numbers: nothing above 100, and a start past
  // the end swaps with it.
  const clamped = $derived.by(() => {
    let s = start
    let e = end
    if (e > 100) e = 100
    if (s > e) [s, e] = [e, s]
    return { start: s, end: e }
  })

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
    return `select-none ${sizeClass} ${(vertical ? "inline-flex h-full" : "flex w-full")} ${roundedClass(rounded)}`
  }

  let barCls = () => `progress-bar absolute ${twMerge(`flex items-center justify-center bg-brand-500 text-on-brand-500 ${roundedClass(rounded)}`, barClasses)}`

  let labelCls = () => {
    const bubblePositionCls: string = vertical ? bubblePosition['vertical'][thickness] : bubblePosition['default'][thickness]
    return labelVariant === 'bubble' && !['lg', 'xl'].includes(thickness)
            ? `progress-label transform absolute text-[80%] bg-brand-500 text-on-brand-500 w-6 h-6 justify-center flex items-center rounded-t-full rotate-45 ${vertical ? "rounded-r-full" : "rounded-bl-full"} ${bubblePositionCls} font-semibold`
            : "font-semibold"

  }

  let updateProgress = (container: HTMLElement) => {
    const { start: s, end: e } = clamped

    if (!barEl) return
    const isRTL = getComputedStyle(container).direction === 'rtl'
    if (vertical) {
      barEl.style.inset = `${s}% 0 ${100 - e}% 0`
    } else {
      barEl.style.inset = isRTL
        ? `0 ${s}% 0 ${100 - e}%`
        : `0 ${100 - e}% 0 ${s}%`
    }
  }

  $effect(() => updateProgress(containerEl))

  onMount(() => {
    const container = document.documentElement
    const observer = new MutationObserver(() => updateProgress(container))
    observer.observe(container, { attributes: true, attributeFilter: ['dir'] })
    return () => observer.disconnect()
  })
</script>

<div bind:this={containerEl} {id} {...props} class="theui-progress relative {twMerge(`text-on-brand text-xs bg-secondary`,trackCls(), props?.class as string)}" aria-valuenow={clamped.end} aria-valuemin={clamped.start} aria-valuemax=100 role="progressbar">
  <div bind:this={barEl} class={barCls()}>
    {#if label}
      <span class={twMerge(labelCls(), bubbleClasses)}>
        <span class="transform -rotate-45">{label}</span>
      </span>
    {/if}
  </div>
</div>