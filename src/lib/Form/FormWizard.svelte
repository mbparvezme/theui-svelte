<script lang="ts">
  import { setContext, untrack, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { WIZARD_CTX, WIZARD_STEP_INFO } from "$lib/types"
  import { Svg } from "$lib"

  interface Props {
    children: Snippet,
    step?: number,
    orientation?: "horizontal" | "vertical",
    header?: boolean,
    controls?: boolean,
    linear?: boolean,
    backText?: string,
    nextText?: string,
    finishText?: string,
    ariaLabel?: string,
    onchange?: (step: number) => void,
    onfinish?: () => void,
    headerClasses?: string,
    indicatorClasses?: string,
    activeIndicatorClasses?: string,
    completeIndicatorClasses?: string,
    stepClasses?: string,
    controlsClasses?: string,
    buttonClasses?: string,
    [key: string]: unknown
  }

  let {
    children,
    step = $bindable(1),
    orientation = "horizontal",
    header = true,
    controls = true,
    linear = true,
    backText = "Back",
    nextText = "Next",
    finishText = "Finish",
    ariaLabel = "Steps",
    onchange,
    onfinish,
    headerClasses = "",
    indicatorClasses = "",
    activeIndicatorClasses = "",
    completeIndicatorClasses = "",
    stepClasses = "",
    controlsClasses = "",
    buttonClasses = "",
    ...props
  }: Props = $props()

  let root: HTMLDivElement | undefined = $state()
  let ids: string[] = $state([])
  let infos = $state<Record<string, WIZARD_STEP_INFO>>({})
  // The furthest step reached, so a linear wizard allows going back to any finished step
  let reached = $state(1)

  const total = $derived(ids.length)
  const active = $derived(Math.min(Math.max(Math.round(step), 1), Math.max(total, 1)))
  const steps = $derived(ids.map(id => infos[id] ?? {}))

  $effect(() => {
    if (active > reached) reached = active
  })

  // Keeps the steps in the order they appear on the page
  $effect(() => {
    if (!root || ids.length < 2) return
    const order = Array.from(root.querySelectorAll<HTMLElement>("[data-wizard-step]")).map(el => el.dataset.wizardStep!)
    if (order.length === ids.length && order.some((id, i) => id !== ids[i])) ids = order
  })

  setContext<WIZARD_CTX>("FORM_WIZARD", {
    add: (id, info) => untrack(() => {
      if (!ids.includes(id)) ids.push(id)
      infos[id] = info
    }),
    remove: (id) => untrack(() => {
      ids = ids.filter(i => i !== id)
      delete infos[id]
    }),
    step: (id) => {
      const index = ids.indexOf(id)
      return {
        index,
        total,
        active: index === active - 1,
        complete: index < active - 1,
      }
    },
    get stepClasses() { return stepClasses },
  })

  const panel = (index: number): HTMLElement | null =>
    root?.querySelector<HTMLElement>(`[data-wizard-step="${ids[index]}"]`) ?? null

  // A step passes when its own fields are valid and its `validate` returns true
  const valid = async (index: number): Promise<boolean> => {
    const el = panel(index)
    if (el) {
      const fields = el.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity()
          return false
        }
      }
    }
    return (await steps[index]?.validate?.()) ?? true
  }

  const goto = (to: number, focus = true) => {
    const next = Math.min(Math.max(to, 1), Math.max(total, 1))
    if (next === active) return
    step = next
    onchange?.(next)
    if (focus) requestAnimationFrame(() => panel(next - 1)?.focus())
  }

  const back = () => goto(active - 1)

  const next = async () => {
    if (!(await valid(active - 1))) return
    if (active >= total) { onfinish?.(); return }
    goto(active + 1)
  }

  const onHeaderClick = async (index: number) => {
    const to = index + 1
    if (to === active) return
    if (!linear || to < active) { goto(to); return }
    // Moving forward in a linear wizard checks every step in between
    for (let i = active - 1; i < to - 1; i++) {
      if (!(await valid(i))) { goto(i + 1); return }
    }
    goto(to)
  }

  const reachable = (index: number): boolean => !linear || index + 1 <= reached
</script>

<div bind:this={root} {...props} class={twMerge(`theui-wizard flex flex-col gap-6 ${orientation === "vertical" ? "sm:flex-row" : ""}`, props?.class as string)}>
  {#if header}
    <ol
      aria-label={ariaLabel}
      class={twMerge(`theui-wizard-header flex ${orientation === "vertical" ? "shrink-0 flex-col gap-4 sm:w-56" : "w-full items-start"}`, headerClasses)}
    >
      {#each steps as info, i (ids[i])}
        {@const isActive = i === active - 1}
        {@const isComplete = i < active - 1}
        <li class="flex {orientation === 'vertical' ? 'w-full items-start gap-3' : 'flex-1 flex-col items-center gap-2 text-center'}">
          {#if orientation === "horizontal" && i > 0}
            <span class="sr-only">,</span>
          {/if}
          <div class="flex {orientation === 'vertical' ? 'flex-col items-center self-stretch' : 'w-full items-center'}">
            {#if orientation === "horizontal"}
              <span class="h-0.5 grow {i === 0 ? 'invisible' : isComplete || isActive ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}" aria-hidden="true"></span>
            {/if}
            <button
              type="button"
              disabled={!reachable(i)}
              aria-current={isActive ? "step" : undefined}
              class={twMerge(`theui-wizard-indicator flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isComplete ? "border-brand-500 bg-brand-500 text-on-brand" : isActive ? "border-brand-500 text-brand-500" : "border-gray-300 text-muted dark:border-gray-600"}`,
                indicatorClasses,
                isComplete ? completeIndicatorClasses : "",
                isActive ? activeIndicatorClasses : "")}
              onclick={() => onHeaderClick(i)}
            >
              {#if isComplete}
                <Svg size={1} aria-hidden="true">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </Svg>
              {:else}
                {i + 1}
              {/if}
              <span class="sr-only">{info.title ?? `Step ${i + 1}`}{isComplete ? " (completed)" : ""}</span>
            </button>
            {#if orientation === "horizontal"}
              <span class="h-0.5 grow {i === steps.length - 1 ? 'invisible' : isComplete ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}" aria-hidden="true"></span>
            {:else if i < steps.length - 1}
              <span class="my-1 w-0.5 grow {isComplete ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}" aria-hidden="true"></span>
            {/if}
          </div>

          {#if info.title || info.description}
            <div class="{orientation === 'vertical' ? 'pb-4 text-start' : ''}" aria-hidden="true">
              {#if info.title}
                <div class="text-sm font-medium {isActive ? 'text-default' : 'text-muted'}">{info.title}{#if info.optional}<span class="text-muted"> (optional)</span>{/if}</div>
              {/if}
              {#if info.description}<div class="text-xs text-muted">{info.description}</div>{/if}
            </div>
          {/if}
        </li>
      {/each}
    </ol>
  {/if}

  <div class="theui-wizard-content grow">
    {@render children()}

    {#if controls}
      <div class={twMerge("theui-wizard-controls mt-6 flex items-center justify-between gap-3", controlsClasses)}>
        <button
          type="button"
          class={twMerge("rounded-md border border-gray-300 px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600", buttonClasses)}
          disabled={active <= 1}
          onclick={back}
        >{backText}</button>
        <button
          type="button"
          class={twMerge("rounded-md bg-brand-500 px-4 py-2 font-medium text-on-brand", buttonClasses)}
          onclick={next}
        >{active >= total ? finishText : nextText}</button>
      </div>
    {/if}
  </div>
</div>
