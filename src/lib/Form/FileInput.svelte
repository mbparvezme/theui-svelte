<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken } from "$lib/function"
	import { inputContainerClass, inputClasses } from "./form"
  import { getContext, setContext, type Snippet } from "svelte"
	import { HelperText, Label } from "$lib"
	import { twMerge } from "tailwind-merge";

  interface Props {
    children?: Snippet,
    files?: FileList,
    helperText?: Snippet | string,
    labelClasses?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  const CTX_FORM: any = getContext('FORM') ?? {}
  const CTX_FSET: any = getContext('FIELDSET') ?? {}

  let {
    children,
    files,
    size = CTX_FSET?.size ?? CTX_FORM?.size ?? "md",
    variant = CTX_FSET?.variant ?? CTX_FORM?.variant ?? "bordered",
    rounded = CTX_FSET?.rounded ?? CTX_FORM?.rounded ?? "md",
    reset = CTX_FSET?.reset ?? CTX_FORM?.reset ?? false,
    helperText,
    labelClasses,
    wrapperClasses,
    ...props
  } : Props & INPUT_CONFIG = $props()
  
  const id: string = props?.id as string ?? generateToken()
  let C:INPUT_CONFIG = {rounded, size, variant, reset}

  setContext('FORM', C)
</script>

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="relative flex flex-col gap-1 focus-within">
    <input type="file"name="file" {id} {...props} class={inputClasses(C, props, "file")} bind:files aria-describedby={helperText ? `${id}-helper` : null} />
    {#if helperText}
      <HelperText id={id + "-helper"}>
        {#if typeof helperText === "function"} {@render helperText()}
        {:else} {@html helperText} {/if}
      </HelperText>
    {/if}
  </div>
</div>