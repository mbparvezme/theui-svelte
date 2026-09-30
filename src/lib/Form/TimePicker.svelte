<script lang="ts">
  import { getContext, onDestroy, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { INPUT_CONFIG } from "$lib/types"
  import { generateToken, coreSpeed, coreReset } from "$lib/function"
  import { inputClasses, inputContainerClass } from "$lib/Form/form"
  import { fromTimeString, toTimeString } from "$lib/Form/datetime"
  import { Close, HelperText, Label, Svg } from "$lib"

  type SEGMENT = "hour" | "minute" | "meridiem"

  interface Props {
    children?: Snippet,
    value?: string,
    min?: string,
    max?: string,
    step?: number,
    hour12?: boolean,
    amLabel?: string,
    pmLabel?: string,
    clearable?: boolean,
    stepper?: boolean,
    name?: string,
    onchange?: (value: string) => void,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    segmentClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    value = $bindable(""),
    min = "00:00",
    max = "23:59",
    step = 1,
    hour12 = false,
    amLabel = "AM",
    pmLabel = "PM",
    clearable = true,
    stepper = true,
    name,
    onchange,
    helperText,
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    segmentClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const C: INPUT_CONFIG = $derived({ animationSpeed, rounded, size, variant, reset })
  const locked = $derived(!!props?.disabled || !!props?.readonly)

  // Hours are kept as 0-23; the AM/PM segment is a different way of reading the same number
  let hour = $state<number>()
  let minute = $state<number>()
  let segments: Partial<Record<SEGMENT, HTMLElement>> = $state({})
  // What the user has typed so far in one segment, e.g. "1" while waiting for "2"
  let buffer = ""
  let bufferTimer: ReturnType<typeof setTimeout> | undefined
  let ownValue = ""

  const minMinutes = $derived(fromTimeString(min) ?? 0)
  const maxMinutes = $derived(fromTimeString(max) ?? 24 * 60 - 1)
  const order = $derived<SEGMENT[]>(hour12 ? ["hour", "minute", "meridiem"] : ["hour", "minute"])
  const isPM = $derived(hour !== undefined && hour >= 12)
  const shownHour = $derived(hour === undefined ? undefined : hour12 ? (hour % 12 || 12) : hour)
  const filled = $derived(hour !== undefined && minute !== undefined)

  $effect(() => {
    const v = value ?? ""
    if (v === ownValue) return
    ownValue = v
    const minutes = fromTimeString(v)
    hour = minutes === undefined ? undefined : Math.floor(minutes / 60)
    minute = minutes === undefined ? undefined : minutes % 60
  })

  const commit = () => {
    if (hour === undefined || minute === undefined) {
      if (!value) return
      ownValue = ""
      value = ""
      onchange?.("")
      return
    }
    const clamped = Math.min(Math.max(hour * 60 + minute, minMinutes), maxMinutes)
    hour = Math.floor(clamped / 60)
    minute = clamped % 60
    const next = toTimeString(clamped)
    if (next === ownValue) return
    ownValue = next
    value = next
    onchange?.(next)
  }

  const clearBuffer = () => {
    clearTimeout(bufferTimer)
    buffer = ""
  }

  onDestroy(() => clearTimeout(bufferTimer))

  const focusSegment = (segment: SEGMENT) => {
    clearBuffer()
    segments[segment]?.focus()
  }

  const moveFocus = (from: SEGMENT, direction: 1 | -1) => {
    const next = order[order.indexOf(from) + direction]
    if (next) focusSegment(next)
  }

  const bump = (segment: SEGMENT, direction: 1 | -1) => {
    if (locked) return
    clearBuffer()
    if (segment === "hour") {
      hour = ((hour ?? (direction > 0 ? -1 : 1)) + direction + 24) % 24
      if (minute === undefined) minute = 0
    } else if (segment === "minute") {
      const gap = Math.max(1, Math.round(step))
      minute = ((minute ?? (direction > 0 ? -gap : gap)) + direction * gap + 60) % 60
      if (hour === undefined) hour = 0
    } else {
      hour = ((hour ?? 0) + 12) % 24
      if (minute === undefined) minute = 0
    }
    commit()
  }

  // Digits fill a segment left to right and jump to the next one when nothing more can fit
  const typeDigit = (segment: SEGMENT, digit: string) => {
    if (locked || segment === "meridiem") return
    const attempt = Number(buffer + digit)
    const limit = segment === "hour" ? (hour12 ? 12 : 23) : 59
    const lowest = segment === "hour" && hour12 ? 1 : 0

    let next = attempt
    if (attempt > limit || attempt < lowest) {
      next = Number(digit)
      if (next > limit || next < lowest) { clearBuffer(); return }
      buffer = ""
    }

    if (segment === "hour") {
      hour = hour12 ? (next % 12) + (isPM ? 12 : 0) : next
      if (minute === undefined) minute = 0
    } else {
      minute = next
      if (hour === undefined) hour = 0
    }
    commit()

    buffer = String(next)
    clearTimeout(bufferTimer)
    // Two digits, or a number that cannot take another one, finishes the segment
    if (buffer.length >= 2 || next * 10 > limit) {
      clearBuffer()
      moveFocus(segment, 1)
    } else {
      bufferTimer = setTimeout(clearBuffer, 1200)
    }
  }

  const setMeridiem = (pm: boolean) => {
    if (locked) return
    if (hour === undefined) { hour = pm ? 12 : 0; minute ??= 0 }
    else hour = pm ? (hour % 12) + 12 : hour % 12
    commit()
  }

  const clearSegment = (segment: SEGMENT) => {
    if (locked) return
    clearBuffer()
    if (segment === "hour") hour = undefined
    else if (segment === "minute") minute = undefined
    else return
    commit()
  }

  const onSegmentKeydown = (segment: SEGMENT, e: KeyboardEvent) => {
    const rtl = typeof document !== "undefined" && getComputedStyle(e.currentTarget as HTMLElement).direction === "rtl"

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
      bump(segment, e.key === "ArrowUp" ? 1 : -1)
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault()
      const forward = (e.key === "ArrowRight") !== rtl
      moveFocus(segment, forward ? 1 : -1)
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault()
      clearSegment(segment)
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault()
      if (segment === "meridiem") setMeridiem(e.key === "End")
      else {
        clearBuffer()
        if (segment === "hour") hour = e.key === "Home" ? 0 : 23
        else minute = e.key === "Home" ? 0 : 59
        if (hour === undefined) hour = 0
        if (minute === undefined) minute = 0
        commit()
      }
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      typeDigit(segment, e.key)
    } else if (segment === "meridiem" && /^[ap]$/i.test(e.key)) {
      e.preventDefault()
      setMeridiem(e.key.toLowerCase() === "p")
    } else if (e.key === " ") {
      e.preventDefault()
      if (segment === "meridiem") setMeridiem(!isPM)
    } else if (e.key === ":" || e.key === "ArrowRight") {
      e.preventDefault()
      moveFocus(segment, 1)
    }
  }

  // The wheel only works on the segment with focus, so the page still scrolls normally
  const onSegmentWheel = (segment: SEGMENT, e: WheelEvent) => {
    if (locked || document.activeElement !== e.currentTarget) return
    e.preventDefault()
    bump(segment, e.deltaY < 0 ? 1 : -1)
  }

  const onPaste = (e: ClipboardEvent) => {
    const minutes = fromTimeString(e.clipboardData?.getData("text")?.replace(/\s*([ap])m?$/i, (_, p) => p.toLowerCase() === "p" ? "" : "") ?? "")
    if (minutes === undefined) return
    e.preventDefault()
    hour = Math.floor(minutes / 60)
    minute = minutes % 60
    commit()
  }

  const clear = () => {
    hour = undefined
    minute = undefined
    commit()
    focusSegment("hour")
  }

  const pad = (n?: number, digits = 2): string => n === undefined ? "--" : String(n).padStart(digits, "0")
</script>

{#snippet segment(name_: SEGMENT, label: string, text: string, now: number | undefined, low: number, high: number, valueText: string)}
  <span
    bind:this={segments[name_]}
    role="spinbutton"
    tabindex={locked ? -1 : 0}
    aria-label={label}
    aria-valuenow={now}
    aria-valuemin={low}
    aria-valuemax={high}
    aria-valuetext={valueText}
    aria-disabled={locked || undefined}
    class={twMerge(`theui-timepicker-segment rounded-md px-1 tabular-nums transition-colors outline-none select-none selection:bg-transparent ${locked ? "" : "cursor-ns-resize"} focus:bg-brand-500 focus:text-on-brand ${now === undefined ? "text-muted" : ""}`, segmentClasses)}
    onkeydown={(e) => onSegmentKeydown(name_, e)}
    onwheel={(e) => onSegmentWheel(name_, e)}
    onpaste={onPaste}
    onfocus={clearBuffer}
    onblur={clearBuffer}
  >{text}</span>
{/snippet}

<div class={twMerge(inputContainerClass(C, true), wrapperClasses)}>
  {#if children}
    <Label id={`${id}-label`} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div
    {id}
    role="group"
    aria-labelledby={children ? `${id}-label` : undefined}
    aria-describedby={helperText ? `${id}-helper` : null}
    {...props}
    class={twMerge(inputClasses(C, props), "theui-timepicker flex items-center gap-1")}
  >
    {@render segment("hour", "Hour", pad(shownHour), shownHour, hour12 ? 1 : 0, hour12 ? 12 : 23, shownHour === undefined ? "Empty" : String(shownHour))}
    <span aria-hidden="true" class="text-muted">:</span>
    {@render segment("minute", "Minute", pad(minute), minute, 0, 59, minute === undefined ? "Empty" : String(minute))}
    {#if hour12}
      {@render segment("meridiem", "AM or PM", hour === undefined ? "--" : isPM ? pmLabel : amLabel, hour === undefined ? undefined : (isPM ? 2 : 1), 1, 2, hour === undefined ? "Empty" : isPM ? pmLabel : amLabel)}
    {/if}

    <span class="grow"></span>

    {#if clearable && filled && !locked}
      <Close size={0.9} ariaLabel="Clear time" onclick={clear} />
    {/if}

    {#if stepper && !locked}
      <span class="flex shrink-0 flex-col">
        <button
          type="button"
          tabindex="-1"
          aria-label="Increase"
          class="flex h-3.5 w-5 items-center justify-center rounded-t text-muted hover:bg-secondary hover:text-default"
          onclick={() => bump((order.find(s => segments[s] === document.activeElement) ?? "minute"), 1)}
        >
          <Svg size={0.7} aria-hidden="true">
            <path d="M7.646 5.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L8 6.707l-3.646 3.647a.5.5 0 0 1-.708-.708l4-4z"/>
          </Svg>
        </button>
        <button
          type="button"
          tabindex="-1"
          aria-label="Decrease"
          class="flex h-3.5 w-5 items-center justify-center rounded-b text-muted hover:bg-secondary hover:text-default"
          onclick={() => bump((order.find(s => segments[s] === document.activeElement) ?? "minute"), -1)}
        >
          <Svg size={0.7} aria-hidden="true">
            <path d="M3.646 5.646a.5.5 0 0 1 .708 0L8 9.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708z"/>
          </Svg>
        </button>
      </span>
    {:else}
      <Svg size={1} class="shrink-0 text-muted" aria-hidden="true">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2zm.5 2a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .25.433l2.5 1.5a.5.5 0 1 0 .5-.866L8.5 7.717V4z"/>
      </Svg>
    {/if}
  </div>

  {#if name}<input type="hidden" {name} {value} />{/if}

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
