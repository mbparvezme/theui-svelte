<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { INPUT_CONFIG, INPUT_SIZE, RANGE_TICK } from "$lib/types"
  import { generateToken, coreReset } from "$lib/function"
  import { inputContainerClass, rangeInputClasses } from "$lib/Form/form"
  import { HelperText, Label } from "$lib"

  interface Props {
    children?: Snippet,
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    showValue?: boolean | "inline" | "tooltip",
    format?: (value: number) => string,
    ticks?: RANGE_TICK[],
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    rangeClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    showValue = false,
    format = (v) => String(v),
    ticks,
    helperText,
    size = CTX?.size ?? "md",
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    rangeClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const SIZES: Record<INPUT_SIZE, string> = {
    sm: "[--theui-range-track:0.25rem] [--theui-range-thumb:0.875rem]",
    md: "[--theui-range-track:0.375rem] [--theui-range-thumb:1.125rem]",
    lg: "[--theui-range-track:0.5rem] [--theui-range-thumb:1.375rem]",
    xl: "[--theui-range-track:0.625rem] [--theui-range-thumb:1.625rem]",
  }

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const C: INPUT_CONFIG = $derived({ size, reset })
  const percent = $derived(max > min ? ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100 : 0)
  const withTooltip = $derived(showValue === "tooltip")
  const withInline = $derived(showValue === true || showValue === "inline")
  const tickList = $derived((ticks ?? []).map(t => typeof t === "number" ? { value: t, label: String(t) } : { value: t.value, label: t.label ?? String(t.value) }))
  const tickPercent = (v: number) => max > min ? ((Math.min(Math.max(v, min), max) - min) / (max - min)) * 100 : 0
</script>

<div class={twMerge(inputContainerClass(C, false), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="flex items-center gap-3">
    <div class="relative flex w-full flex-col {SIZES[size as INPUT_SIZE] ?? SIZES.md} {withTooltip ? 'pt-7' : ''}">
      {#if withTooltip}
        <output
          for={id}
          class="theui-range-tooltip pointer-events-none absolute top-0 -translate-x-1/2 rounded bg-brand-500 px-2 py-0.5 text-xs text-on-brand rtl:translate-x-1/2"
          style="inset-inline-start: calc({percent}% + (var(--theui-range-thumb) / 2) - (var(--theui-range-thumb) * {percent} / 100))"
        >{format(value)}</output>
      {/if}

      <input
        type="range"
        {id}
        {min}
        {max}
        {step}
        {...props}
        bind:value
        style="--theui-range-percent: {percent}%"
        class={twMerge(
          // reset keeps the track sizing variables and drops the look, the same as the other inputs
          reset ? "theui-range theui-input w-full" : `theui-range theui-input text-brand-500 ${rangeInputClasses()}`,
          !reset && (props?.disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"),
          rangeClasses,
          props?.class as string
        )}
        aria-describedby={helperText ? `${id}-helper` : null}
      />

      {#if tickList.length}
        <div class="relative mt-1 h-4 text-xs text-muted" aria-hidden="true">
          {#each tickList as tick (tick.value)}
            <span
              class="absolute -translate-x-1/2 whitespace-nowrap rtl:translate-x-1/2"
              style="inset-inline-start: calc({tickPercent(tick.value)}% + (var(--theui-range-thumb) / 2) - (var(--theui-range-thumb) * {tickPercent(tick.value)} / 100))"
            >{tick.label}</span>
          {/each}
        </div>
      {/if}
    </div>

    {#if withInline}
      <output for={id} class="shrink-0 text-sm tabular-nums">{format(value)}</output>
    {/if}
  </div>

  {#if helperText}
    <HelperText id={id + "-helper"}>
      {#if typeof helperText === "function"}
        {@render helperText()}
      {:else}
        {helperText}
      {/if}
    </HelperText>
  {/if}
</div>
