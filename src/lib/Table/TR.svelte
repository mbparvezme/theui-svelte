<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import { twMerge } from "tailwind-merge"
  import { TH, TD } from "$lib"

  interface Props {children?: Snippet, data?: Array<string>|Record<string, unknown>, keys?: string[], tableHeader?: boolean, [key: string]: unknown}
  let {children, data, keys, tableHeader = false, ...props} : Props = $props()
  const CTX: any = getContext("TABLE")
</script>

{#if children}
  <tr {...props} class={twMerge(tableHeader ? CTX?.trHeadClasses : CTX.trClasses, props?.class as string)}>
    {@render children()}
  </tr>
{:else}
  <tr {...props} class={twMerge(tableHeader ? CTX?.trHeadClasses : CTX.trClasses, props?.class as string)}>
    {#if Array.isArray(data)}
      {#each data as d}
        {#if tableHeader}
          <TH scope="col">{@html d.toString()}</TH>
        {:else}
          <TD>{@html d.toString()}</TD>
        {/if}
      {/each}
    {/if}

    {#if keys && data !== null && Object.prototype.toString.call(data) === "[object Object]"}
      {#each keys as k}
        {#if tableHeader}
          <TH scope="col">{@html (data as Record<string, unknown>)[k] as string | number ?? "INVALID_KEY"}</TH>
        {:else}
          <TD>{@html (data as Record<string, unknown>)[k] as string | number ?? "INVALID_KEY"}</TD>
        {/if}
      {/each}
    {/if}
  </tr>
{/if}