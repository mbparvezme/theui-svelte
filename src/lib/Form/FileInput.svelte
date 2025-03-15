<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form"
  import { getContext, setContext, type Snippet } from "svelte"
	import { HelperText, Label } from "$lib"
	import { twMerge } from "tailwind-merge";

  interface Props {
    children?: Snippet,
    files?: FileList | null,
    id?: string,
    name: string,
    helperText ?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  const CTX_FORM: any = getContext('FORM') ?? {}
  const CTX_FSET: any = getContext('FIELDSET') ?? {}

  let {
    children,
    files,
    name,
    size = CTX_FSET?.size ?? CTX_FORM?.size ?? "md",
    variant = CTX_FSET?.variant ?? CTX_FORM?.variant ?? "bordered",
    rounded = CTX_FSET?.rounded ?? CTX_FORM?.rounded ?? "md",
    reset = CTX_FSET?.reset ?? CTX_FORM?.reset ?? false,
    helperText,
    labelClasses,
    wrapperClasses,
    id = generateToken(),
    ...props
  } : Props & INPUT_CONFIG = $props()

  let C:INPUT_CONFIG & {id: string} = {rounded, size, variant, reset, id}

  setContext('FORM', C)
</script>

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="relative flex flex-col gap-1 focus-within">
    <input type="file" {...props} class={inputClasses(C, props, "file")} {id} {name} bind:files />
    {#if helperText}
      {#if typeof helperText == "string"}
        <HelperText>{helperText}</HelperText>
      {/if}
      {#if typeof helperText == "function"}
        {@render helperText?.()}
      {/if}
    {/if}
  </div>

</div>
