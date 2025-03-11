<script lang="ts">
  import { getContext, type Snippet } from "svelte"
	import { labelClasses } from "./form"

  const CTX: any = getContext('FORM') ?? {}
  let {label, id = "", ...props} : {label: Snippet|string, id: string, [key : string]: unknown} = $props()
</script>

{#if label}
<label class={labelClasses(CTX, props)} for={id}>
  {#if typeof label == "string"}
    {@html label}
  {/if}
  {#if typeof label == "function"}
    {@render label()}
  {/if}
</label>
{/if}