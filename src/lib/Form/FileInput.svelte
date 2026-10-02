<script lang="ts">
  import type { INPUT_CONFIG } from "$lib/types"
	import { generateToken, coreReset } from "$lib/function"
	import { inputContainerClass, inputClasses } from "$lib/Form/form"
  import { getContext, type Snippet } from "svelte"
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

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    files = $bindable(),
    size = CTX?.size ?? "md",
    variant = CTX?.variant ?? "bordered",
    rounded = CTX?.rounded ?? "md",
    reset = CTX?.reset ?? coreReset(),
    helperText,
    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses,
    ...props
  } : Props & INPUT_CONFIG = $props()
  
  const id = $derived((props.id as string | undefined) ?? generateToken())
  let C:INPUT_CONFIG = $derived({rounded, size, variant, reset})
</script>

<div class={twMerge(inputContainerClass(C, true ), wrapperClasses)}>
  {#if children}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="relative flex flex-col gap-1 focus-within">
    <input bind:files type="file" {id} {...props} class={inputClasses(C, props, "file")} aria-disabled={props?.disabled as boolean | undefined} aria-describedby={helperText ? `${id}-helper` : null} />
    {#if helperText}
      <HelperText id={id + "-helper"}>
        {#if typeof helperText === "function"} {@render helperText()}
        {:else} {helperText} {/if}
      </HelperText>
    {/if}
  </div>
</div>
