<script lang="ts">
  import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import {TR} from "$lib"

  interface Props{children ?: Snippet, data?: string[]|Record<string, unknown>[], keys?: string[], [key: string] : unknown}
  let{children, data, keys, ...props} : Props = $props()

  const isMultiRows = (d: unknown): d is Record<string, unknown>[] => {
    return Array.isArray(d) && d.length > 0 && typeof d[0] === "object" && d[0] !== null
  }

  const isSingleRow = (d: unknown): d is string[] | Record<string, unknown> =>{
    return Array.isArray(d) || (typeof d === "object" && d !== null)
  }
</script>

{#if data || children}
<tbody {...props} class={twMerge("text-start", props?.class as string)}>
  {#if data}
    {#if isMultiRows(data)}
      {#each data as r, i (i)}
        <TR data={r} {keys} />
      {/each}
    {:else if isSingleRow(data) && (Array.isArray(data) ? data.length > 0 : true)}
      <TR data={data} {keys} />
    {/if}
  {:else}
    {@render children?.()}
  {/if}
</tbody>
{/if}
