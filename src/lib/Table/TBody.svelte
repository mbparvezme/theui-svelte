<script lang="ts">
	import type { Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import {TR} from "$lib"

  interface Props{children ?: Snippet, data?: string[]|Record<string, unknown>[], keys?: string[], [key: string] : unknown}
  let{children, data, keys, ...props} : Props = $props()

  let isMultiRows = (d: any) => (Array.isArray(d) && (Object.prototype.toString.call(d[0]) === "[object Object]" || Array.isArray(d[0])))
</script>

{#if data || children}
<tbody {...props} class={twMerge("text-start", props?.class as string)}>
  {#if data}
    {#if isMultiRows(data)}
      {#if Array.isArray(data) && Object.prototype.toString.call(data[0]) === "[object Object]"}
        {#each data as r}
          <TR data={r as string[] | Record<string, unknown>} {keys} />
        {/each}
      {/if}
    {:else}
      <TR data={data as string[] | Record<string, unknown>} {keys} />
    {/if}
  {:else}
    {@render children?.()}
  {/if}
</tbody>
{/if}
