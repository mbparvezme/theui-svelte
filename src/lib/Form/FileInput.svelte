<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form"
  import { getContext, setContext, type Snippet } from "svelte"
	import { HelperText, Label } from "$lib";

  interface Props {
    files?: FileList | null,
    id?: string,
    label?: Snippet|string,
    name: string,
    helperText ?: Snippet | string,
    [key: string] : unknown
  }

  const CTX: any = getContext('FORM') ?? {}

  let {
    files,
    id = generateToken(),
    label,
    name,
    rounded = CTX?.rounded ?? "md",
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    helperText,
    reset = CTX?.reset ?? false,
    ...props
  } : Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string} = {rounded, size, variant, reset, id}

  setContext('FORM', C)
</script>

{#snippet labelContent()}
  {#if typeof label == "string"}
    <Label {id} {label} />
  {/if}
  {#if typeof label == "function"}
    {@render label?.()}
  {/if}
{/snippet}

<div class={inputContainerClass(C, props )}>
  {#if label} {@render labelContent()} {/if}
  <div class="relative flex focus-within">
    <input type="file" {...props} class={inputClasses(C, props, "file")} {id} {name} bind:files />
  </div>

  {#if helperText}
    {#if typeof helperText == "string"}
      <HelperText text={helperText} />
    {/if}
    {#if typeof helperText == "function"}
      {@render helperText?.()}
    {/if}
  {/if}
</div>
