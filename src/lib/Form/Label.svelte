<script lang="ts">
  import { getContext, type Snippet } from "svelte"
  import type { INPUT_CONFIG } from "$lib/types"
	import { labelClasses } from "$lib/Form/form"

  // Set by Input/Select with their own settings; only their labels can float
  const INPUT_CTX = getContext<INPUT_CONFIG | undefined>('INPUT_LABEL')
  const GROUP_CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}
  let {children, ...props} : {children: Snippet, [key : string]: unknown} = $props()

  // Any other label (Checkbox, Radio, Toggle, File input, standalone) keeps the group settings but never floats
  const config: INPUT_CONFIG = $derived(INPUT_CTX ?? { ...GROUP_CTX, floatingLabel: false })
</script>

{#if children}
  <label {...props} class={labelClasses(config, (props?.class as string) ?? "")}>
    {@render children()}
  </label>
{/if}
