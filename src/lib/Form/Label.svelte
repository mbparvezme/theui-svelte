<script lang="ts">
  import { getContext, type Snippet } from "svelte"
	import { labelClasses } from "$lib/Form/form"

  const CTX: any = getContext('FORM') ?? {}
  let {children, ...props} : {children: Snippet, [key : string]: unknown} = $props()
</script>

{#if children}
<label {...props} class={labelClasses(CTX, props)}>
  {@render children()}
</label>
{/if}
