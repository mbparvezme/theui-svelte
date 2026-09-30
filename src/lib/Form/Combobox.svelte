<script lang="ts">
  import { getContext, tick, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { COMBOBOX_ITEM, COMBOBOX_OPTION, INPUT_CONFIG } from "$lib/types"
  import { generateToken, roundedClass, coreSpeed, coreReset } from "$lib/function"
  import { inputClasses, inputContainerClass } from "$lib/Form/form"
  import { defaultFilter, groupOptions, sameValue, toOptions } from "$lib/Form/combobox"
  import { attachPanel, optionClasses, panelClasses } from "$lib/Form/popup"
  import { Close, HelperText, Label, Spinner, Svg } from "$lib"

  interface Props {
    children?: Snippet,
    option?: Snippet<[COMBOBOX_OPTION]>,
    items?: COMBOBOX_ITEM[],
    value?: unknown,
    multiple?: boolean,
    searchable?: boolean,
    clearable?: boolean,
    creatable?: boolean,
    loading?: boolean,
    placeholder?: string,
    emptyText?: string,
    createText?: (query: string) => string,
    filter?: (option: COMBOBOX_OPTION, query: string) => boolean,
    onsearch?: (query: string) => void,
    onchange?: (value: unknown) => void,
    name?: string,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    fieldClasses?: string,
    panelClass?: string,
    optionClass?: string,
    chipClasses?: string,
    [key: string]: unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    option: optionSnippet,
    items = [],
    value = $bindable(),
    multiple = false,
    searchable = true,
    clearable = true,
    creatable = false,
    loading = false,
    placeholder = "",
    emptyText = "No results",
    createText = (q) => `Create “${q}”`,
    filter = defaultFilter,
    onsearch,
    onchange,
    name,
    helperText,
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),
    reset = CTX?.reset ?? coreReset(),
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    fieldClasses = "",
    panelClass = "",
    optionClass = "",
    chipClasses = "",
    ...props
  }: Props & INPUT_CONFIG = $props()

  const fallbackId = generateToken()
  const id = $derived((props.id as string | undefined) ?? fallbackId)
  const listId = $derived(`${id}-list`)
  const C: INPUT_CONFIG = $derived({ animationSpeed, rounded, size, variant, reset })
  const locked = $derived(!!props?.disabled || !!props?.readonly)

  let anchor: HTMLDivElement | undefined = $state()
  let panel: HTMLDivElement | undefined = $state()
  let input: HTMLInputElement | undefined = $state()
  let open = $state(false)
  let query = $state("")
  let activeIndex = $state(0)

  const options = $derived(toOptions(items))
  const selectedValues = $derived(multiple ? (Array.isArray(value) ? value : value === undefined ? [] : [value]) : [])
  const selected = $derived(multiple ? undefined : options.find(o => sameValue(o.value, value)))
  const selectedOptions = $derived(multiple
    ? selectedValues.map(v => options.find(o => sameValue(o.value, v)) ?? { value: v, text: String(v), disabled: false })
    : [])

  // With `onsearch` the parent decides what `items` holds, so nothing is filtered here
  const matches = $derived(!query.trim() || onsearch ? options : options.filter(o => filter(o, query)))
  const canCreate = $derived(creatable && !!query.trim() && !options.some(o => o.text.toLowerCase() === query.trim().toLowerCase()))
  const groups = $derived(groupOptions(matches))
  // The create entry sits after the matches and shares their index list
  const navigable = $derived(matches.filter(o => !o.disabled))
  const navCount = $derived(navigable.length + (canCreate ? 1 : 0))

  const isSelected = (option: COMBOBOX_OPTION): boolean =>
    multiple ? selectedValues.some(v => sameValue(v, option.value)) : sameValue(value, option.value)

  const optionIndex = (option: COMBOBOX_OPTION): number => navigable.findIndex(o => sameValue(o.value, option.value))

  const commit = (next: unknown) => {
    value = next
    onchange?.(next)
  }

  const openPanel = async () => {
    if (locked || open) return
    open = true
    activeIndex = Math.max(0, navigable.findIndex(o => isSelected(o)))
    await tick()
  }

  const closePanel = (focus = false) => {
    if (!open) return
    open = false
    query = ""
    if (focus) input?.focus()
  }

  const select = (option: COMBOBOX_OPTION) => {
    if (option.disabled) return
    if (multiple) {
      const exists = selectedValues.some(v => sameValue(v, option.value))
      commit(exists ? selectedValues.filter(v => !sameValue(v, option.value)) : [...selectedValues, option.value])
      query = ""
      onsearch?.("")
      input?.focus()
    } else {
      commit(option.value)
      closePanel(true)
    }
  }

  const create = () => {
    const text = query.trim()
    if (!text) return
    select({ value: text, text, disabled: false })
  }

  const chooseActive = () => {
    if (canCreate && activeIndex === navigable.length) { create(); return }
    const option = navigable[activeIndex]
    if (option) select(option)
  }

  const clear = () => {
    commit(multiple ? [] : undefined)
    query = ""
    input?.focus()
  }

  const remove = (index: number) => commit(selectedValues.filter((_, i) => i !== index))

  const move = (step: number) => {
    if (!navCount) return
    activeIndex = (activeIndex + step + navCount) % navCount
  }

  const onKeydown = async (e: KeyboardEvent) => {
    if (locked) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!open) { await openPanel(); return }
      move(e.key === "ArrowDown" ? 1 : -1)
    } else if (e.key === "Enter") {
      if (!open) return
      e.preventDefault()
      chooseActive()
    } else if (e.key === "Escape") {
      if (!open) return
      e.preventDefault()
      closePanel(true)
    } else if (e.key === "Home" && open) {
      e.preventDefault()
      activeIndex = 0
    } else if (e.key === "End" && open) {
      e.preventDefault()
      activeIndex = Math.max(0, navCount - 1)
    } else if (e.key === "Backspace" && multiple && !query && selectedValues.length) {
      remove(selectedValues.length - 1)
    } else if (e.key === "Tab") {
      closePanel()
    }
  }

  const onInput = async (e: Event) => {
    query = (e.currentTarget as HTMLInputElement).value
    activeIndex = 0
    onsearch?.(query)
    if (!open) await openPanel()
  }

  // Follows the field while the page scrolls or the window resizes
  $effect(() => {
    if (!open || !anchor || !panel) return
    return attachPanel(anchor, panel, "bottom-start")
  })

  // Keeps the highlighted option in view. activeIndex is read here so the effect
  // runs again on every move, not only when the panel opens.
  $effect(() => {
    if (!open || activeIndex < 0) return
    panel?.querySelector<HTMLElement>("[data-active='true']")?.scrollIntoView({ block: "nearest" })
  })

  $effect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (!anchor?.contains(target) && !panel?.contains(target)) closePanel()
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  })
</script>

