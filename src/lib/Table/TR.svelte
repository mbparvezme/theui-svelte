<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { TH, TD } from "$lib"
	import type { TABLE_CONTEXT } from "$lib/types"

  interface Props {children?: Snippet, data?: Array<string>|Record<string, unknown>, keys?: string[], tableHeader?: boolean, [key: string]: unknown}
  let {children, data, keys, tableHeader = false, ...props} : Props = $props()
  const CTX = getContext<TABLE_CONTEXT>("TABLE")

  const cellValue = (value: unknown): string => {
    if (value === null || value === undefined) return ""
    return String(value)
  }
</script>

<tr {...props} class={twMerge(tableHeader ? CTX?.trHeadClasses : CTX?.trClasses, props?.class as string)}>
  {#if children}
    {@render children()}
  {:else if Array.isArray(data)}
    {#each data as d, i (i)}
      {#if tableHeader}
        <TH scope="col">{cellValue(d)}</TH>
      {:else}
        <TD>{cellValue(d)}</TD>
      {/if}
    {/each}
  {:else if keys && data !== null && typeof data === "object"}
    {#each keys as k (k)}
      {#if tableHeader}
        <TH scope="col">{cellValue((data as Record<string, unknown>)[k])}</TH>
      {:else}
        <TD>{cellValue((data as Record<string, unknown>)[k])}</TD>
      {/if}
    {/each}
  {/if}
</tr>