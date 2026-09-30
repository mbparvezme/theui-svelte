<script lang="ts">
  import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { RATING_SIZE } from "$lib/types"
  import { Svg } from "$lib"

  interface Props {
    icon?: Snippet,
    value?: number,
    max?: number,
    allowHalf?: boolean,
    readonly?: boolean,
    disabled?: boolean,
    clearable?: boolean,
    size?: RATING_SIZE,
    name?: string,
    ariaLabel?: string,
    itemLabel?: (value: number, max: number) => string,
    onchange?: (value: number) => void,
    itemClasses?: string,
    activeClasses?: string,
    inactiveClasses?: string,
    [key: string]: unknown
  }

  let {
    icon,
    value = $bindable(0),
    max = 5,
    allowHalf = false,
    readonly = false,
    disabled = false,
    clearable = true,
    size = "md",
    name,
    ariaLabel = "Rating",
    itemLabel = (v, m) => `${v} of ${m}`,
    onchange,
    itemClasses = "",
    activeClasses = "text-warning-400",
    inactiveClasses = "text-gray-300 dark:text-gray-600",
    ...props
  }: Props = $props()

  const SIZES: Record<RATING_SIZE, string> = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
    xl: "size-10",
  }

  const uid = $props.id()
  const groupName = $derived(name ?? uid)

  let hovered = $state<number | null>(null)

  const total = $derived(Math.max(1, Math.floor(max)))
  const sizeClass = $derived(SIZES[size] ?? SIZES.md)
  const interactive = $derived(!readonly && !disabled)
  // The hovered value is only a preview; it never changes the value itself
  const shown = $derived(hovered ?? value)
  // How much of star `i` is filled, from 0 to 100
  const fill = (i: number): number => Math.min(Math.max(shown - (i - 1), 0), 1) * 100

  const select = (v: number) => {
    const next = clearable && value === v ? 0 : v
    if (next === value) return
    value = next
    onchange?.(next)
  }
</script>

{#snippet star()}
  {#if icon}
    {@render icon()}
  {:else}
    <Svg size={0} class="size-full">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </Svg>
  {/if}
{/snippet}

{#snippet stars()}
  {#each { length: total }, s (s)}
    {@const i = s + 1}
    <span class={twMerge(`theui-rating-item relative inline-flex ${sizeClass} rounded-sm has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-brand-500`, itemClasses)}>
      <span class="absolute inset-0 {inactiveClasses}" aria-hidden="true">{@render star()}</span>
      <span class="absolute inset-y-0 inset-s-0 overflow-hidden {activeClasses}" style="width: {fill(i)}%" aria-hidden="true">
        <span class="absolute inset-y-0 inset-s-0 flex {sizeClass}">{@render star()}</span>
      </span>

      {#if interactive}
        {#each allowHalf ? [i - 0.5, i] : [i] as v (v)}
          <label
            class="absolute inset-y-0 {allowHalf && v < i ? 'inset-s-0 w-1/2' : allowHalf ? 'inset-e-0 w-1/2' : 'inset-s-0 w-full'} cursor-pointer"
            onpointerenter={(e) => { if (e.pointerType === "mouse") hovered = v }}
          >
            <input
              type="radio"
              class="sr-only"
              name={groupName}
              value={v}
              checked={value === v}
              onclick={() => select(v)}
              onchange={() => select(v)}
            />
            <span class="sr-only">{itemLabel(v, total)}</span>
          </label>
        {/each}
      {/if}
    </span>
  {/each}
{/snippet}

{#if interactive}
  <span
    role="radiogroup"
    aria-label={ariaLabel}
    {...props}
    class={twMerge("theui-rating inline-flex items-center gap-1 align-middle", props?.class as string)}
    onpointerleave={() => hovered = null}
  >
    {@render stars()}
  </span>
{:else}
  <span
    role="img"
    aria-label="{ariaLabel}: {itemLabel(value, total)}"
    {...props}
    class={twMerge(`theui-rating inline-flex items-center gap-1 align-middle ${disabled ? "cursor-not-allowed opacity-60" : ""}`, props?.class as string)}
  >
    {@render stars()}
    {#if disabled && name}<input type="hidden" {name} value={value} />{/if}
  </span>
{/if}
