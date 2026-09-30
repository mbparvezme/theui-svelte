<script lang="ts">
  import type { INPUT_CONFIG, INPUT_TYPE } from "$lib/types"
	import { generateToken, coreSpeed, coreReset } from "$lib/function"
	import { inputContainerClass, inputClasses } from "$lib/Form/form"
  import { getContext, setContext, type Snippet } from "svelte"
  import { HelperText, Label } from "$lib"
	import { twMerge } from "tailwind-merge"

  interface Props {
    children?: Snippet,
    type?: INPUT_TYPE,
    value?: string,
    helperText?: Snippet|string,
    labelClasses?: string,
    wrapperClasses?: string,
    [key: string] : unknown
  }

  const CTX: INPUT_CONFIG = getContext('FIELDSET') ?? getContext('FORM') ?? {}

  let {
    children,
    type = "text",
    value = $bindable(),
    helperText,

    variant = CTX?.variant ?? "bordered",
    // Own variant differs from the group's: follow it; otherwise use the group's floatingLabel
    floatingLabel = variant !== CTX?.variant ? variant === "flat" : (CTX?.floatingLabel ?? variant === "flat"),
    size = CTX?.size ?? "md",
    rounded = CTX?.rounded ?? "md",
    animationSpeed = CTX?.animationSpeed ?? coreSpeed(),

    labelClasses = CTX?.labelClasses ?? "",
    wrapperClasses = "",
    reset = CTX?.reset ?? coreReset(),
    ...props
  } : Props & INPUT_CONFIG = $props()

  const id = $derived((props.id as string | undefined) ?? generateToken())
  let C:INPUT_CONFIG & {type: "input", inputType: INPUT_TYPE} = $derived({animationSpeed, floatingLabel, labelClasses, rounded, size, variant, reset, type: "input", inputType: type})
  let setType = (node: HTMLInputElement) => { $effect(() => { node.type = type }) }

  // Lets the Label use this input's own settings (e.g. floatingLabel set on the Input)
  setContext('INPUT_LABEL', {
    get floatingLabel() { return floatingLabel },
    get variant() { return variant },
    get size() { return size },
    get animationSpeed() { return animationSpeed },
    get reset() { return reset },
  } satisfies INPUT_CONFIG)
</script>

<div class={twMerge(inputContainerClass(C, false ), wrapperClasses)}>
  {#if children && !floatingLabel}
    <Label for={id} class={labelClasses}>{@render children()}</Label>
  {/if}

  <div class="relative flex focus-within">
    {#if type == "textarea"}
      <textarea {id} rows=3 {...props} class={inputClasses(C, props)} placeholder={(props?.placeholder as string | undefined) ?? " "} bind:value aria-describedby={helperText ? `${id}-helper` : null}></textarea>
    {:else}
      <input {id} {...props} class={inputClasses(C, props)} placeholder={(props?.placeholder as string | undefined) ?? " "} bind:value use:setType aria-describedby={helperText ? `${id}-helper` : null}/>
    {/if}
    {#if floatingLabel && children}
      <Label for={id} class={labelClasses}>{@render children()}</Label>
    {/if}
  </div>

  {#if helperText}
    <HelperText id={id + "-helper"}>
      {#if typeof helperText === "function"}
        {@render helperText()}
      {:else}
        {helperText}
      {/if}
    </HelperText>
  {/if}
</div>
