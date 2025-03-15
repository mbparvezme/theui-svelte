<script lang="ts">
  import { getContext, type Snippet } from "svelte"
	import { labelClasses } from "./form"

  const CTX: any = getContext('FORM') ?? {}
  let {children, id, ...props} : {children: Snippet, id?: string, [key : string]: unknown} = $props()
</script>

{#if children}
<label class={labelClasses(CTX, props)} for={id}>
  {@render children()}
</label>
{/if}