<div class={twMerge(inputContainerClass(C, true), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div bind:this={anchor} class="relative">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class={twMerge(inputClasses(C, props), "theui-combobox flex min-h-0 flex-wrap items-center gap-1", locked ? "" : "cursor-text", fieldClasses)}
      onclick={() => { if (!locked) { input?.focus(); openPanel() } }}
    >
      {#each selectedOptions as option, i (option.value)}
        <span class={twMerge(`theui-combobox-chip flex items-center gap-1 bg-secondary px-2 py-0.5 text-sm ${roundedClass(rounded)}`, chipClasses)}>
          {option.text}
          {#if !locked}
            <Close size={0.75} ariaLabel="Remove {option.text}" onclick={(e) => { e.stopPropagation(); remove(i) }} />
          {/if}
        </span>
      {/each}

      <input
        bind:this={input}
        {id}
        type="text"
        role="combobox"
        autocomplete="off"
        spellcheck="false"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete={searchable ? "list" : "none"}
        aria-activedescendant={open && navCount ? `${id}-opt-${activeIndex}` : undefined}
        aria-describedby={helperText ? `${id}-helper` : null}
        {...props}
        readonly={!searchable || !!props?.readonly}
        value={open ? query : (selected?.text ?? "")}
        placeholder={multiple && selectedOptions.length ? "" : (open && selected ? selected.text : placeholder)}
        class="theui-combobox-input min-w-16 grow border-0 bg-transparent p-0 outline-none placeholder:text-muted focus:ring-0"
        oninput={onInput}
        onkeydown={onKeydown}
        onfocus={() => { if (!locked) openPanel() }}
      />

      {#if loading}
        <Spinner size="xs" class="text-muted" label="Loading options" />
      {:else if clearable && !locked && (multiple ? selectedValues.length : value !== undefined && value !== null && value !== "")}
        <Close size={0.9} ariaLabel="Clear selection" onclick={(e) => { e.stopPropagation(); clear() }} />
      {/if}

      <Svg size={0.9} class="shrink-0 text-muted transition-transform {open ? 'rotate-180' : ''}" aria-hidden="true">
        <path d="M3.646 5.646a.5.5 0 0 1 .708 0L8 9.293l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708z"/>
      </Svg>
    </div>

    {#if open}
      <div bind:this={panel} class={twMerge(panelClasses(), panelClass)}>
        <ul id={listId} role="listbox" aria-multiselectable={multiple ? true : undefined} aria-label={placeholder || "Options"}>
          {#each groups as group (group.group ?? "")}
            {#if group.group}
              <li class="px-3 pt-2 pb-1 text-xs font-semibold text-muted" role="presentation">{group.group}</li>
            {/if}
            {#each group.options as option (option.value)}
              {@const index = optionIndex(option)}
              <!-- The listbox is driven from the input with aria-activedescendant, so the option itself needs no key handler -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <li
                id={index >= 0 ? `${id}-opt-${index}` : undefined}
                role="option"
                aria-selected={isSelected(option)}
                aria-disabled={option.disabled || undefined}
                data-active={index >= 0 && index === activeIndex}
                class={twMerge(optionClasses(isSelected(option), index === activeIndex, option.disabled), optionClass)}
                onclick={() => select(option)}
                onpointermove={() => { if (index >= 0) activeIndex = index }}
              >
                {#if optionSnippet}
                  {@render optionSnippet(option)}
                {:else}
                  <span class="grow">{option.text}</span>
                  {#if isSelected(option)}
                    <Svg size={0.9} aria-hidden="true">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </Svg>
                  {/if}
                {/if}
              </li>
            {/each}
          {/each}

          {#if canCreate}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <li
              id={`${id}-opt-${navigable.length}`}
              role="option"
              aria-selected="false"
              data-active={activeIndex === navigable.length}
              class={twMerge(optionClasses(false, activeIndex === navigable.length, false), optionClass)}
              onclick={create}
              onpointermove={() => activeIndex = navigable.length}
            >{createText(query.trim())}</li>
          {/if}

          {#if !matches.length && !canCreate}
            <li class="px-3 py-2 text-sm text-muted" role="presentation">{loading ? "Loading…" : emptyText}</li>
          {/if}
        </ul>
      </div>
    {/if}
  </div>

  {#if name}
    {#if multiple}
      {#each selectedValues as v, i (i)}
        <input type="hidden" {name} value={v === undefined || v === null ? "" : String(v)} />
      {/each}
    {:else}
      <input type="hidden" {name} value={value === undefined || value === null ? "" : String(value)} />
    {/if}
  {/if}

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
