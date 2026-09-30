<script lang="ts">
  import { getContext, onDestroy, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { INPUT_CONFIG, INPUT_SIZE } from "$lib/types"
  import { generateToken, roundedClass, coreSpeed, coreReset } from "$lib/function"
  import { inputClasses, inputContainerClass } from "$lib/Form/form"
  import { HelperText, Label, Svg } from "$lib"

  interface Props {
    children?: Snippet,
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    decreaseLabel?: string,
    increaseLabel?: string,
    onchange?: (value: number) => void,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    buttonClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    value = $bindable(0),
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
    decreaseLabel = "Decrease",
    increaseLabel = "Increase",
    onchange,
    helperText,
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    buttonClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const BUTTON_SIZES: Record<INPUT_SIZE, string> = {
    sm: "size-7 text-sm",
    md: "size-9",
    lg: "size-11 text-lg",
    xl: "size-14 text-xl",
  }

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const C: INPUT_CONFIG = $derived({ animationSpeed, rounded, size, variant, reset })
  const locked = $derived(!!props?.disabled || !!props?.readonly)
  const atMin = $derived(value <= min)
  const atMax = $derived(value >= max)

  // Steps like 0.1 must not produce 0.30000000000000004
  const decimals = $derived((String(step).split(".")[1] ?? "").length)
  const round = (n: number): number => decimals ? Number(n.toFixed(decimals)) : n
  const clamp = (n: number): number => Math.min(Math.max(n, min), max)

  const set = (n: number) => {
    const next = round(clamp(n))
    if (next === value || Number.isNaN(next)) return
    value = next
    onchange?.(next)
  }

  const bump = (dir: 1 | -1) => set((Number.isFinite(value) ? value : 0) + dir * step)

  // Holding a button keeps stepping
  let holdTimer: ReturnType<typeof setTimeout> | undefined
  let holdInterval: ReturnType<typeof setInterval> | undefined

  const stopHold = () => {
    clearTimeout(holdTimer)
    clearInterval(holdInterval)
    holdTimer = holdInterval = undefined
  }

  const startHold = (dir: 1 | -1) => {
    stopHold()
    holdTimer = setTimeout(() => { holdInterval = setInterval(() => bump(dir), 80) }, 400)
  }

  onDestroy(stopHold)

  const onInput = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement
    if (input.value === "") return
    const parsed = Number(input.value)
    if (!Number.isNaN(parsed)) set(parsed)
  }

  const onBlur = (e: FocusEvent) => {
    const input = e.currentTarget as HTMLInputElement
    const parsed = Number(input.value)
    set(Number.isNaN(parsed) || input.value === "" ? clamp(0) : parsed)
    input.value = String(value)
  }
</script>

{#snippet stepButton(dir: 1 | -1, label: string, disabled: boolean)}
  <button
    type="button"
    aria-label={label}
    aria-controls={id}
    disabled={disabled || locked}
    class={twMerge(`theui-stepper-button flex shrink-0 items-center justify-center border border-gray-300 bg-secondary dark:border-gray-600 ${BUTTON_SIZES[size as INPUT_SIZE] ?? BUTTON_SIZES.md} ${roundedClass(rounded)} hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50`, buttonClasses)}
    onclick={() => bump(dir)}
    onpointerdown={() => startHold(dir)}
    onpointerup={stopHold}
    onpointerleave={stopHold}
    onpointercancel={stopHold}
    onblur={stopHold}
  >
    <Svg size={0.9}>
      {#if dir === 1}
        <path d="M8 3.5a.5.5 0 0 1 .5.5v3.5H12a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
      {:else}
        <path d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/>
      {/if}
    </Svg>
  </button>
{/snippet}

<div class={twMerge(inputContainerClass(C, false), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="theui-stepper flex items-center gap-2">
    {@render stepButton(-1, decreaseLabel, atMin)}

    <input
      {id}
      type="number"
      inputmode="decimal"
      min={Number.isFinite(min) ? min : undefined}
      max={Number.isFinite(max) ? max : undefined}
      {step}
      {...props}
      value={value}
      class={twMerge(inputClasses(C, props), "theui-stepper-input w-20 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none")}
      aria-describedby={helperText ? `${id}-helper` : null}
      oninput={onInput}
      onblur={onBlur}
    />

    {@render stepButton(1, increaseLabel, atMax)}
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
