<script lang="ts">
  import { getContext, tick, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { INPUT_CONFIG } from "$lib/types"
  import { generateToken, coreSpeed, coreReset } from "$lib/function"
  import { inputClasses, inputContainerClass } from "$lib/Form/form"
  import { attachPanel, panelButtonClasses, panelClasses } from "$lib/Form/popup"
  import {
    addDays, addMonths, clampDate, fromISODate, isSameDay, monthGrid, monthNames,
    startOfMonth, toISODate, today, weekdayNames
  } from "$lib/Form/datetime"
  import { Close, HelperText, Label, Svg } from "$lib"

  interface Props {
    children?: Snippet,
    value?: string,
    min?: string,
    max?: string,
    disabledDates?: (date: Date) => boolean,
    firstDayOfWeek?: number,
    locale?: string,
    format?: (date: Date) => string,
    placeholder?: string,
    clearable?: boolean,
    editable?: boolean,
    inline?: boolean,
    showToday?: boolean,
    todayText?: string,
    clearText?: string,
    openLabel?: string,
    name?: string,
    onchange?: (value: string) => void,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    panelClass?: string,
    dayClasses?: string,
    selectedDayClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    value = $bindable(""),
    min,
    max,
    disabledDates,
    firstDayOfWeek = 0,
    locale,
    format,
    placeholder = "",
    clearable = true,
    editable = false,
    inline = false,
    showToday = true,
    todayText = "Today",
    clearText = "Clear",
    openLabel = "Choose date",
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
    panelClass = "",
    dayClasses = "",
    selectedDayClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const C: INPUT_CONFIG = $derived({ animationSpeed, rounded, size, variant, reset })
  const locked = $derived(!!props?.disabled || !!props?.readonly)

  let anchor: HTMLDivElement | undefined = $state()
  let panel: HTMLDivElement | undefined = $state()
  let input: HTMLInputElement | undefined = $state()
  let grid: HTMLElement | undefined = $state()
  let yearList: HTMLElement | undefined = $state()
  // Only the popup opens and closes; an inline calendar is always shown
  let open = $state(false)
  // The calendar shows the days of a month, or the year and month list
  let view = $state<"days" | "years">("days")
  // The day the arrow keys are on; it is the only day that can be tabbed to
  let cursor = $state(today())
  let viewMonth = $state(startOfMonth(today()))
  let typed = $state<string>()

  const minDate = $derived(fromISODate(min))
  const maxDate = $derived(fromISODate(max))
  const selectedDate = $derived(fromISODate(value))
  const weekdays = $derived(weekdayNames(locale, firstDayOfWeek))
  const months = $derived(monthNames(locale))
  const days = $derived(monthGrid(viewMonth, firstDayOfWeek))
  const monthLabel = $derived(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(viewMonth))
  const formatted = $derived(selectedDate
    ? (format ? format(selectedDate) : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(selectedDate))
    : "")
  const years = $derived.by(() => {
    const current = viewMonth.getFullYear()
    const from = minDate ? minDate.getFullYear() : current - 100
    const to = maxDate ? maxDate.getFullYear() : current + 10
    return Array.from({ length: Math.max(1, to - from + 1) }, (_, i) => from + i)
  })

  // The value decides where the calendar opens
  $effect(() => {
    const date = fromISODate(value)
    if (date) {
      viewMonth = startOfMonth(date)
      cursor = date
    }
  })

  const isDisabled = (date: Date): boolean =>
    (!!minDate && date < minDate) || (!!maxDate && date > maxDate) || !!disabledDates?.(date)

  const focusCursor = async () => {
    await tick()
    grid?.querySelector<HTMLElement>("[data-cursor='true']")?.focus()
  }

  const openPanel = async (focus = true) => {
    if (locked || open) return
    open = true
    view = "days"
    cursor = clampDate(selectedDate ?? today(), minDate, maxDate)
    viewMonth = startOfMonth(cursor)
    if (focus) await focusCursor()
  }

  const closePanel = (focus = false) => {
    if (inline || !open) return
    open = false
    view = "days"
    if (focus) input?.focus()
  }

  const commit = (date: Date) => {
    if (isDisabled(date)) return
    value = toISODate(date)
    typed = undefined
    onchange?.(value)
    cursor = date
    closePanel(true)
  }

  const clear = () => {
    value = ""
    typed = undefined
    onchange?.("")
    input?.focus()
  }

  const moveCursor = async (next: Date) => {
    cursor = next
    if (next.getMonth() !== viewMonth.getMonth() || next.getFullYear() !== viewMonth.getFullYear()) {
      viewMonth = startOfMonth(next)
    }
    await focusCursor()
  }

  const onGridKeydown = async (e: KeyboardEvent) => {
    const key = e.key
    const rtl = typeof document !== "undefined" && getComputedStyle(grid ?? document.body).direction === "rtl"
    let next: Date | undefined

    if (key === "ArrowLeft") next = addDays(cursor, rtl ? 1 : -1)
    else if (key === "ArrowRight") next = addDays(cursor, rtl ? -1 : 1)
    else if (key === "ArrowUp") next = addDays(cursor, -7)
    else if (key === "ArrowDown") next = addDays(cursor, 7)
    else if (key === "Home") next = addDays(cursor, -((cursor.getDay() - firstDayOfWeek + 7) % 7))
    else if (key === "End") next = addDays(cursor, 6 - ((cursor.getDay() - firstDayOfWeek + 7) % 7))
    else if (key === "PageUp") next = addMonths(cursor, e.shiftKey ? -12 : -1)
    else if (key === "PageDown") next = addMonths(cursor, e.shiftKey ? 12 : 1)
    else if (key === "Escape") { e.preventDefault(); closePanel(true); return }
    else return

    e.preventDefault()
    await moveCursor(clampDate(next, minDate, maxDate))
  }

  const onFieldKeydown = async (e: KeyboardEvent) => {
    if (locked) return
    if (e.key === "ArrowDown" || (e.key === "Enter" && !editable)) {
      e.preventDefault()
      await openPanel()
    } else if (e.key === "Escape" && open) {
      e.preventDefault()
      closePanel(true)
    }
  }

  // Typing is allowed in ISO form, so "2026-03-14" works while other text is put back on blur
  const onTypedInput = (e: Event) => {
    typed = (e.currentTarget as HTMLInputElement).value
    const date = fromISODate(typed)
    if (date && !isDisabled(date)) {
      value = toISODate(date)
      onchange?.(value)
      viewMonth = startOfMonth(date)
      cursor = date
    }
  }

  $effect(() => {
    if (inline || !open || !anchor || !panel) return
    return attachPanel(anchor, panel, "bottom-start")
  })

  // Opens the year list on the year in view
  $effect(() => {
    if (view !== "years" || !yearList) return
    yearList.querySelector<HTMLElement>("[data-year-current='true']")?.scrollIntoView({ block: "center" })
  })

  $effect(() => {
    if (inline || !open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!anchor?.contains(target) && !panel?.contains(target)) closePanel()
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  })
</script>

{#snippet calendar()}
  <div class="theui-datepicker-calendar flex w-82 max-w-full flex-col gap-1">
    <div class="flex items-center gap-1 px-1 pt-1">
      <button
        type="button"
        class="{panelButtonClasses()} gap-1 px-3 py-1.5 text-sm font-medium"
        aria-expanded={view === "years"}
        aria-label="{monthLabel}, choose a year"
        onclick={() => view = view === "years" ? "days" : "years"}
      >
        <span aria-hidden="true">{monthLabel}</span>
        <Svg size={0.75} class="transition-transform {view === 'years' ? 'rotate-180' : ''}" aria-hidden="true">
          <path d="M3.646 5.646a.5.5 0 0 1 .708 0L8 9.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708z"/>
        </Svg>
      </button>

      <span class="grow"></span>
      <span class="sr-only" aria-live="polite">{monthLabel}</span>

      {#if view === "days"}
        <button
          type="button"
          class="{panelButtonClasses()} size-10 shrink-0"
          aria-label="Previous month"
          disabled={!!minDate && startOfMonth(viewMonth) <= startOfMonth(minDate)}
          onclick={() => viewMonth = addMonths(viewMonth, -1)}
        >
          <Svg size={0.9} class="rtl:rotate-180" aria-hidden="true">
            <path d="M10.354 3.646a.5.5 0 0 1 0 .708L6.707 8l3.647 3.646a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0z"/>
          </Svg>
        </button>
        <button
          type="button"
          class="{panelButtonClasses()} size-10 shrink-0"
          aria-label="Next month"
          disabled={!!maxDate && startOfMonth(viewMonth) >= startOfMonth(maxDate)}
          onclick={() => viewMonth = addMonths(viewMonth, 1)}
        >
          <Svg size={0.9} class="rtl:rotate-180" aria-hidden="true">
            <path d="M5.646 3.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L9.293 8 5.646 4.354a.5.5 0 0 1 0-.708z"/>
          </Svg>
        </button>
      {/if}
    </div>

    {#if view === "years"}
      <div bind:this={yearList} class="grid max-h-72 grid-cols-4 gap-1 overflow-auto p-1" role="listbox" aria-label="Year">
        {#each years as year (year)}
          {@const current = year === viewMonth.getFullYear()}
          <button
            type="button"
            role="option"
            aria-selected={current}
            data-year-current={current}
            class="{panelButtonClasses()} h-10 px-2 text-sm {current ? 'bg-brand-500 font-medium text-on-brand hover:bg-brand-600' : ''}"
            onclick={() => { viewMonth = new Date(year, viewMonth.getMonth(), 1); view = "days" }}
          >{year}</button>
        {/each}
      </div>

      <div class="grid grid-cols-3 gap-1 border-t border-gray-200/70 p-1 dark:border-gray-700/70">
        {#each months as month, i (month)}
          {@const current = i === viewMonth.getMonth()}
          <button
            type="button"
            class="{panelButtonClasses()} h-9 px-2 text-sm {current ? 'bg-brand-500/15 font-medium text-brand-600 dark:text-brand-300' : ''}"
            onclick={() => { viewMonth = new Date(viewMonth.getFullYear(), i, 1); view = "days" }}
          >{month.slice(0, 3)}</button>
        {/each}
      </div>
    {:else}
      <table bind:this={grid} role="grid" aria-label={monthLabel} class="w-full table-fixed border-collapse px-1" onkeydown={onGridKeydown}>
        <thead>
          <tr>
            {#each weekdays as day (day)}
              <th scope="col" class="pb-1 text-center text-xs font-medium text-muted">{day.slice(0, 2)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each { length: 6 }, week (week)}
            <tr>
              {#each days.slice(week * 7, week * 7 + 7) as day (day.getTime())}
                {@const outside = day.getMonth() !== viewMonth.getMonth()}
                {@const isSelectedDay = isSameDay(day, selectedDate)}
                {@const isToday = isSameDay(day, today())}
                {@const disabled = isDisabled(day)}
                <td role="gridcell" aria-selected={isSelectedDay} class="p-0 text-center align-middle">
                  <button
                    type="button"
                    data-cursor={isSameDay(day, cursor)}
                    tabindex={isSameDay(day, cursor) ? 0 : -1}
                    {disabled}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(day)}
                    class={twMerge(`${panelButtonClasses()} mx-auto size-10 text-sm ${outside ? "text-muted/70" : ""} ${isToday && !isSelectedDay ? "ring-1 ring-inset ring-brand-500 font-medium text-brand-600 dark:text-brand-300" : ""}`,
                      dayClasses,
                      isSelectedDay ? twMerge("bg-brand-500 font-medium text-on-brand shadow-sm hover:bg-brand-600", selectedDayClasses) : "")}
                    onclick={() => commit(day)}
                  >{day.getDate()}</button>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}

    {#if showToday || (clearable && value)}
      <div class="flex items-center justify-end gap-1 border-t border-gray-200/70 p-1 dark:border-gray-700/70">
        {#if clearable && value}
          <button type="button" class="{panelButtonClasses()} px-4 py-2 text-sm text-muted" onclick={() => { clear(); closePanel(true) }}>{clearText}</button>
        {/if}
        {#if showToday}
          <button
            type="button"
            class="{panelButtonClasses()} px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-300"
            disabled={isDisabled(today())}
            onclick={() => commit(today())}
          >{todayText}</button>
        {/if}
      </div>
    {/if}
  </div>
{/snippet}

<div class={twMerge(inputContainerClass(C, true), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  {#if inline}
    <div class={twMerge(`theui-datepicker-inline w-max rounded-2xl border border-gray-200/80 bg-primary p-2 dark:border-gray-700/80`, panelClass)}>
      {@render calendar()}
    </div>
  {:else}
    <div bind:this={anchor} class="relative">
      <div class={twMerge(inputClasses(C, props), "theui-datepicker flex items-center gap-2")}>
        <input
          bind:this={input}
          {id}
          type="text"
          autocomplete="off"
          aria-describedby={helperText ? `${id}-helper` : null}
          {...props}
          readonly={!editable || !!props?.readonly}
          value={editable ? (typed ?? value) : formatted}
          {placeholder}
          class="theui-datepicker-input min-w-0 grow border-0 bg-transparent p-0 outline-none placeholder:text-muted focus:ring-0 {editable ? '' : 'cursor-pointer'}"
          oninput={editable ? onTypedInput : undefined}
          onblur={() => { if (editable) typed = undefined }}
          onclick={() => { if (!editable) openPanel() }}
          onkeydown={onFieldKeydown}
        />

        {#if clearable && value && !locked}
          <Close size={0.9} ariaLabel="Clear date" onclick={clear} />
        {/if}

        <button
          type="button"
          class="shrink-0 text-muted disabled:opacity-50"
          aria-label={openLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={locked}
          onclick={() => open ? closePanel(true) : openPanel()}
        >
          <Svg size={1} aria-hidden="true">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h.5A1.5 1.5 0 0 1 15 2.5v11A1.5 1.5 0 0 1 13.5 15h-11A1.5 1.5 0 0 1 1 13.5v-11A1.5 1.5 0 0 1 2.5 1H3V.5a.5.5 0 0 1 .5-.5zM2 4v9.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V4H2z"/>
          </Svg>
        </button>
      </div>

      {#if open}
        <div
          bind:this={panel}
          role="dialog"
          aria-modal="false"
          aria-label={openLabel}
          class={twMerge(panelClasses(), panelClass)}
        >
          {@render calendar()}
        </div>
      {/if}
    </div>
  {/if}

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
