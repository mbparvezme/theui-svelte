<script lang="ts">
  import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import type { DIVIDER_ALIGN, DIVIDER_ORIENTATION, DIVIDER_VARIANT } from "$lib/types"

  interface Props {
    children?: Snippet,
    orientation?: DIVIDER_ORIENTATION,
    align?: DIVIDER_ALIGN,
    variant?: DIVIDER_VARIANT,
    lineClasses?: string,
    labelClasses?: string,
    [key: string]: unknown
  }

  let {
    children,
    orientation = "horizontal",
    align = "center",
    variant = "solid",
    lineClasses = "",
    labelClasses = "",
    ...props
  }: Props = $props()

  const STYLES: Record<DIVIDER_VARIANT, string> = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  }

  const vertical = $derived(orientation === "vertical")
  const line = $derived(`theui-divider-line border-gray-200 dark:border-gray-700 ${STYLES[variant] ?? STYLES.solid} ${vertical ? "border-s" : "border-t"}`)

  // The label sits between two lines; align decides how much line is on each side
  const START: Record<DIVIDER_ALIGN, string> = { start: "basis-6 grow-0", center: "grow", end: "grow" }
  const END: Record<DIVIDER_ALIGN, string> = { start: "grow", center: "grow", end: "basis-6 grow-0" }
  const labelLine = $derived(`${line} ${vertical ? "w-0" : "h-0"}`)
</script>

{#if children}
  <div
    {...props}
    class={twMerge(`theui-divider flex items-center text-sm text-muted ${vertical ? "h-full flex-col gap-2" : "w-full gap-3"}`, props?.class as string)}
  >
    <span aria-hidden="true" class={twMerge(labelLine, START[align] ?? START.center, lineClasses)}></span>
    <span class={twMerge("theui-divider-label shrink-0 whitespace-nowrap", labelClasses)}>{@render children()}</span>
    <span aria-hidden="true" class={twMerge(labelLine, END[align] ?? END.center, lineClasses)}></span>
  </div>
{:else if vertical}
  <div role="separator" aria-orientation="vertical" {...props} class={twMerge(`theui-divider self-stretch h-full w-0 ${line}`, lineClasses, props?.class as string)}></div>
{:else}
  <hr {...props} class={twMerge(`theui-divider my-2 w-full ${line}`, lineClasses, props?.class as string)} />
{/if}
